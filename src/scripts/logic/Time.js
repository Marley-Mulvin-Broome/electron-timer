class Time {

  milliseconds;

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

  get minutes() {
    return Math.floor(Time.convertFromMilliseconds(this.milliseconds, Time.UNIT_MINUTE) % 60);
  }

  get seconds() {
    return Math.floor(Time.convertFromMilliseconds(this.milliseconds, Time.UNIT_SECOND) % 60);
  }

  get timeString() {
    let hours = this.hours;
    let minutes = this.minutes;
    let seconds = this.seconds;

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

  /**
   * Static functions
   */

  static UNIT_HOUR    = { display: "h", operationIndex: 0 };
  static UNIT_MINUTE  = { display: "m", operationIndex: 1 };
  static UNIT_SECOND  = { display: "s", operationIndex: 2 };
  static OPERANDS     = [ 60, 60, 1000 ]; // hour <-> minute, minute <-> second, second <-> millisecond

  static CONVERT_DIRECTION = { biggerUnit: -1, smallerUnit: 1 }

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

  static convertToMilliseconds(value, unit) {
    if (typeof unit !== 'object') {
      console.error("Error converting to milliseconds: ${unit} isnt a unit object!");
      return;
    }

    return Time.convert(value, Time.CONVERT_DIRECTION.smallerUnit, unit, Time.UNIT_SECOND);
  }

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