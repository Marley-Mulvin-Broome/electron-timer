class Timer {
  static TIME_SECOND = 's';
  static TIME_MINUTE = 'm';
  static TIME_HOUR   = 'h';
  static ONE_SECOND = 1000;

  static STARTING_INDEX = 7;

  forceSelection = false;

  #spans;
  #selectedIndex;
  #isSelected;
  #container;
  #started = false;
  #intialTime = null;
  #paused = false;
  #intervalObject = null;
  #displaySpan;
  #curTime = null;

  #audioElement;

  /**
   * Creates a new timer object. This includes a container and the spans inside it
   * @param {HTMLElement} parent Element that will be parent to the timer component
   */
  constructor(parent) {
    
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
    this.#audioElement.loop = true;
  
    for (let i = 0; i < 9; i++) {
      const isValue = (i + 1) % 3 !== 0;
  
      let timeUnit = Timer.TIME_SECOND;
  
      if (i < 3) {
        timeUnit = Timer.TIME_HOUR;
      } else if (i < 6) {
        timeUnit = Timer.TIME_MINUTE;
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

    this.activateSpan(this.#selectedIndex);

    this.#hideSelected();
  }

  toggle() {
    if (this.started) {
      this.stop();
      return;
    }

    this.start();
  }

  start() {
    if (this.started) {
      console.error("Error when starting timer: cannot start a timer that is already started!");
      return;
    }

    // set the initialTime to whatever is in the input
    this.#intialTime = this.time;
    this.#curTime = this.time;
    // change to the display
    this.hideSpans();
    this.#updateDisplay();
    this.#showDisplay();
    // start a countdown for every one second
    this.#intervalObject = setInterval(() => {
      if (this.#paused) {
        return;
      }

      if (Timer.timeIsZero(this.#curTime)) {
        this.stop(false);
        return;
      }

      this.#countdown();
      this.#updateDisplay();
    }, Timer.ONE_SECOND);

    this.#started = true;
  }

  pause() {
    this.#paused = !this.#paused;
  }

  stop(suppressSound = true) {
    if (!this.started) {
      console.error("Error when stopping timer: cannot stop timer that has not been started");
      return;
    }

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

  indexBounded(index) {
    return (index + 1) % 3 !== 0;
  }

  activateSpan(index) {
    if (this.#inboundsError(index, "activating span")) {
      return;
    }

    this.#spans[index].classList.add("timer-active");
  }

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
      case Timer.TIME_MINUTE:
        firstIndex = 3;
        break;
      case Timer.TIME_SECOND:
        firstIndex = 6;
        break;
    }

    return this.#parseUnitAt(firstIndex);
  }

  #hideSelected() {
    this.#spans[this.#selectedIndex].classList.remove("timer-active");
  }

  #showSelected() {
    this.#spans[this.#selectedIndex].classList.add("timer-active");
  }

  #countdown() {
    this.#curTime.setSeconds(this.#curTime.getSeconds() - 1);
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
      time = this.#curTime;
    }

    this.#displaySpan.innerText = Timer.formatTime(time);
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

  #parseCurrentTime() {

    const times = [
      Timer.timeToMilliseconds(this.getUnitTime(Timer.TIME_HOUR), Timer.TIME_HOUR),
      Timer.timeToMilliseconds(this.getUnitTime(Timer.TIME_MINUTE), Timer.TIME_MINUTE),
      Timer.timeToMilliseconds(this.getUnitTime(Timer.TIME_SECOND), Timer.TIME_SECOND)
    ];

    let time = 0;

    times.forEach((t) => {
      time += t;
    });

    console.log("", time);
    console.log("MAX", Number.MAX_SAFE_INTEGER);
    
    let curTime = new Date(time);

    console.log(curTime);


    return curTime;
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

  get currentIndex() {
    return this.#selectedIndex;
  }
  
  get currentTimerSpan() {
    return this.#spans[selectedIndex];
  }

  get started() {
    return this.#started;
  }

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

  static timeIsZero(dateTime) {
    return dateTime.getHours() === 0 && dateTime.getMinutes() === 0 && dateTime.getSeconds() === 0;
  }

  static timeToMilliseconds(time, unit) {
    switch (unit) {
      case Timer.TIME_HOUR:
        return ((time * 60) * 60) * 1000;

      case Timer.TIME_MINUTE:
        return (time * 60) * 1000;

      case Timer.TIME_SECOND:
        return time * 1000;
    }
  }
}



//export { Timer };

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