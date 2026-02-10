import copy
import datetime
import glob
import os
import sys
import threading
from os import path
from urllib.parse import urlparse, ParseResult

import yaml
from bs4 import BeautifulSoup
from flask import Flask, render_template, send_from_directory, request
from flask_frozen import Freezer, walk_directory
from hashlib import md5
from yaml import FullLoader

from src.navigation import process_nav, get_current_url
from src.externals import process_nav_includes
from src.processors.processors import set_replace_simple_code
from src.ktl_components import KTLComponentExtension

app = Flask(__name__, static_folder='_assets')
app.config.from_pyfile('mysettings.py')
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
freezer = Freezer(app)
build_mode = False
build_contenteditable = False

root_folder = path.join(os.path.dirname(__file__))
data_folder = path.join(os.path.dirname(__file__), "data")

_nav_cache = None
_nav_lock = threading.RLock()

_cached_asset_version = {}

def get_asset_version(filename):
    if filename in _cached_asset_version:
        return _cached_asset_version[filename]

    filepath = (root_folder if  root_folder  else ".") + filename
    if filename and path.exists(filepath):
        with open(filepath, 'rb') as file:
            digest = md5(file.read()).hexdigest()
            _cached_asset_version[filename] = digest
            return digest
    return None

def get_site_data():
    data = {}
    for data_file in os.listdir(data_folder):
        if data_file.startswith('_'):
            continue
        if not data_file.endswith(".yml"):
            continue
        data_file_path = path.join(data_folder, data_file)
        with open(data_file_path, encoding="UTF-8") as stream:
            try:
                file_name_without_extension = data_file[:-4] if data_file.endswith(".yml") else data_file
                data[file_name_without_extension] = yaml.load(stream, Loader=FullLoader)
            except yaml.YAMLError as exc:
                sys.stderr.write('Cant parse data file ' + data_file + ': ')
                sys.stderr.write(str(exc))
                sys.exit(-1)
            except IOError as exc:
                sys.stderr.write('Cant read data file ' + data_file + ': ')
                sys.stderr.write(str(exc))
                sys.exit(-1)
    return data


site_data = get_site_data()


def get_nav():
    global _nav_cache
    global _nav_lock

    with _nav_lock:
        if _nav_cache is not None:
            nav = _nav_cache
        else:
            nav = get_nav_impl()

        nav = copy.deepcopy(nav)

        if build_mode:
            _nav_cache = copy.deepcopy(nav)

    # NOTE. This call depends on `request.path`, cannot cache
    process_nav(request.path, nav)
    return nav

def get_nav_impl():
    with open(path.join(data_folder, "_nav.yml")) as stream:
        nav = yaml.load(stream, Loader=FullLoader)
        nav = process_nav_includes(build_mode, nav)
        return nav


@app.context_processor
def add_year_to_context():
    return {
        'year': datetime.datetime.now().year
    }


app.jinja_env.add_extension(KTLComponentExtension)


@app.context_processor
def add_data_to_context():
    nav = get_nav()
    return {
        'nav': nav,
        'data': site_data,
        'site': {
            'data': site_data,
        },
        'headerCurrentUrl': get_current_url(nav['subnav']['content']),
    }

@app.template_filter('get_domain')
def get_domain(url):
    return urlparse(url).netloc

app.jinja_env.globals['get_domain'] = get_domain


@app.template_filter('split_chunk')
def split_chunk(list, size):
    return [list[i:i+size] for i in range(len(list))[::size]]

app.jinja_env.globals['split_chunk'] = split_chunk


@app.template_filter('autoversion')
def autoversion_filter(filename):
    asset_version = get_asset_version(filename)
    if asset_version is None: return filename
    original = urlparse(filename)._asdict()
    original.update(query=original.get('query') + '&v=' + asset_version)
    return ParseResult(**original).geturl()


@app.route('/')
def index_page():
    return render_template('pages/index.html',
                           is_index_page=True,
                           )


@app.route('/assets/<path:path>')
def asset(path):
    return send_from_directory('assets', path)


@freezer.register_generator
def asset():
    for filename in walk_directory(path.join(root_folder, "assets")):
        yield {'path': filename}


@app.after_request
def add_header(request):
    request.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    request.headers["Pragma"] = "no-cache"
    request.headers["Expires"] = "0"
    request.headers['Cache-Control'] = 'public, max-age=0'
    return request


if __name__ == '__main__':
    print("\n\n\nRunning new KotlinWebSite generator/dev-mode:\n")

    argv_copy = []
    for arg in sys.argv:
        print("arg: " + arg)

        if arg == "--editable":
            build_contenteditable = True
        else:
            argv_copy.append(arg)

    print("\n\n")
    print("build_contenteditable: " + str(build_contenteditable))
    print("\n\n")

    set_replace_simple_code(build_contenteditable)

    with (open(path.join(root_folder, "_nav-mapped.yml"), 'w')) as output:
        yaml.dump(get_nav_impl(), output)

    if len(argv_copy) > 1:
        if argv_copy[1] == "build":
            build_mode = True
            freezer.freeze()
        else:
            print("Unknown argument: " + argv_copy[1])
            sys.exit(1)
    else:
        app.run(host="0.0.0.0", port=8080, debug=True, threaded=True, **{"extra_files": {
            '/src/data/_nav.yml',
            *glob.glob("/src/pages-includes/**/*", recursive=True),
        }})
