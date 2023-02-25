const Time = require("../scripts/logic/Time");

test("initializing", () => {
  for (let i = 0; i < 100000; i += 100) {
    const time = new Time(i);
    expect(time.milliseconds).toBe(i);
  }

  expect(() => new Time(-1)).toThrow(RangeError);
});

test("hour to milliseconds (no decimals)", () => {
  const basicConvert = (hours) => {
    return hours * 3600000;
  }

  for (let i = 0; i <= 100; i++) {
    expect(Time.convertToMilliseconds(i, Time.UNIT_HOUR)).toBe(basicConvert(i));
  }
});

test("minute to milliseconds (no decimals)", () => {
  const basicConvert = (hours) => {
    return hours * 60000;
  }

  for (let i = 0; i <= 100; i++) {
    expect(Time.convertToMilliseconds(i, Time.UNIT_MINUTE)).toBe(basicConvert(i));
  }
});

test("second to milliseconds (no decimals)", () => {
  const basicConvert = (seconds) => {
    return seconds * 1000;
  }

  for (let i = 0; i <= 100; i++) {
    expect(Time.convertToMilliseconds(i, Time.UNIT_SECOND)).toBe(basicConvert(i));
  }
});

test("milliseconds to hours (no decimals)", () => {
  const basicConvert = (milliseconds) => {
    return ((milliseconds / 1000) / 60) / 60;
  }

  for (let i = 0; i <= 100; i++) {
    expect(Time.convertFromMilliseconds(i, Time.UNIT_HOUR)).toBe(basicConvert(i));
  }
});

test("milliseconds to minutes (no decimals)", () => {
  const basicConvert = (milliseconds) => {
    return (milliseconds / 1000) / 60;
  }

  for (let i = 0; i <= 100; i++) {
    expect(Time.convertFromMilliseconds(i, Time.UNIT_MINUTE)).toBe(basicConvert(i));
  }
});

test("milliseconds to seconds (no decimals)", () => {
  const basicConvert = (milliseconds) => {
    return milliseconds / 1000;
  }

  for (let i = 0; i <= 1000; i++) {
    expect(Time.convertFromMilliseconds(i, Time.UNIT_SECOND)).toBe(basicConvert(i));
  }
});

test("get hours", () => {
  const valuePairs = [
    {
      value: 7200000,
      result: 2
    },
    {
      value: 40800000,
      result: 11
    },
    {
      value: 49382818,
      result: 13
    },
    {
      value: 3694839,
      result: 1
    },
    {
      value: 36948393,
      result: 10
    },
  ];

  const t = new Time(0);

  valuePairs.forEach((pair) => {
    t.milliseconds = pair.value;
    expect(t.hours).toBe(pair.result);
  });
});

test("get minutes", () => {
  const valuePairs = [
    {
      value: 36948393,
      result: 15
    },
    {
      value: 40800000,
      result: 20
    },
    {
      value: 49382818,
      result: 43
    },
    {
      value: 3694839,
      result: 1
    },
    {
      value: 36948393,
      result: 15
    },
  ];

  const t = new Time(0);

  valuePairs.forEach((pair) => {
    t.milliseconds = pair.value;
    expect(t.minutes).toBe(pair.result);
  });
});

test("get seconds", () => {
  const valuePairs = [
    {
      value: 36948393,
      result: 48
    },
    {
      value: 40800000,
      result: 0
    },
    {
      value: 49382818,
      result: 2
    },
    {
      value: 3694839,
      result: 34
    },
    {
      value: 36948393,
      result: 48
    },
  ];

  const t = new Time(0);

  valuePairs.forEach((pair) => {
    t.milliseconds = pair.value;
    expect(t.seconds).toBe(pair.result);
  });
});

test("large milliseconds", () => {
  const t = new Time(0);

  expect(() => t.milliseconds = 604800000).toThrow(RangeError);
  expect(() => t.milliseconds = 60480343000).toThrow(RangeError);
  expect(() => t.milliseconds = -1).toThrow(RangeError);
  expect(() => t.milliseconds = -3482).toThrow(RangeError);
  expect(() => t.milliseconds = -90489).toThrow(RangeError);
  expect(() => t.milliseconds = 492347).not.toThrow(RangeError);
  expect(() => t.milliseconds = 0).not.toThrow(RangeError);
  expect(() => t.milliseconds = (604800000 - 1)).not.toThrow(RangeError);
  
});

test("timeString", () => {
  const valuePairs = [
    {
      value: 36948393,
      result: "10h15m48s"
    },
    {
      value: 40800000,
      result: "11h20m0s"
    },
    {
      value: 49382818,
      result: "13h43m2s"
    },
    {
      value: 3694839,
      result: "1h1m34s"
    },
    {
      value: 36948393,
      result: "10h15m48s"
    },
  ];

  const t = new Time(0);

  valuePairs.forEach((pair) => {
    t.milliseconds = pair.value;
    expect(t.timeString).toBe(pair.result);
  });
});
