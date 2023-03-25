const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('donBotto', {
    soundSelected: () => ipcRenderer.invoke('sound-selected')
});
