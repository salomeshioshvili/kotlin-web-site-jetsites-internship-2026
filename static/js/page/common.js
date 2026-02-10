import 'core-js/stable/promise';
import 'whatwg-fetch';
import {initComponents} from '../ktl-component';

function addNavigatorType() {
  const html = document.getElementsByTagName('html')[0];

  html.className = html.className.replace('no-js', '');

  // OS detection
  if (navigator.userAgent.indexOf('Linux') > -1)
    html.className += ' os_linux';

  // Browser detection
  if ('chrome' in window)
    html.className += ' ua_chrome';
  else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
    html.className += ' ua_firefox';
}

(function () {
  document.addEventListener("touchstart", function () {}, false);

  addNavigatorType();

  initComponents();
})();
