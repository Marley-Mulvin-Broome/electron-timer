import { ONE_SECOND, Time } from './Time.js';


export class IntervalTimer {
  #time;

  #currentInterval = 0;

  #currentLoop;
  loop;
  maxLoop;

  intervals;

  onFinish;
  onNext;
  
  constructor(startingInterval = 0, onFinish = undefined, loop = false, maxLoop = 1) {
    this.#time = new Time(startingInterval);
    this.intervals = [startingInterval];
    this.onFinish = onFinish;
    this.loop = loop;
    this.maxLoop = maxLoop;
    this.#currentLoop = 0;
    this.#currentInterval = 0;
  }

  get time() {
    return this.#time;
  }

  get currentTime() {
    return this.#time.milliseconds;
  }

  get currentStartTime() {
    return this.intervals[this.#currentInterval];
  }

  get currentIntervalValue() {
    return this.intervals[this.#currentInterval];
  }

  set currentIntervalValue(value) {
    this.intervals[this.#currentInterval] = value;

    this.#reset();
  }


  doTick(tickCount = ONE_SECOND) {
    if (this.#time.milliseconds - tickCount <= 0) {
      tickCount = this.#time.milliseconds;
    }

    this.time.milliseconds -= tickCount;

    if (this.time.milliseconds <= 0) {
      this.next();
    }
  }

  next() {
    this.#currentInterval++;

    if (this.#currentInterval >= this.intervals.length) {
      if (this.loop) {
        if (this.#doLoop()) {
          return;
        }
      }

      this.#reset();

      if (this.onFinish) {
        this.onFinish();
      }

      return;
    }

    this.time.milliseconds = this.intervals[this.#currentInterval];

    // Call onNext here so doesn't get called if finished
    if (this.onNext) {
      this.onNext();
    }
  }

  /**
   * Adds an interval to the list of intervals
   * @param {Number} interval Interval to add
   */
  addInterval(interval) {
    this.intervals.push(interval);
  }

  /**
   * Removes an interval from the list of intervals
   * @param {Number} interval Index of interval to remove
   * @throws {RangeError} If the interval is not in the list of intervals
   */
  removeInterval(interval) {
    if (interval < 0 || interval >= this.intervals.length) {
      throw RangeError(`Interval ${interval} does not exist`);
    }

    this.intervals.splice(interval, 1);
  }

  #reset(currentLoop = 0) {
    this.#currentInterval = 0;
    this.time.milliseconds = this.intervals[0];
    this.#currentLoop = currentLoop;
  }

  #doLoop() {
    this.#currentLoop++;

    if (this.#currentLoop <= this.maxLoop) {
      this.#reset(this.#currentLoop);
      return true;
    }

    return false;
  }
}