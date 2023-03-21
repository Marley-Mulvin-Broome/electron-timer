import { isElement, enableScroll, disableScroll } from '../logic/utility.js';

export class Modal {
  #modal;
  #modalContent;

  #modalOpen = false;

  constructor(allowKeyevent = false, content = undefined) {

    this.#modal = document.createElement('div');
    this.#modal.classList.add('modal');
    this.#modal.classList.add('modal-off');

    this.#modalContent = document.createElement('div');
    this.#modalContent.classList.add('modal-content');
    
    if (content !== undefined) {
      this.#modalContent.appendChild(content);
    }

    this.#modal.appendChild(this.#modalContent);

    document.body.appendChild(this.#modal);

    if (allowKeyevent) {
      window.addEventListener('keydown', (event) => this.feedKeyPress(event.key));
    }
  }

  open() {
    if (this.#modalOpen) {
      return;
    }

    disableScroll();

    this.#modalOpen = true;
    this.#modal.classList.remove('modal-off');
  }

  close() {
    if (!this.#modalOpen) {
      return;
    }

    enableScroll();

    this.#modalOpen = false;

    this.#modal.classList.add('modal-off');
  }

  feedKeyPress(key) {
    if (key === 'Escape') {
      this.close();
    }
  }

  addContent(content) {
    if (!isElement(content)) {
      throw new Error('Modal content must be an element.');
    }

    this.#modalContent.appendChild(content);
  }
}