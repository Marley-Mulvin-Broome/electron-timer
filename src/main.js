/* global __dirname */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const debug = true;

if (require('electron-squirrel-startup')) app.quit();

const AUDIO_FOLDER = path.join(app.getPath('appData'), 'electron-timer/audio');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
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

ipcMain.handle('load-audio-file', (event, fileArg) => {
  if (!fs.existsSync(fileArg)) {
    return null;
  }

  // move file to audio folder in app data
  if (!fs.existsSync(AUDIO_FOLDER)) fs.mkdirSync(AUDIO_FOLDER);

  const fileName = fileArg.split('\\').pop();
  const newFilePath = AUDIO_FOLDER + '/' + fileName;
  console.log('Copying new audio file to: ' + newFilePath);
  fs.copyFileSync(fileArg, newFilePath);

  return newFilePath;
});

ipcMain.handle('audio-file-prompt', () => {
  const filePrompt = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }
    ]
  });

  if (filePrompt) {
    return filePrompt[0];
  } else {
    return null;
  }
});

ipcMain.handle('get-existing-audio-files', () => {
  if (!fs.existsSync(AUDIO_FOLDER)) return [];

  const files = fs.readdirSync(AUDIO_FOLDER);
  return files;
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
