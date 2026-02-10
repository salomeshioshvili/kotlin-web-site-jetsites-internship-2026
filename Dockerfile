FROM python:3.6

RUN apt-get update && \
    apt-get install -y build-essential ruby

# see markdown.py for kramdown version
RUN gem install kramdown -v 1.14.0

COPY requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN corepack enable

# Install node dependencies for KTL components (react-renderer)
COPY package.json yarn.lock /src/
WORKDIR /src
RUN yarn install

EXPOSE 8080
ENTRYPOINT ["python", "/src/kotlin-website.py"]
