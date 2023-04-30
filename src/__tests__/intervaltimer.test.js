import { expect, describe, test, beforeEach } from '@jest/globals';

import { IntervalTimer } from '../scripts/logic/Interval.js';

describe('Initialising IntervalTimer', () => {
  describe('Valid constructor parameters', () => {
    test('No parameters', () => {
      const timer = new IntervalTimer();
      expect(timer.time.milliseconds).toBe(0);
      expect(timer.intervals).toStrictEqual([0]);
    });
  });

  describe('Invalid constructor parameters', () => {
    test('Negative time range', () => {
      expect(() => new IntervalTimer(-1)).toThrow(RangeError);
    });
  });
});

describe('Adding intervals', () => {
  test('Adding 1 interval', () => {
    const timer = new IntervalTimer();
    timer.addInterval(1);
    expect(timer.intervals).toStrictEqual([0, 1]);
  });

  test('Adding 2 intervals', () => {
    const timer = new IntervalTimer();
    timer.addInterval(1);
    timer.addInterval(2);
    expect(timer.intervals).toStrictEqual([0, 1, 2]);
  });

  test('Adding 3 intervals', () => {
    const timer = new IntervalTimer();
    timer.addInterval(1);
    timer.addInterval(2);
    timer.addInterval(3);
    expect(timer.intervals).toStrictEqual([0, 1, 2, 3]);
  });
});

describe('Removing intervals', () => {
  test('Removing 1 interval', () => {
    const timer = new IntervalTimer();
    timer.addInterval(1);
    timer.removeInterval(0);
    expect(timer.intervals).toStrictEqual([1]);
  });
});

describe('Running intervals', () => {
  let didFinish = false;

  const finishHandler = () => {
    didFinish = true;
  };

  beforeEach(() => {
    didFinish = false;
  });

  test('Running 1 interval', () => {
    const timer = new IntervalTimer(1000, finishHandler);
    timer.doTick(1000);
    expect(didFinish).toBeTruthy();
  });

  test('Running 2 intervals', () => {
    const timer = new IntervalTimer(1000, finishHandler);
    timer.addInterval(2000);
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(2000);
    expect(didFinish).toBeTruthy();
  });

  test('Running 3 intervals', () => {
    const timer = new IntervalTimer(1000, finishHandler);
    timer.addInterval(2000);
    timer.addInterval(3000);
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(2000);
    expect(didFinish).toBeFalsy();
    timer.doTick(3000);
    expect(didFinish).toBeTruthy();
  });

  test('Running 1 interval loop', () => {
    const timer = new IntervalTimer(1000, finishHandler, true, 1);
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(1000);
    expect(didFinish).toBeTruthy();
  });

  test('Running 1 interval multiple loops', () => {
    const timer = new IntervalTimer(1000, finishHandler, true, 2);
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(1000);
    expect(didFinish).toBeTruthy();
  });

  test('Running 2 intervals loop', () => {
    const timer = new IntervalTimer(1000, finishHandler, true, 1);
    timer.addInterval(2000);
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(2000);
    expect(didFinish).toBeFalsy();
    timer.doTick(1000);
    expect(didFinish).toBeFalsy();
    timer.doTick(2000);
    expect(didFinish).toBeTruthy();
  });
});
