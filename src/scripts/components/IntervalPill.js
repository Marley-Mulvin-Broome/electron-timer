export class IntervalPill {
  #intervalPill;
  #intervalPillText;
  #intervalPillRemoveButton;

  #interval;

  constructor(interval) {
    this.#interval = interval;

    this.#intervalPill = document.createElement('div');
    this.#intervalPill.classList.add('interval-pill');

    this.#intervalPillText = document.createElement('p');
    this.#intervalPillText.classList.add('interval-pill-text');
    this.#intervalPillText.innerText = interval.toString();

    this.#intervalPill.appendChild(this.#intervalPillText);

    this.#intervalPillRemoveButton = document.createElement('button');
    this.#intervalPillRemoveButton.classList.add('interval-pill-remove-button');
    this.#intervalPillRemoveButton.innerHTML = 'x';
    this.#intervalPillRemoveButton.onclick = () => {
      this.#intervalPill.remove();
    };

    this.#intervalPill.appendChild(this.#intervalPillRemoveButton);
  }

  get interval() {
    return this.#interval;
  }

  get element() {
    return this.#intervalPill;
  }

  destroy() {
    this.#intervalPill.remove();
  }
}