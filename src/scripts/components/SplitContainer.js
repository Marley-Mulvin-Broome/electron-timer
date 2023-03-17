export class SplitContainer {
  #leftContainer;
  #rightContainer;
  #container;
  #leftContent;
  #rightContent;

  constructor(leftContent, rightContent, leftWidth, rightWidth) {
    this.#leftContent = leftContent;
    this.#rightContent = rightContent;

    this.#container = document.createElement('div');
    this.#container.classList.add('split-container');
    this.#leftContainer = this.#createSubContainer(this.#leftContent, leftWidth);
    this.#rightContainer = this.#createSubContainer(this.#rightContent, rightWidth);
    this.#container.appendChild(this.#leftContainer);
    this.#container.appendChild(this.#rightContainer);
  }

  place(parent) {
    parent.appendChild(this.#container);
  }

  /**
   * Creates a sub container for content in a partition of the 
   * @param {HTMLElement} content Element to be contained 
   * @param {string} width The CSS property for sizing the width
   * @returns {HTMLElement} The container element created
   */
  #createSubContainer(content, width) {
    const subContainer = document.createElement('div');
    subContainer.classList.add('split-container-sub');

    subContainer.appendChild(content);
    subContainer.setAttribute('style', `width: ${width};`);

    return subContainer;
  }

  get leftContent() {
    return this.#leftContent;
  }

  get rightContent() {
    return this.#rightContent;
  }
}