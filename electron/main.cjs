const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } = require("electron");
const path = require("path");

let mainWindow = null;
let tray = null;

const isDev = !app.isPackaged;
const DEV_URL = "http://localhost:5173";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "hgraph OMS",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  // Register keyboard shortcuts
  mainWindow.webContents.on("before-input-event", (_event, input) => {
    if (input.type === "keyDown") {
      // F2 = new order (navigate to orders page)
      if (input.key === "F2") {
        mainWindow.webContents.executeJavaScript(
          'window.dispatchEvent(new CustomEvent("oms-shortcut", { detail: "new-order" }))',
        );
      }
      // F5 = refresh data
      if (input.key === "F5") {
        mainWindow.webContents.executeJavaScript(
          'window.dispatchEvent(new CustomEvent("oms-shortcut", { detail: "refresh" }))',
        );
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTray() {
  // Use a simple 16x16 tray icon
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("hgraph OMS");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show OMS",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
