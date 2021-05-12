import { SubMenu, MenuItem } from 'rc-menu';
import { createElement, cloneElement } from 'react';

function buildMenu(array = []) {
  let menu = [];
  for (const item of array) {
    if (item.children && Array.isArray(item.children)) {
      menu.push(getMenu([item], [], item.groupName));
    } else {
      menu.push(
        createElement(MenuItem, { key: item.title, ...item }, item.title),
      );
    }
  }
  return menu;
}

// eslint-disable-next-line default-param-last
function getMenu(array = [], nodes = [], key, parentIndex = 0) {
  let _nodes = nodes;
  let children = [];

  if (parentIndex !== -1 && _nodes[parentIndex]) {
    _nodes[parentIndex] = cloneElement(_nodes[parentIndex], {}, children);
  }

  for (const index in array) {
    if (array[index].children && Array.isArray(array[index].children)) {
      const node = createElement(SubMenu, {
        key: index + key,
        title: array[index].groupName,
      });
      _nodes.push(node);
      return getMenu(array[index].children, _nodes, index + key, 0);
    } else {
      children.push(
        createElement(
          MenuItem,
          { key: index + key, ...array[index] },
          array[index].title,
        ),
      );
    }
  }
  return _nodes;
}

function mapTreeToFlatArray(array = []) {
  let routes = [];
  for (const item of array) {
    if (item.children && Array.isArray(item.children)) {
      routes = routes.concat(getFlatArray([item], []));
    } else {
      routes.push(item);
    }
  }
  return routes;
}

function getFlatArray(inputArray = [], children = []) {
  let _children = children;

  for (const item of inputArray) {
    if (item.children && Array.isArray(item.children)) {
      return getFlatArray(item.children, _children);
    } else {
      children.push(item);
    }
  }
  return _children;
}

function getKey(filePath = '') {
  const match = new RegExp(/^(?<path>.*)\/(?<file>[^/]*)$/g).exec(filePath);
  let parentFolderName = '';
  if (match) {
    const parentPath = match[1].split('/');
    parentFolderName =
      parentPath.length > 2
        ? parentPath[parentPath.length - 2] + parentPath[parentPath.length - 1]
        : parentPath[parentPath.length - 1];
  }
  return parentFolderName + filePath.replace(/\.|\s|\//g, '');
}

export { buildMenu, getKey, mapTreeToFlatArray };
