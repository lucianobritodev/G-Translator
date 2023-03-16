import * as electron from "electron";
import * as path from "path";

const { app, BrowserWindow, Tray, Menu, shell } = electron;
const height: number = 221;
const width: number = 920;

let showing: boolean = false;

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  const initDisplay = electron.screen.getPrimaryDisplay();
  const initWidth = initDisplay.bounds.width;
  
  mainWindow = new BrowserWindow({
    x: initWidth - 920,
    y: 0,
    height,
    width,
    frame: true,
    roundedCorners: false,
    resizable: false,
    autoHideMenuBar: true,
    zoomToPageWidth: false,
    show: false,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
      devTools: false
    },
  });

  mainWindow.loadURL("https://translate.google.com.br");
}


function render(tray: electron.Tray) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => showOrHide()
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
  tray.setContextMenu(contextMenu);

  tray.on('click', () => showOrHide());
  tray.on('right-click', () => contextMenu.popup());

}

function showOrHide() {
  showing = !showing;
  if(!showing)
    return mainWindow.hide();
  
  return mainWindow.show();
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
    showOrHide();
  });

});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});