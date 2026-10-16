
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

// Задание 3: чтение рабочего каталога
ipcMain.handle('list-dir', async (event, dir) => {
  if (typeof dir !== 'string') {
    throw new Error('Некорректный путь');
  }

  const entries = await fs.readdir(dir, {
    withFileTypes: true
  });

  return entries.map(e => ({
    name: e.name,
    isDir: e.isDirectory()
  }));
});

// Задание 4: выбор каталога через системный диалог
ipcMain.handle('choose-directory', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  if (!win) {
    throw new Error('Окно приложения не найдено');
  }

  const result = await dialog.showOpenDialog(win, {
    title: 'Выберите каталог',
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const selectedPath = result.filePaths[0];

  const entries = await fs.readdir(selectedPath, {
    withFileTypes: true
  });

  return {
    canceled: false,
    path: selectedPath,
    entries: entries.map(e => ({
      name: e.name,
      isDir: e.isDirectory()
    }))
  };
});

// Жизненный цикл приложения
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
