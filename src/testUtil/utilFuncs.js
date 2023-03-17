export function clearDom() {
  document.body.innerHTML = '';
}

export function domHas($, selector) {
  return $('body').has(selector).length;
}

export function hasAttr(jqueryObj, attr) {
  return jqueryObj.attr(attr) !== undefined;
}