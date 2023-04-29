import { createCheckbox, ignoreTabIndex } from '../logic/utility.js';

export class TimerSettings {
  #container;
  
  #title;

  #key;

  #intervalLabel;
  #intervalCheckbox;
  #intervalButton;
  #loopLabel;
  #loopCheckbox;
  #loopCount;
  
  #targetTimer;
  #audioMenu;

  #children = {
    titleElement: undefined,
    loopContainer: undefined,
    intervalContainer: undefined,
    audioButton: undefined
  };

  constructor(key, targetTimer, audioMenu, title='Untitled Timer') {
    if (typeof key !== 'number') {
      throw new Error('TimerSettings key must be a number');
    }

    if (typeof title !== 'string') {
      throw new Error('TimerSettings title must be a string');
    }

    this.#title = title;
    this.#key = key;
    this.#targetTimer = targetTimer;
    this.#audioMenu = audioMenu;

    this.#container = document.createElement('div');
    this.#container.classList.add('timer-settings');

    this.#children.titleElement = this.#createTitle();

    this.#children.loopContainer = this.#createLoopContainer();
    this.#loopLabel = this.#createLoopLabel();
    this.#loopCheckbox = this.#createLoopCheckbox();
    this.#loopCount = this.#createLoopCount();

    this.#children.loopContainer.appendChild(this.#loopLabel);
    this.#children.loopContainer.appendChild(this.#loopCheckbox);
    this.#children.loopContainer.appendChild(this.#loopCount);

    this.#children.intervalContainer = this.#createIntervalContainer();

    this.#intervalLabel = this.#createIntervalLabel();

    this.#intervalCheckbox = this.#createIntervalCheckbox();

    this.#intervalButton = this.#createIntervalButton();

    this.#children.intervalContainer.appendChild(this.#intervalLabel);
    this.#children.intervalContainer.appendChild(this.#intervalCheckbox);
    this.#children.intervalContainer.appendChild(this.#intervalButton);

    this.#children.audioButton = this.#createAudioButton();

    for (const child of Object.values(this.#children)) {
      if (child !== undefined) {
        child.classList.add('timer-settings-child');
        child.classList.add('timer-settings-space-even');

        this.#container.appendChild(child);
      }
    }

    ignoreTabIndex(this.#container);
    ignoreTabIndex(this.#children.titleElement);
    ignoreTabIndex(this.#children.loopContainer);
    ignoreTabIndex(this.#children.intervalContainer);
    ignoreTabIndex(this.#children.audioButton);

    this.#children.titleElement.onclick = () => {
      // add an input over the title element
      const input = document.createElement('input');
      input.classList.add('timer-title-input');
      input.value = this.#title;
      input.onblur = () => {
        this.#title = input.value;
        this.#children.titleElement.innerText = input.value;
      };

      this.#children.titleElement.innerText = '';
      this.#children.titleElement.appendChild(input);
      input.focus();
    };

    const onLoopChange = () => {
      targetTimer.setLoop(this.#loopCheckbox.checked, this.#loopCount.value);
    };

    this.#loopCheckbox.onchange = () => onLoopChange();

    this.#loopCount.onchange = () => onLoopChange();
  }

  enableLoop() {
    this.#loopCheckbox.checked = true;
    this.#loopCount.disabled = false;
    this.#loopCount.classList.remove('timer-settings-disabled');
  }

  disableLoop() {
    this.#loopCheckbox.checked = false;
    this.#loopCount.disabled = true;
    this.#loopCount.classList.add('timer-settings-disabled');
  }

  enableInterval() {
    this.#intervalCheckbox.checked = true;
    this.#intervalButton.disabled = false;
    this.#intervalButton.classList.remove('timer-settings-disabled');
  }

  disableInterval() {
    this.#intervalCheckbox.checked = false;
    this.#intervalButton.disabled = true;
    this.#intervalButton.classList.add('timer-settings-disabled');
  }

  get container() {
    return this.#container;
  }

  get key() {
    return this.#key;
  }

  #createTitle() {
    const title = document.createElement('h2');
    title.classList.add('timer-title');
    title.innerText = this.#title;

    return title;
  }

  #createLoopContainer() {
    const container = document.createElement('div');
    container.classList.add('timer-settings-loop-container');

    return container;
  }

  #createLoopLabel() {
    const label = document.createElement('label');
    label.innerText = 'Loop';
    label.htmlFor = 'loop-checkbox' + this.#key;

    return label;
  }

  #createLoopCheckbox() {
    const checkbox = createCheckbox('loop-checkbox' + this.#key);

    ignoreTabIndex(checkbox);

    checkbox.onclick = () => {
      if (checkbox.checked) {
        this.enableLoop();
      } else {
        this.disableLoop();
      }
    };

    return checkbox;
  }

  #createLoopCount() {
    const count = document.createElement('input');
    count.type = 'number';
    count.id = 'loop-count' + this.#key;
    count.value = 1;
    count.min = 0;
    count.max = 100;
    count.disabled = true;
    count.classList.add('timer-settings-loop-count');
    count.classList.add('timer-settings-disabled');

    return count;
  }

  #createIntervalContainer() {
    const container = document.createElement('div');
    container.classList.add('timer-settings-interval-container');

    return container;
  }

  #createIntervalLabel() {
    const label = document.createElement('label');
    label.innerText = 'Interval';
    label.htmlFor = 'interval-checkbox' + this.#key;

    return label;
  }

  #createIntervalCheckbox() {
    const checkbox = createCheckbox('interval-checkbox' + this.#key);

    ignoreTabIndex(checkbox);

    checkbox.onclick = () => {
      if (checkbox.checked) {
        this.enableInterval();
      } else {
        this.disableInterval();
      }
    };

    return checkbox;
  }

  #createIntervalButton() {
    const button = document.createElement('button');
    button.id = 'interval-button' + this.#key;
    button.innerText = 'Set Interval';
    button.disabled = true;
    button.classList.add('timer-settings-interval-button');
    button.classList.add('timer-settings-disabled');

    return button;
  }

  #createAudioButton() {
    const button = document.createElement('button');
    button.classList.add('timer-settings-audio-button');
    button.id = 'audio-button' + this.#key;
    button.innerText = 'Set Audio';
    button.onclick = () => {
      this.#audioMenu.open();
      this.#audioMenu.setTarget(this.#targetTimer);
    };

    return button;
  }

}