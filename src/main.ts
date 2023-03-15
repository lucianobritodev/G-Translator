import * as electron from "electron";
import * as path from "path";

const { app, BrowserWindow, Tray, Menu, shell } = electron;

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  const display = electron.screen.getPrimaryDisplay();
  const width = display.bounds.width;
  
  mainWindow = new BrowserWindow({
    x: width - 720,
    y: 0,
    height: 221,
    width: 920,
    frame: true,
    roundedCorners: false,
    resizable: false,
    autoHideMenuBar: true,
    zoomToPageWidth: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
      contextIsolation: false,
      nodeIntegration: true
    },
  });

  mainWindow.loadURL("https://translate.google.com.br");
}


function render(tray: electron.Tray) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => mainWindow.show()
    },
    {
      label: "Open in web browser",
      click: () => shell.openExternal("https://translate.google.com.br")
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => quit()
    }
  ]);

  tray.setIgnoreDoubleClickEvents(true)
  tray.setToolTip('G-Translator')
  tray.setTitle('G-Translator')
  tray.setContextMenu(contextMenu);

  tray.on('click', () => contextMenu.popup());
  tray.on('right-click', () => contextMenu.popup());

}


function quit() {
  mainWindow = null;
  app.exit(0);
}


if (app.dock) app.dock.hide();
if (!app.requestSingleInstanceLock()) quit();
app.disableHardwareAcceleration();


app.whenReady().then(() => {
  createWindow();

  const mainTray = new Tray(path.join(__dirname, "/assets/icons/g-translator.png"))
  render(mainTray);

  mainWindow.on('close', (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    mainWindow.hide();
  });

});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});