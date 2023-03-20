import { isElement, stylesheetIncluded, isNumber } from '../logic/utility.js';
import { Time } from '../logic/Time.js';

if (!stylesheetIncluded('timer.css')) {
  console.warn('Style sheet not loaded!!');
}


const ONE_SECOND = 1000;

export class Timer {
  static STARTING_INDEX = 7;

  forceSelection = false;

  #storedTime;
  #runningTime;

  #spans;
  #selectedIndex;
  #isSelected;
  #container;
  #started = false;
  #paused = false;
  #intervalObject = null;
  #displaySpan;
  #readonly = false;

  #fullscreenButton;
  #fullscreen = false;

  #hasButtons;
  #buttonContainer = undefined;
  #buttonStart;
  #buttonStop;

  #audioElement;

  /**
   * Creates a new timer object. This includes a container and the spans inside it
   * @param {HTMLElement} parent Element that will be parent to the timer component
   * @param {tabindex} tabindex  The tab index this element has, -1 for none
   */
  constructor(tabindex=-1, hasButtons=true, readonly=false) {
    
    this.#container = document.createElement('div');
    this.#container.classList.add('timer-container');

    this.#hasButtons = hasButtons;
    this.#readonly = readonly;

    // this.#fullscreenButton = document.createElement("button");
    // this.#fullscreenButton.classList.add("timer-fullscreen-button");
    // this.#fullscreenButton.onclick = () => {
    //   this.fullscreen();
    // }

    // this.#container.appendChild(this.#fullscreenButton);

    this.#isSelected = false;
    this.#selectedIndex = Timer.STARTING_INDEX;
    this.#displaySpan = document.createElement('span');
    this.#displaySpan.classList.add('timer-display');
    this.#hideDisplay();
    this.#container.appendChild(this.#displaySpan);
    this.#spans = [];
    this.#audioElement = new Audio('timeraudio.mp3');
    this.#audioElement.loop = false;
    this.#container.setAttribute('tabindex', tabindex);
    
    this.#storedTime = new Time(0);
    this.#runningTime = new Time(0);

    
  
    for (let i = 0; i < 9; i++) {
      const isValue = (i + 1) % 3 !== 0;
  
      let timeUnit = Time.UNIT_SECOND.display;
  
      if (i < 3) {
        timeUnit = Time.UNIT_HOUR.display;
      } else if (i < 6) {
        timeUnit = Time.UNIT_MINUTE.display;
      }
  
      this.#spans.push(
        Timer.createTimerSpan(isValue, timeUnit)
      );
    }
  
    this.#spans.forEach(
      (span) => {
        this.#container.appendChild(span);
      }
    );

    this.#addButtons();

    this.activateSpan(this.#selectedIndex);

    this.#hideSelected();
  }

  place(parent) {
    parent.appendChild(this.#container);
  }

  /**
   * Toggles whether this component is selected
   */
  toggle() {
    if (this.started) {
      this.stop();
      return;
    }

    this.start();
  }

  /**
   * Clears the current input
   */
  clearInput() {
    this.#spans.forEach((span, index) => {
      if (this.indexBounded(index)) {
        span.innerText = '0';
      }
    });
  }

  /**
   * Starts the timer
   */
  start() {
    if (this.started) {
      console.error('Error when starting timer: cannot start a timer that is already started!');
      return;
    }

    this.#buttonStop.innerText = 'Stop';
    this.#buttonStart.innerText = 'Pause';

    // set the initialTime to whatever is in the input
    let curMilliseconds = this.time;
    this.#storedTime.milliseconds = curMilliseconds;
    this.#runningTime.milliseconds = curMilliseconds;
    // change to the display
    this.hideSpans();
    this.#updateDisplay();
    this.#showDisplay();
    // start a countdown for every one second
    this.#intervalObject = setInterval(() => {
      if (this.#paused) {
        return;
      }

      if (this.#runningTime.milliseconds === 0) {
        this.stop(false);
        return;
      }

      this.#countdown();
      this.#updateDisplay();
    }, ONE_SECOND);

    this.#started = true;
  }

  /**
   * Pauses the current timer
   */
  pause() {
    this.#paused = !this.#paused;

    if (this.#paused) {
      this.#buttonStart.innerText = 'Unpause';
    } else {
      this.#buttonStart.innerText = 'Pause';
    }
  }

  /**
   * Stops the timer completely
   * @param {Boolean} suppressSound whether to suppress the end timer audio
   */
  stop(suppressSound = true) {
    if (!this.started) {
      console.error('Error when stopping timer: cannot stop timer that has not been started');
      return;
    }

    this.#buttonStart.innerText = 'Start';
    this.#buttonStop.innerText = 'Reset';

    // bring back all the spans
    this.showSpans();
    this.#hideDisplay();
    // stop timer
    clearInterval(this.#intervalObject);

    if (!suppressSound) {
      this.#audioElement.play();
    }

    this.#started = false;
  }

  /**
   * Selects the timer object unless value is set to false, then it deselects
   * @param {Boolean} value Whether to select or deselect, set to true by default
   */
  select(value = true) {
    if (this.#isSelected === value) {
      return;
    }

    this.#isSelected = value;

    if (!value) {
      this.#container.classList.remove('timer-selected');
      this.#hideSelected();
      return;
    } 

    this.#showSelected();
    this.#container.classList.add('timer-selected');
  }

  /**
   * Selects the timer index to the right of the currently selected one
   */
  selectNext() {
    if (this.#selectedIndex === this.#spans.length || this.readonly) {
      return;
    }

    this.index = this.#selectedIndex + 1;
  }

  /**
   * Selects the timer index to the left of the currently selected one
   */
  selectPrevious() {
    if (this.#selectedIndex === 0 || this.readonly) {
      return;
    }

    this.index = this.#selectedIndex - 1;
  }

  /**
   * Keeps the selected index on a span with a numerical value depending on the change between indexes
   * @param {Number} wasPositiveIncrement the previously selected index
   */
  boundIndex(previousIndex) {
    this.#selectedIndex = Timer.getBoundedIndex(this.#selectedIndex, this.#spans.length, previousIndex);
  }

  /**
   * Checks if an index is in the bounds of the span
   * @param {Number} index the index to check within bounds
   * @returns {Boolean} whether it is in bounds
   */
  indexInBounds(index) {
    return index >= 0 && index < this.#spans.length;
  }

  /**
   * Checks if a specific index is bounded (index of a numeric value)
   * @param {Number} index the index to check if bounded
   * @returns {Boolean} whether the index is bounded or not
   */
  indexBounded(index) {
    return (index + 1) % 3 !== 0;
  }

  /**
   * Activates a span based on index
   * @param {Number} index the index to activate
   */
  activateSpan(index) {
    if (this.#inboundsError(index, 'activating span')) {
      return;
    }

    this.#spans[index].classList.add('timer-active');
  }

  /**
   * Deactivates a span based on index
   * @param {Number} index the index to deactivate
   */
  deactivateSpan(index) {
    if (this.#inboundsError(index, 'deactivating span')) {
      return;
    }

    this.#spans[index].classList.remove('timer-active');
  }

  /**
   * Switches input focus to a different digit.
   * @param {Number} index Index of span to set active
   * @param {Number} prevIndex Previously selected index
   */
  setActiveSpan(index, prevIndex) {
    this.deactivateSpan(prevIndex);
    this.activateSpan(index);
  }

  /**
   * Hides a span containing a digit for input
   * @param {(Number|HTMLElement)} index The index of the span to be hidden
   */
  hideSpan(index) {
    if (isElement(index)) {
      index.classList.add('timer-hidden');
      return;
    }

    if (this.#inboundsError(index, 'hiding span')) {
      return;
    }

    this.#spans[index].classList.add('timer-hidden');
  }

  /**
   * Shows a span containg a digit for input
   * @param {(Number|HTMLElement)} index The index of the span to be shown
   */
  showSpan(index) {
    if (isElement(index)) {
      index.classList.remove('timer-hidden');
      return;
    }

    if (this.#inboundsError(index, 'showing span')) {
      return;
    }

    this.#spans[index].classList.remove('timer-hidden');
  }

  /**
   * Hides a list of spans used for displaying input
   * @param {HTMLElement[]} spans List of spans to hide
   */
  hideSpans(spans = null) {
    if (spans === null) {
      spans = this.#spans;
    }

    if (!Array.isArray(spans)) {
      console.error(`Error when hiding spans: passed parameter is not an array (${spans})`);
      return;
    }

    if (spans.length === 0) {
      console.warn('Called hide spans function with 0 spans');
      return;
    } 

    spans.forEach((span) => {
      this.hideSpan(span);
    });
  }

  /**
   * Shows a list of spans used for displayign input
   * @param {HTMLElement[]} spans List of spans to show
   */
  showSpans(spans = null) {
    if (spans === null) {
      spans = this.#spans;
    }

    if (!Array.isArray(spans)) {
      console.error(`Error when hiding spans: passed parameter is not an array (${spans})`);
      return;
    }

    if (spans.length === 0) {
      console.warn('Called hide spans function with 0 spans');
      return;
    } 

    spans.forEach((span) => {
      this.showSpan(span);
    });
  }

  

  /**
   * Feeds in input from an external source into this component
   * @param {String} key key property from event.key
   */
  feedKeyPress(key) {
    if (key === 'ArrowRight') {
      this.selectNext();
    } else if (key === 'ArrowLeft') {
      this.selectPrevious();
    } else if (key === 'Backspace') { 
      this.backspace();
    } else if (key === 'Enter' ) {
      if (!this.started) {
        this.start();
      }
    } else if (isNumber(key)) {
      this.insertDigit(parseInt(key));
    }
  }

  /**
   * Inserts a digit into the currently selected span, shifting the currently inputted time to the left
   * @param {(String|Number)} digit Digit to be inserted
   */
  insertDigit(digit) {
    if (this.readonly)
      return;

    this.#shiftLeft(this.#selectedIndex);
    this.#spans[this.#selectedIndex].innerText = digit;
  }

  /**
   * Gets the current value of a unit (s, m, h) on the timer by UNIT (See Time.UNIT_HOUR)
   * @param {Object} unit Time unit object
   * @returns {Number} Current value of that unit
   */
  getUnitTime(unit) {
    let firstIndex = 0;

    switch (unit) {
    case Time.UNIT_MINUTE:
      firstIndex = 3;
      break;
    case Time.UNIT_SECOND:
      firstIndex = 6;
      break;
    }

    return this.#parseUnitAt(firstIndex);
  }

  /**
   * Shifts the content of the input from left to right, using the currently selected index as an endpoint
   */
  backspace() {
    if (this.readonly)
      return;

    this.#shiftRight(this.#selectedIndex);
  }

  /**
   * Formats the display element's inner text to the given time object's timeString (See Time.timeString)
   * @param {Time} time Time object to format
   */
  formatDisplayElement(time) {
    let baseString = time.timeString;
  
    let currentElement = document.createElement('span');

    this.#displaySpan.innerHTML = '';

    for (let i = 0; i < baseString.length; i++) {
      if (['h', 'm', 's'].includes(baseString[i])) {
        this.#displaySpan.appendChild(currentElement);
        this.#displaySpan.appendChild(Timer.createDisplayUnit(baseString[i]));
        if (i + 1 != baseString.length) {
          currentElement = document.createElement('span');
        }
      } else {
        currentElement.innerHTML += baseString[i];
      }
    }
  }

  /**
   * Fullscreens the object NOTE: NOT IMPLEMENTED FULLY YET
   */
  fullscreen() {
    throw Error('Not implemented');

    // if (this.#fullscreen) {
    // 	// unfullscreen
    // 	this.#container.classList.remove('timer-fullscreen');
    // 	this.#fullscreen = false;
    // 	return;
    // }

    // this.#fullscreen = true;
    // this.#container.classList.add('timer-fullscreen');
  }

  startButton() {
    if (!this.selected) {
      return;
    }

    if (!this.started) {
      this.start();
      return;
    }

    this.pause();
  }

  stopButton() {
    if (!this.selected) {
      return;
    }

    if (this.started) {
      this.stop();
      return;
    }

    this.clearInput();
  }

  #addButtons() {
    if (this.#buttonContainer !== undefined) {
      this.#container.removeChild(this.#buttonContainer);
    }

    if (!this.#hasButtons)
      return;

    [this.#buttonContainer, this.#buttonStart, this.#buttonStop] = Timer.createButtons(
      this.startButton.bind(this),
      this.stopButton.bind(this)
    );

    this.#container.appendChild(this.#buttonContainer);
  }

  /**
   * 
   */
  #hideSelected() {
    this.#spans[this.#selectedIndex].classList.remove('timer-active');
  }

  #showSelected() {
    this.#spans[this.#selectedIndex].classList.add('timer-active');
  }

  #countdown() {
    this.#runningTime.milliseconds -= ONE_SECOND;
  }

  #toggleDisplay() {
    if (this.#displaySpan.classList.contains('timer-hidden')) {
      this.#showDisplay();
      return;
    }

    this.#hideDisplay();
  }

  #updateDisplay(timeObject = undefined) {
    let time = timeObject;

    if (time === undefined) {
      time = this.#runningTime;
    }

    this.formatDisplayElement(time);
  }

  #showDisplay() {
    this.#displaySpan.classList.remove('timer-hidden');
  }

  #hideDisplay() {
    this.#displaySpan.classList.add('timer-hidden');

  }

  #isSpanUnitIndicator(span) {
    if (Object.is(span)) {
      return !isNumber(span.innerText);
    }

    return !isNumber(this.#spans[span].innerText);
  }

  #parsedIndex(index) {
    if (this.#inboundsError(index, 'parsing index') || this.#boundsError('parsing index')) {
      return;
    }

    return parseInt(this.#spans[index].innerText);
  }

  #parseUnitAt(index) {
    if (this.#inboundsError(index, 'parsing unit time') || this.#boundsError('parsing unit time')) {
      return;
    }

    // assumes unit is at very left to start
    // can be changed with % determining
    // THIS WORKS
    return (10 * this.#parsedIndex(index)) + this.#parsedIndex(index + 1);
  }

  #shiftLeft(endIndex = -1) {
    this.#spans.every((span, index) => {
      if (endIndex !== -1 && index > endIndex) {
        return false;
      }

      if (isNumber(span.innerText) && index !== 0) {
        const leftIndex = Timer.getBoundedIndex(
          index - 1, 
          this.#spans.length, 
          index
        );
        
        this.#spans[leftIndex].innerText = this.#spans[index].innerText;
      }

      return true;
    });
  }

  #shiftRight(endIndex = -1) {
    if (endIndex === -1) {
      endIndex = this.#spans.length - 1;
    }

    for (let i = endIndex - 1; i >= 0; i--) {

      if (!this.indexBounded(i)) {
        continue;
      }

      const curSpan = this.#spans[i];
      // need to make sure the next index is bounded so we dont overwrite a unit indicator
      const prevSpan = this.#spans[Timer.getBoundedIndex(i + 1, this.#spans.length, i)];

      prevSpan.innerText = curSpan.innerText;
    }

    this.#spans[0].innerText = '0';
  }

  #boundsError(index, msg='') {
    if (!this.indexBounded(index)) {
      console.error(`Error with ${msg} in timer object: index is a unit indicator not digit (${index})`);
      return true;
    }
  }

  #inboundsError(index, msg='operation') {
    if (!this.indexInBounds(index)) {
      console.error(`Error with ${msg} in timer object: out of bounds (${index})`);
      return true;
    }

    return false;
  }

  /**
   * 
   * @returns current time in the spans in milliseconds
   */
  #parseCurrentTime() {

    const times = [
      Time.convertToMilliseconds(this.getUnitTime(Time.UNIT_HOUR), Time.UNIT_HOUR),
      Time.convertToMilliseconds(this.getUnitTime(Time.UNIT_MINUTE), Time.UNIT_MINUTE),
      Time.convertToMilliseconds(this.getUnitTime(Time.UNIT_SECOND), Time.UNIT_SECOND),
    ];

    let time = 0;

    times.forEach((t) => {
      time += t;
    });

    return time;
  }

  /**
   * Sets the current selected span index
   * @param {Number} newIndex the new index to be set to
   */
  set index(newIndex) {
    if (this.#inboundsError(newIndex, 'setting index')) {
      return;
    }

    if (newIndex === this.#selectedIndex || (!this.#isSelected && !this.forceSelection)) {
      return;
    }
  
    const prevIndex = this.#selectedIndex;

    this.#selectedIndex = newIndex;
    // doesn't matter if increment is >= or > because 0 will never be had
    this.boundIndex(prevIndex);

    this.setActiveSpan(this.#selectedIndex, prevIndex);
  }
  
  /**
   * Sets whether the timer itself is selected
   * @param {Boolean} value whether it is to be selected or not
   */
  set selected(value) {
    this.select(value);
  }
  
  /**
   * Set the callback for when thh container is clicked. Default is nothing, useful for selecting multiple timers.
   * @param {Function} callback The function to call when the container is clicked
   */
  set onclick(callback) {
    this.#container.onclick = callback;
  }

  /**
   * Set the callback for when the container is focused. Useful for implementing tab index. NOTE: If tab index is not set in constructor may not work as intended.
   * @param {Function} callback The function to call when the container is focused
   */
  set onfocus(callback) {
    this.#container.onfocus = callback;
  }

  /**
   * Sets the style attribute of the timer-container div to the provided string
   * @param {String} styleString The string containg css styles
   */
  set style(styleString) {
    this.#container.setAttribute('style', styleString);
  }

  /**
   * Sets the readonly attribute of the timer
   * @param {Boolean} value Whether the timer is readonly or not
   */
  set readonly(value) {
    this.#readonly = value;
  }

  /**
   * Gets whether the timer is readonly
   * @returns {Boolean} Whether the timer is readonly or not
   */
  get readonly() {
    return this.#readonly;
  }

  /**
   * Whether the timer is selected or not
   */
  get selected() {
    return this.#isSelected;
  }

  /**
   * The currently selected span index for input
   */
  get currentIndex() {
    return this.#selectedIndex;
  }
  
  /**
   * The current span selected for input
   */
  get currentTimerSpan() {
    return this.#spans[this.#selectedIndex];
  }

  /**
   * Whether the timer has been started or not
   */
  get started() {
    return this.#started;
  }

  /**
   * The current time stored in the time spans (Not the current countdown time)
   */
  get time() {
    return this.#parseCurrentTime();
  }

  get container() {
    return this.#container;
  }

  /**
   * Creates a span element used within the timer component
   * @param {Boolean} isValue whether the new span holds a numberical value or a unit indicator string
   * @param {String} timeUnit the unit which the value is counting
   * @returns 
   */
  static createTimerSpan(isValue, timeUnit) {
    const span = document.createElement('span');
  
    if (isValue) {
      span.classList.add('timer-digit');
      span.innerText = '0';
    } else {
      span.classList.add('timer-unit');
      span.innerText = timeUnit;
    }
  
    span.classList.add(`timer-${timeUnit}`);
  
    return span;
  }


  /**
   * Get the index of the next input span to be selected based on a change of selection
   * @param {Number} index The index to get the bounded version for
   * @param {Number} spansLength The length of the spans list
   * @param {Number} previousIndex The previous index to determine which way the selection is moving
   * @returns The new bounded index
   */
  static getBoundedIndex(index, spansLength, previousIndex) {
    if (index < 0) {
      return 0;
    } else if (index > spansLength - 2) {
      return spansLength - 2;
    } else if (index !== 0 && (index + 1) % 3 === 0) {
      if (index - previousIndex > 0) {
        return index + 1;
      } else {
        return index - 1;
      }
    }

    return index;
  }

  /**
   * Creates a span used for displaying the timer in input mode.
   * @returns {HTMLElement}
   */
  static createDisplaySpan() {
    const span = document.createElement('span');
    span.classList.add('timer-display');

    return span;
  }

  /**
   * Creates a span used for displaying a unit indicator
   * @param {String} unit Unit string representation
   * @returns {HTMLElement}
   */
  static createDisplayUnit(unit) {
    const span = document.createElement('span');
    span.classList.add('timer-display-unit');
    span.innerText = unit;

    return span;
  }

  /**
   * Create the buttons and container for the timer component
   * @param {Function} onClickStart Callback for when the start button is clicked
   * @param {Function} onClickStop Callback for when the stop button is clicked
   * @returns {HTMLElement[]} Button Container, Start Button, Reset Button
   */
  static createButtons(onClickStart, onClickStop) {
    const container = document.createElement('div');
    container.classList.add('timer-buttons-container');
    
    const startButton = document.createElement('button');
    startButton.classList.add('timer-start-button', 'timer-button');
    startButton.innerText = 'Start';
    startButton.addEventListener('click', onClickStart);
    startButton.setAttribute('tabindex', '-1');

    const resetButton = document.createElement('button');
    resetButton.classList.add('timer-reset-button', 'timer-button');
    resetButton.innerText = 'Reset';
    resetButton.addEventListener('click', onClickStop);
    resetButton.setAttribute('tabindex', '-1');

    container.appendChild(startButton);
    container.appendChild(resetButton);

    return [container, startButton, resetButton];
  }
}



/**
 * ============== Sample structure ================
 * <div class="timer-container timer-selected" tabindex="0">
  <span class="timer-display timer-hidden"></span>
  <span class="timer-digit timer-h">0</span>
  <span class="timer-digit timer-h">0</span>
  <span class="timer-unit timer-h">h</span>
  <span class="timer-digit timer-m">0</span>
  <span class="timer-digit timer-m">0</span>
  <span class="timer-unit timer-m">m</span>
  <span class="timer-digit timer-s">0</span>
  <span class="timer-digit timer-s timer-active">0</span>
  <span class="timer-unit timer-s">s</span>
  <div class="timer-buttons-container">
    <button class="timer-start-button timer-button" tabindex="-1">Start</button>
    <button class="timer-reset-button timer-button" tabindex="-1">Reset</button>
  </div>
	</div>
 */