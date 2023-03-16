function isElement(obj) {
	return obj instanceof HTMLElement;
}

function stylesheetIncluded(fileName) {
	const links = document.head.getElementsByTagName('link');

	for (const link of links) {
		let splitHref = link.getAttribute('href').split('/');
		let fName = splitHref[splitHref.length - 1];

		if (fName === fileName) {
			return true;
		}
	}

	return false;
}

function getRunningDirectory() {
	let scripts = document.getElementsByTagName('script');
	return scripts[scripts.length-1].src;
}

function linkStyleSheet(href) {
	const link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', href);
	document.head.appendChild(link);
}

/**
 * Checks if a variable is a number
 * @param {any} value Value to check
 * @returns {Boolean} Whether the value is a number or not
 */
function isNumber(value) {
	return !isNaN(value);
}

export { isElement, stylesheetIncluded, getRunningDirectory, linkStyleSheet, isNumber };