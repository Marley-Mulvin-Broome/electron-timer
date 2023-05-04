import { IntervalPill } from './IntervalPill.js';
import { isElement } from '../logic/utility.js';

export class IntervalMenu {
  #intervalPills;
  #menuElement;

  constructor(targetElement) {
    if (!isElement(targetElement)) 
      throw new Error('targetElement must be a valid DOM element');

    this.#intervalPills = [];

    this.#menuElement = document.createElement('div');
    this.#menuElement.classList.add('interval-menu');
    this.#menuElement.classList.add('hidden');

    targetElement.appendChild(this.#menuElement);
  }

  show(intervals) {
    this.#intervalPills = intervals.map(interval => {
      const pill = new IntervalPill(interval);
      this.#menuElement.appendChild(pill.element);
      return pill;
    });

    this.#menuElement.classList.remove('hidden');
  }

  hide() {
    this.#intervalPills.forEach(pill => pill.destroy());
    this.#intervalPills = [];

    this.#menuElement.classList.add('hidden');
  }
}