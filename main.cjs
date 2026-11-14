const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0d0f14',
    title: 'ROOT://ACCESS - Server Overlord (The Admin)',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  Menu.setApplicationMenu(null)

  // Load the built Vite index.html
  win.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
