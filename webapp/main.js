const path = require('path');
const { app, BrowserWindow, globalShortcut, contextBridge, ipcMain } = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/src/electron/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  win.setSkipTaskbar (true);
  win.loadURL('http://don-botto-webapp.s3-website.eu-central-1.amazonaws.com/');
  // win.loadURL('http://localhost:3001/')
}

console.log('contextBridge', contextBridge);

ipcMain.handle('sound-selected', async () => {
  win.close()
})

const OPEN_SHORTCUT = 'CommandOrControl+alt+B';

app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register(OPEN_SHORTCUT, () => {
    createWindow();
  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  globalShortcut.isRegistered(OPEN_SHORTCUT);
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister(OPEN_SHORTCUT)

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (app.dock) {
    app.dock.hide() // for macOS
  }
  // use same logic for other OSes you want
})
