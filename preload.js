
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemStatus: () => ipcRenderer.invoke('get-status'),
  saveLocalFile: (data) => ipcRenderer.send('save-file', data)
});
