const { contextBridge, ipcRenderer } = require('electron');

const appApi = {
  loadAudioFile: (filePath) => ipcRenderer.invoke('load-audio-file', filePath),
  audioFilePrompt: () => ipcRenderer.invoke('audio-file-prompt'),
  getExistingAudioFiles: () => ipcRenderer.invoke('get-existing-audio-files'),
};

contextBridge.exposeInMainWorld('electronApi', appApi);