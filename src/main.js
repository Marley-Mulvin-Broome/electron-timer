const { app, BrowserWindow } = require('electron');

const debug = true;

if (require('electron-squirrel-startup')) app.quit();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 680,
  });

  if (!debug)
    win.removeMenu();

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const METHODS = {
  isReady() {
    // do any setup needed
    return true;
  },
  // define your RPC-able methods here
};

const onMessage = async ({ msgId, cmd, args }) => {
  let method = METHODS[cmd];
  if (!method) method = () => new Error('Invalid method: ' + cmd);
  try {
    const resolve = await method(...args);
    process.send({ msgId, resolve });
  } catch (err) {
    const reject = {
      message: err.message,
      stack: err.stack,
      name: err.name,
    };
    process.send({ msgId, reject });
  }
};

if (process.env.APP_TEST_DRIVER) {
  process.on('message', onMessage);
}
