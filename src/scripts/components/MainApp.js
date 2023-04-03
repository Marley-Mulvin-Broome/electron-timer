import { ignoreTabIndex } from '../logic/utility.js';
import { SplitContainer } from './SplitContainer.js';
import { Timer } from './Timer.js';
import { TimerSettings } from './TimerSettings.js';
import { AudioMenu } from './AudioMenu.js';

const SPLIT_CONTAINER_LEFT = '30%';
const SPLIT_CONTAINER_RIGHT = '70%';

export class MainApp {
  #children;

  #timersContainer;

  #selectedTimer;

  #addTimerButton;

  #curMaxTabIndex = 0;

  #audioMenu;

  constructor() {
    this.#children = [];

    this.#timersContainer = document.createElement('div');
    this.#timersContainer.classList.add('timers-container');

    this.#selectedTimer = undefined;

    this.#audioMenu = new AudioMenu();

    this.addTimer();

    this.#addTimerButton = document.createElement('button');
    this.#addTimerButton.classList.add('add-timer-button');
    this.#addTimerButton.innerHTML = '+';
    this.#addTimerButton.onclick = () => {
      this.addTimer();
    };

    document.body.appendChild(this.#timersContainer);
    document.body.appendChild(this.#addTimerButton);
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
    if (this.#selectedTimer !== undefined && document.activeElement.tagName !== 'INPUT') {
      this.#selectedTimer.feedKeyPress(key);
    }
  }

  closeOpenModel() {
    const openModel = document.querySelector('.modal:not(.modal-off)');

    if (openModel !== null) {
      openModel.click();
      return;
    }

    console.warn('closeOpenModel() No open modal to close');
  }

  addTimer() {
    const timer = new Timer(this.#curMaxTabIndex++);
    timer.style = 'margin-left: auto;';

    //this.#addTimerButton.setAttribute('tabindex', this.#curMaxTabIndex);

    const timerSettings = new TimerSettings(this.#curMaxTabIndex - 1, timer, this.#audioMenu, 'Untitled Timer');

    this.#children.push(timer);

    timer.onclick = () => {
      this.selectTimer(timer);
    };

    timer.onfocus = () => {
      this.selectTimer(timer);
    };


    const splitContainer = new SplitContainer(timerSettings.container, timer.container, SPLIT_CONTAINER_LEFT, SPLIT_CONTAINER_RIGHT);
    const splitContainerContainer = document.createElement('div');
    
    const removeTimerButton = document.createElement('button');
    removeTimerButton.classList.add('remove-timer-button');
    removeTimerButton.classList.add('remove-timer-button-off');
    removeTimerButton.innerHTML = 'X';
    removeTimerButton.onclick = () => {
      this.removeTimer(timer, splitContainerContainer);
    };

    splitContainerContainer.classList.add('split-container-container');

    splitContainerContainer.appendChild(removeTimerButton);
    splitContainerContainer.onmouseenter = () => {
      removeTimerButton.classList.remove('remove-timer-button-off');
    };

    splitContainerContainer.onmouseleave = () => {
      removeTimerButton.classList.add('remove-timer-button-off');
    };

    splitContainer.place(splitContainerContainer);
    splitContainer.onclick = () => {
      this.selectTimer(timer);
    };

    ignoreTabIndex(splitContainer.container);
    ignoreTabIndex(splitContainerContainer);
    ignoreTabIndex(removeTimerButton);

    this.#timersContainer.appendChild(splitContainerContainer);
  }

  removeTimer(timer, container) {
    if (typeof timer !== 'object') {
      throw new Error('MainApp.removeTimer() expects a Timer object');
    }

    if (typeof container !== 'object') {
      throw new Error('MainApp.removeTimer() expects a container object');
    }

    const index = this.#children.indexOf(timer);

    if (index === -1) {
      throw new Error('MainApp.removeTimer() could not find timer in children');
    }

    this.#children.splice(index, 1);

    this.#timersContainer.removeChild(container);

    if (this.#selectedTimer === timer) {
      this.#selectedTimer = undefined;
    }

    if (this.#children.length === 0) {
      this.addTimer();
      this.selectTimer(this.#children[0]);
    }

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