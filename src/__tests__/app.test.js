const electronPath = require('electron');
const { TestDriver } = require('../testDriver');

const app = new TestDriver({
	path: electronPath,
	args: ['./'],
	env: {
		NODE_ENV: 'test',
	},
});

beforeAll(async () => {
	await app.isReady;
});

afterAll(() => {
	app.stop();
});

test('Test!!', () => {
	expect(1 + 1).toBe(2);
});
