class Time {

  #milliseconds;

  constructor(milliseconds) {
    if (milliseconds < 0) {
      throw RangeError("Cannot make time object with negative milliseconds");
    }

    this.milliseconds = milliseconds;
  }
  /**
   * Properties
   */

  /**
   * The current number of hours
   */
  get hours() {
    return Math.floor(Time.convertFromMilliseconds(this.milliseconds, Time.UNIT_HOUR) % 24);
  }

  /**
   * The current number of minutes
   */
  get minutes() {
    return Math.floor(Time.convertFromMilliseconds(this.milliseconds, Time.UNIT_MINUTE) % 60);
  }

  /**
   * The current number of seconds
   */
  get seconds() {
    return Math.floor(Time.convertFromMilliseconds(this.milliseconds, Time.UNIT_SECOND) % 60);
  }

  /**
   * The current number of milliseconds
   */
  get milliseconds() {
    return this.#milliseconds;
  }

  /**
   * Current milliseconds
   * @param {Number} value Number to set the milliseconds to < 604800000
   */
  set milliseconds(value) {
    if (value >= 604800000) {
      throw RangeError(`${value} is too large a number for this datastructure to hanndle.`);
    }

    if (value < 0) {
      throw RangeError(`millisecond cannot be negative (${value})`);
    }

    this.#milliseconds = value;
  }

  /**
   * Returns a string in the format of h:m:s in shorthand lower case.
   * Ignores the highest units which are 0
   */
  get timeString() {

    let formatString = "";

    let doHours = false;
    let doMinutes = false;

    let hours = this.hours;
    let minutes = this.minutes;

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


    formatString += this.seconds + "s";

    return formatString;
  }

  /**
   * Static functions
   */

  static UNIT_HOUR    = { display: "h", operationIndex: 0 };
  static UNIT_MINUTE  = { display: "m", operationIndex: 1 };
  static UNIT_SECOND  = { display: "s", operationIndex: 2 };
  static OPERANDS     = [ 60, 60, 1000 ]; // hour <-> minute, minute <-> second, second <-> millisecond

  static CONVERT_DIRECTION = { biggerUnit: -1, smallerUnit: 1 }

  /**
   * Converts a time of one unit to another
   * @param {Number} value Number to convert
   * @param {Number} direction Direction to convert in, either bigger (-1), or smaller (1) see Time.CONVERT_DIRECTION
   * @param {Object} startingUnit Unit object corresponding to the given value, see Time.UNIT_HOUR
   * @param {Object} endUnit Unit object corresponding to the second last conversion to be done
   * @returns 
   */
  static convert(value, direction, startingUnit, endUnit) {
    if (typeof startingUnit !== 'object') {
      console.error("Error converting to milliseconds: ${unit} isnt a unit object!");
      return;
    }

    let curValue = value;

    let start = startingUnit.operationIndex;

    let lowerBound = -1;
    let upperBound = endUnit.operationIndex + 1;

    if (direction === -1) {
      lowerBound = endUnit.operationIndex - 1;
      upperBound = Time.OPERANDS.length;
    }

    for (let i = start; i > lowerBound && i < upperBound; i += direction) {
      const operation = Time.OPERANDS[i];
      
      if (direction < 0) {
        curValue /= operation;
      } else {
        curValue *= operation;
      }
    }

    return curValue;
  }

  /**
   * Converts a time of a specific unit to milliseconds
   * @param {Number} value Number to convert
   * @param {Object} unit Unit object corresponding to the value
   * @returns {Number} Value as milliseconds
   */
  static convertToMilliseconds(value, unit) {
    if (typeof unit !== 'object') {
      console.error("Error converting to milliseconds: ${unit} isnt a unit object!");
      return;
    }

    return Time.convert(value, Time.CONVERT_DIRECTION.smallerUnit, unit, Time.UNIT_SECOND);
  }

  /**
   * Converts milliseconds to a specified unit
   * @param {Number} value Number to convert in milliseconds
   * @param {Object} unit Unit object to convert to
   * @returns The number in the specified unit
   */
  static convertFromMilliseconds(value, unit) {
    if (typeof unit !== 'object') {
      console.error("Error converting from milliseconds: ${unit} isnt a unit object!");
      return;
    }

    return Time.convert(value, Time.CONVERT_DIRECTION.biggerUnit, Time.UNIT_SECOND, unit);
  }
}

if (
  typeof module !== 'undefined' &&
  typeof module.exports !== 'undefined'
) {
  module.exports = Time;
} else {
  window.Time = Time;
}