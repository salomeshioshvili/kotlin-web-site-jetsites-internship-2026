import {createElement} from 'react';
import {render} from 'react-dom';

import Header from './header/index.jsx';
import Footer from './footer/index.jsx';

export const initComponents = () => {
  getKTLComponentsComments().forEach(({name, node, props}) => {
    switch (name) {
      case 'header':
        initKTLComponent(node.nextElementSibling, Header, {
          ...props,
          onSearchClick: () => {/* no op */},
        });
        break;
      case 'footer':
        initKTLComponent(node.nextElementSibling, Footer, props);
        break;
      default:
        console.error(`The "${name}" component was not found.`);
        break;
    }
  });
}

function getKTLComponentsComments() {
  const comment = ' ktl_component: ';

  const result = [];
  let currentNode = null;

  const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ALL);

  while (currentNode = iterator.nextNode()) {
    if (currentNode.nodeType === 8) {
      const {nodeValue} = currentNode;

      if (nodeValue.startsWith(comment)) {
        const {name, props} = JSON.parse(nodeValue.substring(comment.length));

        result.push({
          name: name,
          props: props,
          node: currentNode,
        });
      }
    }
  }

  return result;
}

function initKTLComponent(node, Component, props) {
  const container = document.createElement('div');
  render(createElement(Component, props), container);
  node.replaceWith(container.firstChild || container);
}