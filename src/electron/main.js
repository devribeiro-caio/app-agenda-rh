const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let apiProcess;

function startApi() {
  if (process.env.ELECTRON_SKIP_API === "true") return;
  if (!app.isPackaged) return;

  apiProcess = spawn(process.execPath, [path.join(__dirname, "../backend/server.js")], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: "inherit"
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 1024,
    minHeight: 640,
    title: "Agenda RH",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  startApi();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (apiProcess) apiProcess.kill();
});
