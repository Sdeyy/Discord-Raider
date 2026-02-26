const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

Menu.setApplicationMenu(false);

require("electron-reload")(__dirname, {
  electron: path.join(process.cwd(), "node_modules", ".bin", "electron"),
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

const _ProgressBar = require("electron-progressbar");

// Wrap ProgressBar to inject dark theme + green progress bar styling
global.ProgressBar = function (options) {
  if (!options.style) options.style = {};
  if (!options.style.text) options.style.text = {};
  if (!options.style.detail) options.style.detail = {};
  if (!options.style.bar) options.style.bar = {};
  if (!options.style.value) options.style.value = {};

  // Dark background + green progress bar
  options.style.text = Object.assign({ color: "#ffffff" }, options.style.text);
  options.style.detail = Object.assign(
    { color: "#cccccc" },
    options.style.detail
  );
  options.style.bar = Object.assign(
    { width: "100%", background: "#2d2d2d" },
    options.style.bar
  );
  options.style.value = Object.assign(
    { background: "#4caf50" },
    options.style.value
  );

  // Dark window background + fix contextIsolation for Electron 12+
  if (!options.browserWindow) options.browserWindow = {};
  options.browserWindow.backgroundColor =
    options.browserWindow.backgroundColor || "#1a1a2e";

  // electron-progressbar's internal renderer uses require("electron").ipcRenderer
  // which requires nodeIntegration AND contextIsolation: false in Electron 12+
  if (!options.browserWindow.webPreferences)
    options.browserWindow.webPreferences = {};
  options.browserWindow.webPreferences.nodeIntegration = true;
  options.browserWindow.webPreferences.contextIsolation = false;

  return new _ProgressBar(options);
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // NOTE: nodeIntegration + no contextIsolation is insecure but required
      // by the current architecture. A future refactor should move to
      // contextBridge + preload scripts with IPC communication.
    },
    width: 1000,
    height: 600,
    frame: false,
    resizable: false,
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "img/icon.png"),
  });

  mainWindow.loadFile(path.join(__dirname, "alert.html"));

  // Use shell.openExternal instead of deprecated 'new-window' event
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});