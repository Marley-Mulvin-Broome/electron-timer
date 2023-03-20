import { isElement, enableScroll, disableScroll } from '../logic/utility.js';

export class Modal {
  #modal;
  #modalContent;

  #modalOpen = false;

  constructor(content) {
    if (!isElement(content)) {
      throw new Error('Modal content must be an element.');
    }

    this.#modal = document.createElement('div');
    this.#modal.classList.add('modal');
    this.#modal.classList.add('modal-off');

    this.#modalContent = document.createElement('div');
    this.#modalContent.classList.add('modal-content');
    this.#modalContent.appendChild(content);

    this.#modal.appendChild(this.#modalContent);

    document.body.appendChild(this.#modal);

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
}