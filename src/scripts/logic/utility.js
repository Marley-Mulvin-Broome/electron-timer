export function isElement(obj) {
  return obj instanceof HTMLElement;
}

export function stylesheetIncluded(fileName) {
  if (typeof fileName !== 'string') {
    throw new Error('stylesheetIncluded() expects a string');
  }

  const links = document.head.getElementsByTagName('link');

  for (const link of links) {
    const splitHref = link.getAttribute('href').split('/');
    const fName = splitHref[splitHref.length - 1];

    if (fName === fileName) {
      return true;
    }
  }

  return false;
}

export function getRunningDirectory() {
  let scripts = document.getElementsByTagName('script');
  return scripts[scripts.length-1].src;
}

export function linkStyleSheet(href) {
  if (typeof href !== 'string') {
    throw new Error('linkStyleSheet() expects a string');
  }

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

export function createCheckbox(id) {
  if (typeof id !== 'string') {
    throw new Error('createCheckbox() expects a string');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = false;
  checkbox.id = id;

  return checkbox;
}

/**
 * Checks if a variable is a number
 * @param {any} value Value to check
 * @returns {Boolean} Whether the value is a number or not
 */
export function isNumber(value) {
  return !isNaN(value);
}

export function disableScroll() {
  document.body.style.overflow = 'hidden';
}

export function enableScroll() {
  document.body.style.overflow = 'auto';
}

export function ignoreTabIndex(element) {
  if (!isElement(element)) {
    throw new Error('ignoreTabIndex() expects an element');
  }

  element.setAttribute('tabindex', '-1');
}

export function getFileName(path) {
  if (typeof path !== 'string') {
    throw new Error('getFileName() expects a string');
  }

  const splitPath = path.split('/');
  return splitPath[splitPath.length - 1].split('.')[0];
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// THIS CODE TAKEN FROM HERE https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
export function disableScrollElegant() {
  window.addEventListener(wheelEvent, preventDefault, { passive: false }); // modern desktop
  window.addEventListener('touchmove', preventDefault, { passive: false }); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScrollElegant() {
  window.removeEventListener(wheelEvent, preventDefault, { passive: false }); 
  window.removeEventListener('touchmove', preventDefault, { passive: false });
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}