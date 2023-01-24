/**
 * @desc electron 主入口
 */
import path from 'path';
import customMenu from './customMenu';
import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';

export interface MyBrowserWindow extends BrowserWindow {
  uid?: string;
}
function isDev() {
  // 配置中通过 webpack.DefinePlugin 定义的构建变量
  return process.env.NODE_ENV === 'development';
}

function createWindow() {
  // 创建主应用窗口
  const mainWindow: MyBrowserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });
  mainWindow.uid = 'mainWindow';

  // 创建应用设置窗口
  const settingWindow: MyBrowserWindow = new BrowserWindow({
    width: 720,
    height: 240,
    resizable: false,
    show: false,
    frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });

  settingWindow.uid = 'settingWindow';

  if (isDev()) {
    mainWindow.loadURL(`http://127.0.0.1:7001/index.html`);
    settingWindow.loadURL(`http://127.0.0.1:7001/setting.html`);
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    settingWindow.loadURL(`file://${path.join(__dirname, '../dist/setting.html')}`);
  }

  ipcMain.on('Electron:SettingWindow-hide-event', () => {
    if (settingWindow.isVisible()) {
      settingWindow.hide();
    }
  });
  ipcMain.on('Electron:SettingWindow-min-event', () => {
    if (settingWindow.isVisible()) {
      settingWindow.minimize();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(customMenu);
  Menu.setApplicationMenu(menu);
});

const ROOT_PATH = path.join(app.getAppPath(), '../');

ipcMain.on('get-root-path', (event, arg) => {
  event.reply('reply-root-path', ROOT_PATH);
});

// 应用设置，保存自定义存储路径
ipcMain.on('open-save-resume-path', (event, arg) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((result) => {
      event.reply('reply-save-resume-path', result.filePaths);
    })
    .catch((err) => {
      event.reply('reply-save-resume-path', err);
    });
});
