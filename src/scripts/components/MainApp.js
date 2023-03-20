import { SplitContainer } from './SplitContainer.js';
import { Timer } from './Timer.js';
import { TimerSettings } from './TimerSettings.js';

const SPLIT_CONTAINER_LEFT = '30%';
const SPLIT_CONTAINER_RIGHT = '70%';

export class MainApp {
  #children;

  #timersContainer;

  #selectedTimer;

  constructor() {
    this.#children = [];

    this.#timersContainer = document.createElement('div');
    this.#timersContainer.classList.add('timers-container');

    this.#selectedTimer = undefined;

    this.addTimer();

    document.body.appendChild(this.#timersContainer);
  }

  get modalOpen() {
    return document.querySelector('.modal:not(.modal-off)') !== null;
  }

  start() {
    window.addEventListener('keydown', (event) => this.feedKeyPress(event.key));
  
    if (this.#children.length === 0) {
      this.addTimer();
    }

    this.selectTimer(this.#children[0]);

  }

  feedKeyPress(key) {
    if (this.#selectedTimer !== undefined) {
      this.#selectedTimer.feedKeyPress(key);
    }

    if (key === 'Escape' && this.modalOpen) {
      this.closeOpenModel();
    }
  }

  closeOpenModel() {
    const openModel = document.querySelector('.modal:not(.modal-off)');

    if (openModel !== null) {
      openModel.classList.add('modal-off');
      return;
    }

    console.warn('closeOpenModel() No open modal to close');
  }

  addTimer() {
    const timer = new Timer(this.#children.length);
    timer.style = 'margin-left: auto;';
    const timerSettings = new TimerSettings(this.#children.length, `Timer ${this.#children.length}`);

    this.#children.push(timer);

    timer.onclick = () => {
      this.selectTimer(timer);
    };

    timer.onfocus = () => {
      this.selectTimer(timer);
    };


    const splitContainer = new SplitContainer(timerSettings.container, timer.container, SPLIT_CONTAINER_LEFT, SPLIT_CONTAINER_RIGHT);
    splitContainer.place(this.#timersContainer);
    splitContainer.onclick = () => {
      this.selectTimer(timer);
    };
  }

  selectTimer(timer) {
    if (typeof timer !== 'object') {
      throw new Error('MainApp.selectTimer() expects a Timer object');
    }

    if (this.#selectedTimer !== undefined) {
      this.#selectedTimer.select(false);
    }

    this.#selectedTimer = timer;

    this.#selectedTimer.select(timer);
  }
}