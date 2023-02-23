class Timer {
  static TIME_SECOND = 's';
  static TIME_MINUTE = 'm';
  static TIME_HOUR   = 'h';

  static STARTING_INDEX = 7;

  forceSelection = false;

  #spans;
  #selectedIndex;
  #isSelected;
  #container;

  /**
   * Creates a new timer object. This includes a container and the spans inside it
   * @param {HTMLElement} parent Element that will be parent to the timer component
   */
  constructor(parent) {
    
    this.#container = document.createElement("div");
    this.#container.classList.add("timer-container");

    this.#isSelected = false;
    this.#selectedIndex = Timer.STARTING_INDEX;
    this.#spans = [];
  
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
      return;
    } 

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

  #shiftLeft(endIndex = -1) {
    this.#spans.forEach((span, index) => {
      if (endIndex !== -1 && index > endIndex) {
        return;
      }

      if (Timer.keyIsDigit(span.innerText) && index !== 0) {
        const leftIndex = Timer.getBoundedIndex(
          index - 1, 
          this.#spans.length, 
          index
        );
        
        this.#spans[leftIndex].innerText = this.#spans[index].innerText;
      }
    });
  }

  #inboundsError(index, msg="operation") {
    if (!this.indexInBounds(index)) {
      console.error(`Error with ${msg} in timer object: out of bounds (${index})`);
      return true;
    }

    return false;
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