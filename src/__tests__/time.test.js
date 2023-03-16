//import { expect, test, beforeEach } from "@jest/globals";

const Time = require('../scripts/logic/Time');

const MAX_MILLISECONDS = 604800000;
const ONE_HOUR = 3600000;
const ONE_MINUTE = 60000;
const ONE_SECOND = 1000;

describe('Initialising time', () => {
	describe('Valid constructor parameters', () => {
		test('> 0 < Max', () => {
			for (let i = 1; i < 10000000; i *= 10) {
				const time = new Time(i);
				expect(time.milliseconds).toBe(i);
			}
		});
		test(`Max - 1 (${MAX_MILLISECONDS - 1})`, () => {
			const time = new Time(MAX_MILLISECONDS - 1);
			expect(time.milliseconds).toBe(MAX_MILLISECONDS - 1);
		});
	});

	describe('Invalid constructor paramters', () => {
		test('Negative time range', () => {
			expect(() => new Time(-1)).toThrow(RangeError);
		});

		test(`=== Max (${MAX_MILLISECONDS})`, () => {
			expect(() => new Time(MAX_MILLISECONDS)).toThrow(RangeError);
		});
	});
});

describe('Unit conversions', () => {
	const basicConvert = (hours) => {
		return hours * 3600000;
	};

	test('hour to milliseconds (no decimals)', () => {
		for (let i = 0; i <= 100; i++) {
			expect(Time.convertToMilliseconds(i, Time.UNIT_HOUR)).toBe(
				basicConvert(i)
			);
		}
	});

	test('minute to milliseconds (no decimals)', () => {
		const basicConvert = (hours) => {
			return hours * 60000;
		};

		for (let i = 0; i <= 100; i++) {
			expect(Time.convertToMilliseconds(i, Time.UNIT_MINUTE)).toBe(
				basicConvert(i)
			);
		}
	});

	test('second to milliseconds (no decimals)', () => {
		const basicConvert = (seconds) => {
			return seconds * 1000;
		};

		for (let i = 0; i <= 100; i++) {
			expect(Time.convertToMilliseconds(i, Time.UNIT_SECOND)).toBe(
				basicConvert(i)
			);
		}
	});

	test('milliseconds to hours (no decimals)', () => {
		const basicConvert = (milliseconds) => {
			return milliseconds / 1000 / 60 / 60;
		};

		for (let i = 0; i <= 100; i++) {
			expect(Time.convertFromMilliseconds(i, Time.UNIT_HOUR)).toBe(
				basicConvert(i)
			);
		}
	});

	test('milliseconds to minutes (no decimals)', () => {
		const basicConvert = (milliseconds) => {
			return milliseconds / 1000 / 60;
		};

		for (let i = 0; i <= 100; i++) {
			expect(Time.convertFromMilliseconds(i, Time.UNIT_MINUTE)).toBe(
				basicConvert(i)
			);
		}
	});

	test('milliseconds to seconds (no decimals)', () => {
		const basicConvert = (milliseconds) => {
			return milliseconds / 1000;
		};

		for (let i = 0; i <= 1000; i++) {
			expect(Time.convertFromMilliseconds(i, Time.UNIT_SECOND)).toBe(
				basicConvert(i)
			);
		}
	});
});

describe('Getting unit', () => {
	let t;

	beforeEach(() => {
		t = new Time(0);
	});

	describe('Hours', () => {
		const hourPairs = [
			{
				value: 7200000,
				result: 2,
			},
			{
				value: 40800000,
				result: 11,
			},
			{
				value: 49382818,
				result: 13,
			},
			{
				value: 3694839,
				result: 1,
			},
			{
				value: 36948393,
				result: 10,
			},
		];

		test.each(hourPairs)(
			'.hours (ms: $value) === (hours: $result)',
			({ value, result }) => {
				t.milliseconds = value;
				expect(t.hours).toBe(result);
			}
		);
	});
	describe('Minutes', () => {
		const minutePairs = [
			{
				value: 36948393,
				result: 15,
			},
			{
				value: 40800000,
				result: 20,
			},
			{
				value: 49382818,
				result: 43,
			},
			{
				value: 3694839,
				result: 1,
			},
			{
				value: 36948393,
				result: 15,
			},
		];

		test.each(minutePairs)(
			'.minutes (ms: $value) === (minutes: $result)',
			({ value, result }) => {
				t.milliseconds = value;
				expect(t.minutes).toBe(result);
			}
		);
	});
	describe('Seconds', () => {
		const secondPairs = [
			{
				value: 36948393,
				result: 48,
			},
			{
				value: 40800000,
				result: 0,
			},
			{
				value: 49382818,
				result: 2,
			},
			{
				value: 3694839,
				result: 34,
			},
			{
				value: 36948393,
				result: 48,
			},
		];

		test.each(secondPairs)(
			'.seconds (ms: $value) === (seconds: $result)',
			({ value, result }) => {
				t.milliseconds = value;
				expect(t.seconds).toBe(result);
			}
		);
	});
});

describe('Setting milliseconds', () => {
	let t;

	beforeEach(() => {
		t = new Time(0);
	});

	describe('Valid cases', () => {
		test('=== 0', () => {
			expect(() => (t.milliseconds = 0)).not.toThrow(RangeError);
		});
		test(`Max - 1 (${MAX_MILLISECONDS - 1})`, () => {
			expect(() => (t.milliseconds = MAX_MILLISECONDS - 1)).not.toThrow(
				RangeError
			);
		});
		test('> 0 < MAX_MILLISECONDS', () => {
			expect(() => (t.milliseconds = 492347)).not.toThrow(RangeError);
		});
	});

	describe('Invalid cases', () => {
		test(`> Max (${MAX_MILLISECONDS})`, () => {
			expect(() => (t.milliseconds = MAX_MILLISECONDS + 100)).toThrow(
				RangeError
			);
		});
		test(`=== Max (${MAX_MILLISECONDS})`, () => {
			expect(() => (t.milliseconds = MAX_MILLISECONDS)).toThrow(RangeError);
		});
		test('< 0', () => {
			expect(() => (t.milliseconds = -1)).toThrow(RangeError);
		});
	});
});

describe('Time string', () => {
	const timeStringPairs = [
		{
			value: ONE_HOUR,
			result: '1h0m0s',
		},
		{
			value: ONE_MINUTE,
			result: '1m0s',
		},
		{
			value: ONE_SECOND,
			result: '1s',
		},
		{
			value: 0,
			result: '0s',
		},
		{
			value: 36948393,
			result: '10h15m48s',
		},
		{
			value: 40800000,
			result: '11h20m0s',
		},
		{
			value: 49382818,
			result: '13h43m2s',
		},
		{
			value: 3694839,
			result: '1h1m34s',
		},
		{
			value: 36948393,
			result: '10h15m48s',
		}, // TODO: Add more test cases
	];

	test.each(timeStringPairs)(
		'.timeString (ms: $value) === (timeString: $result)',
		({ value, result }) => {
			const t = new Time(0);

			t.milliseconds = value;
			expect(t.timeString).toBe(result);
		}
	);
});

describe('Countdown', () => {
	test('countdown milliseconds', () => {
		const maxMs = 1000;

		const t = new Time(maxMs);

		let countdown = maxMs;

		for (let i = 0; i < maxMs; i++) {
			t.milliseconds--;
			countdown--;

			expect(t.milliseconds).toBe(countdown);
		}
	});

	test('countdown string drop unit', () => {
		const t = new Time(ONE_MINUTE);

		expect(t.timeString).toBe('1m0s');

		t.milliseconds--;

		expect(t.timeString).toBe('59s');

		t.milliseconds = 3600000;

		expect(t.timeString).toBe('1h0m0s');

		t.milliseconds--;

		expect(t.timeString).toBe('59m59s');
	});
});
