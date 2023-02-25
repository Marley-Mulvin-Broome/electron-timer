import { isElement, stylesheetIncluded } from "../logic/utility.js";

if (window.Time === undefined) {
  throw Error("Missing module Time in global object");
}

if (!stylesheetIncluded("timer.css")) {
  console.warn("Style sheet not loaded!!");
}


const ONE_SECOND = 1000;

class Timer {
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

  #buttonContainer;
  #buttonStart;
  #buttonStop;

  #audioElement;

  /**
   * Creates a new timer object. This includes a container and the spans inside it
   * @param {HTMLElement} parent Element that will be parent to the timer component
   */
  constructor(parent, tabindex=-1) {
    
    this.#container = document.createElement("div");
    this.#container.classList.add("timer-container");

    this.#isSelected = false;
    this.#selectedIndex = Timer.STARTING_INDEX;
    this.#displaySpan = document.createElement("span");
    this.#displaySpan.classList.add("timer-display");
    this.#hideDisplay();
    this.#container.appendChild(this.#displaySpan);
    this.#spans = [];
    this.#audioElement = new Audio("timeraudio.mp3");
    this.#audioElement.loop = false;
    this.#container.setAttribute("tabindex", tabindex);
    
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

    parent.appendChild(this.#container);

    [this.#buttonContainer, this.#buttonStart, this.#buttonStop] = Timer.createButtons(
      () => {
        if (!this.selected) {
          return;
        }

        if (!this.started) {
          this.start();
          return;
        }

        this.pause();
      },
      () => {
        if (!this.selected) {
          return;
        }

        if (this.started) {
          this.reset();
          return;
        }

        this.clearInput();
      }
    );
    this.#container.appendChild(this.#buttonContainer);

    this.activateSpan(this.#selectedIndex);

    this.#hideSelected();
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

  clickStart() {
    this.start();
  }

  clearInput() {
    this.#spans.forEach((span, index) => {
      if (this.indexBounded(index)) {
        span.innerText = "0";
      }
    });
  }

  /**
   * Starts the timer
   */
  start() {
    if (this.started) {
      console.error("Error when starting timer: cannot start a timer that is already started!");
      return;
    }

    this.#buttonStop.innerText = "Stop";
    this.#buttonStart.innerText = "Pause";

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

      if (this.#runningTime.seconds === 0) {
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
      this.#buttonStart.innerText = "Unpause";
    } else {
      this.#buttonStart.innerText = "Pause";
    }
  }

  reset() {
    if (!this.started) {
      console.error("Error when resetting timer: can't reset started timer");
      return;
    }

    this.stop();
  }

  /**
   * Stops the timer completely
   * @param {Boolean} suppressSound whether to suppress the end timer audio
   */
  stop(suppressSound = true) {
    if (!this.started) {
      console.error("Error when stopping timer: cannot stop timer that has not been started");
      return;
    }

    this.#buttonStart.innerText = "Start";
    this.#buttonStop.innerText = "Reset";

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
      this.#container.classList.remove("timer-selected");
      this.#hideSelected();
      return;
    } 

    this.#showSelected();
    this.#container.classList.add("timer-selected");
  }

  /**
   * Selects the timer index to the right of the currently selected one
   */
  selectNext() {
    if (this.#selectedIndex === this.#spans.length) {
      return;
    }

    this.index = this.#selectedIndex + 1;
  }

  /**
   * Selects the timer index to the left of the currently selected one
   */
  selectPrevious() {
    if (this.#selectedIndex === 0) {
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
    if (this.#inboundsError(index, "activating span")) {
      return;
    }

    this.#spans[index].classList.add("timer-active");
  }

  /**
   * Deactivates a span based on index
   * @param {Number} index the index to deactivate
   */
  deactivateSpan(index) {
    if (this.#inboundsError(index, "deactivating span")) {
      return;
    }

    this.#spans[index].classList.remove("timer-active");
  }

  setActiveSpan(index, prevIndex) {
    this.deactivateSpan(prevIndex);
    this.activateSpan(index);
  }

  hideSpan(index) {
    if (isElement(index)) {
      index.classList.add("timer-hidden");
      return;
    }

    if (this.#inboundsError(index, "hiding span")) {
      return;
    }

    this.#spans[index].classList.add("timer-hidden");
  }

  showSpan(index) {
    if (isElement(index)) {
      index.classList.remove("timer-hidden");
      return;
    }

    if (this.#inboundsError(index, "showing span")) {
      return;
    }

    this.#spans[index].classList.remove("timer-hidden");
  }

  hideSpans(spans = null) {
    if (spans === null) {
      spans = this.#spans;
    }

    if (!Array.isArray(spans)) {
      console.error(`Error when hiding spans: passed parameter is not an array (${spans})`)
      return;
    }

    if (spans.length === 0) {
      console.warn("Called hide spans function with 0 spans");
      return;
    } 

    spans.forEach((span) => {
      this.hideSpan(span);
    });
  }

  showSpans(spans = null) {
    if (spans === null) {
      spans = this.#spans;
    }

    if (!Array.isArray(spans)) {
      console.error(`Error when hiding spans: passed parameter is not an array (${spans})`)
      return;
    }

    if (spans.length === 0) {
      console.warn("Called hide spans function with 0 spans");
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
    if (key === "ArrowRight") {
      this.selectNext();
    } else if (key === "ArrowLeft") {
      this.selectPrevious();
    } else if (key === "Backspace") { 
      this.backspace();
    } else if (key === "Enter" ) {
      if (!this.started) {
        this.start();
      }
    } else if (Timer.keyIsDigit(key)) {
      this.insertDigit(parseInt(key));
    }
  }

  insertDigit(digit) {
    this.#shiftLeft(this.#selectedIndex);
    this.#spans[this.#selectedIndex].innerText = digit;
  }

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

  backspace() {
    this.#shiftRight(this.#selectedIndex);
  }

  formatDisplayElement(time) {
    let baseString = time.timeString;
  
    let currentElement = document.createElement("span");

    this.#displaySpan.innerHTML = "";

    for (let i = 0; i < baseString.length; i++) {
      if (["h", "m", "s"].includes(baseString[i])) {
        this.#displaySpan.appendChild(currentElement);
        this.#displaySpan.appendChild(Timer.createDisplayUnit(baseString[i]));
        if (i + 1 != baseString.length) {
          currentElement = document.createElement("span");
        }
      } else {
        currentElement.innerHTML += baseString[i];
      }
    }
  }

  #hideSelected() {
    this.#spans[this.#selectedIndex].classList.remove("timer-active");
  }

  #showSelected() {
    this.#spans[this.#selectedIndex].classList.add("timer-active");
  }

  #countdown() {
    this.#runningTime.milliseconds -= 1;
  }

  #toggleDisplay() {
    if (this.#displaySpan.classList.contains("timer-hidden")) {
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
    this.#displaySpan.classList.remove("timer-hidden")
  }

  #hideDisplay() {
    this.#displaySpan.classList.add("timer-hidden")

  }

  #isSpanUnitIndicator(span) {
    if (Object.is(span)) {
      return !this.keyIsDigit(span.innerText);
    }

    return !this.keyIsDigit(this.#spans[span].innerText);
  }

  #parsedIndex(index) {
    if (this.#inboundsError(index, "parsing index") || this.#boundsError("parsing index")) {
      return;
    }

    return parseInt(this.#spans[index].innerText);
  }

  #parseUnitAt(index) {
    if (this.#inboundsError(index, "parsing unit time") || this.#boundsError("parsing unit time")) {
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

      if (Timer.keyIsDigit(span.innerText) && index !== 0) {
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

    this.#spans[0].innerText = "0";
  }

  #boundsError(index, msg="") {
    if (!this.indexBounded(index)) {
      console.error(`Error with ${msg} in timer object: index is a unit indicator not digit (${index})`)
      return true;
    }
  }

  #inboundsError(index, msg="operation") {
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
    if (this.#inboundsError(newIndex, "setting index")) {
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
  
  set onclick(callback) {
    this.#container.onclick = callback;
  }

  set onfocus(callback) {
    this.#container.onfocus = callback;
  }

  get selected() {
    return this.#isSelected;
  }

  get currentIndex() {
    return this.#selectedIndex;
  }
  
  get currentTimerSpan() {
    return this.#spans[selectedIndex];
  }

  get started() {
    return this.#started;
  }

  /**
   * The current time stored in the time spans (Not the current countdown time)
   */
  get time() {
    return this.#parseCurrentTime();
  }

  /**
   * Creates a span element used within the timer component
   * @param {Boolean} isValue whether the new span holds a numberical value or a unit indicator string
   * @param {String} timeUnit the unit which the value is counting
   * @returns 
   */
  static createTimerSpan(isValue, timeUnit) {
    const span = document.createElement("span");
  
    if (isValue) {
      span.classList.add("timer-digit");
      span.innerText = '0';
    } else {
      span.classList.add("timer-unit");
      span.innerText = timeUnit;
    }
  
    span.classList.add(`timer-${timeUnit}`);
  
    return span;
  }


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

  static keyIsDigit(key) {
    return !isNaN(key);
  }

  static formatTime(dateTime) {
    let hours = dateTime.getUTCHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    let formatString = "";

    let doHours = false;
    let doMinutes = false;

    if (hours !== 0) {
      doHours = true;
      doMinutes = true;
    } else if (minutes !== 0) {
      doMinutes = true;
    }

    if (doHours) {  
      formatString += hours + "h";

    }

    if (doMinutes) {
      formatString += minutes + "m";
    }


    formatString += seconds + "s";

    return formatString;
  }

  static createDisplaySpan() {
    const span = document.createElement("span");
    span.classList.add("timer-display");

    return span;
  }

  static createDisplayUnit(unit) {
    const span = document.createElement("span");
    span.classList.add("timer-display-unit");
    span.innerText = unit;

    return span;
  }

  static createButtons(onClickStart, onClickStop) {
    const container = document.createElement("div");
    container.classList.add("timer-buttons-container");
    
    const startButton = document.createElement("button");
    startButton.classList.add("timer-start-button", "timer-button");
    startButton.innerText = "Start";
    startButton.addEventListener("click", onClickStart);
    startButton.setAttribute("tabindex", "-1");

    const resetButton = document.createElement("button");
    resetButton.classList.add("timer-reset-button", "timer-button");
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", onClickStop);
    resetButton.setAttribute("tabindex", "-1");

    container.appendChild(startButton);
    container.appendChild(resetButton)

    return [container, startButton, resetButton];
  }
}



export { Timer };

/*
window.addEventListener("keydown", (event) => {
  if (!this.#isSelected) {
    return;
  }

  if (event.key === "ArrowRight") {
    this.selectNext();
  } else if (event.key === "ArrowLeft") {
    this.selectPrevious();
  }
});*/