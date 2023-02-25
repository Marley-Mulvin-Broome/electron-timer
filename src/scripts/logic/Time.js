


class Time {

  #milliseconds;

  constructor(milliseconds) {
    this.#milliseconds = milliseconds;
  }

  get hours() {
    return BigInt(((this.#milliseconds / 1000) / 60) / 60);
  }

  get minutes() {
    let remainderMilliseconds = this.hours
  }

  get seconds() {

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

  static UNIT_HOUR    = { display: "h", operationIndex: 0 };
  static UNIT_MINUTE  = { display: "m", operationIndex: 1 };
  static UNIT_SECOND  = { display: "s", operationIndex: 2 };
  static OPERANDS     = [ 60, 60, 1000 ]; // hour <-> minute, minute <-> second, second <-> millisecond

  static CONVERT_DIRECTION = { biggerUnit: -1, smallerUnit: 1 }

  static convert(value, direction, startingUnit) {
    if (!Object.is(unit)) {
      console.error("Error converting to milliseconds: ${unit} isnt a unit object!");
      return;
    }

    let start = startingUnit.operationIndex;

    for (let i = start; i > -1 && i < this.OPERATIONS.length; i += direction) {
      const operation = Time.OPERANDS[i];
      
      if (direction < 0) {
        value /= operation;
      } else {
        value *= operation;
      }
    }

    return value;
  }

  static convertToMilliseconds(value, unit) {
    if (!Object.is(unit)) {
      console.error("Error converting to milliseconds: ${unit} isnt a unit object!");
      return;
    }

    return Time.convert(value, Time.CONVERT_DIRECTION.smallerUnit, unit);
  }
}

export { Time };