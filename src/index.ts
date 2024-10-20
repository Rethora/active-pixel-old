import { app, BrowserWindow, Tray, Menu, ipcMain } from "electron";
import { join } from "path";
import {
  restartActivityLogger,
  startActivityLogger,
  stopActivityLogger,
} from "./utils/activityLogger";
import { Store, StoreFunctions, storeFunctions } from "@/utils/store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare global {
  interface Window {
    electronAPI: {
      getStoreValue: StoreFunctions["getStoreValue"];
      setStoreValue: StoreFunctions["setStoreValue"];
      onUnproductivePeriod: (
        callback: (activePercentage: number) => void
      ) => Electron.IpcRenderer;
    };
  }
}

export let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let isQuitting = false;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools in development.
    if (process.env["NODE_ENV"] === "development") {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on("close", (event) => {
      if (!isQuitting) {
        event.preventDefault();
        mainWindow?.hide();
      }
    });
  };

  const createTray = () => {
    console.log(app.getAppPath());
    tray = new Tray(join(app.getAppPath(), "src", "assets", "check-list.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show App",
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
          }
        },
      },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip("Active Pixel");
    tray.setContextMenu(contextMenu);
  };

  app.on("ready", async () => {
    createWindow();
    createTray();

    const displayUnproductiveNotifications = (
      await storeFunctions.getStoreValue("settings")
    ).displayUnproductiveNotifications;

    if (displayUnproductiveNotifications) {
      startActivityLogger();
    }

    // [
    //   {
    //     time: "*/5 * * * *",
    //     title: "5 min has passed",
    //     body: "Time to get to work!",
    //   },
    //   {
    //     time: "48 12 * * *",
    //     title: "It's 12:48",
    //     body: "Time to go home!",
    //   },
    // ].forEach((scheduleConfig) => {
    //   schedule.scheduleJob(scheduleConfig.time, async () => {
    //     const notification = new Notification({
    //       title: scheduleConfig.title,
    //       body: scheduleConfig.body,
    //     });
    //     notification.on("click", () => {
    //       console.log("Notification clicked");
    //     });
    //     notification.show();
    //   });
    // });
    // await initAutoLaunch()
  });

  app.on("before-quit", () => {
    stopActivityLogger();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

ipcMain.handle(
  "get-store-value",
  async <K extends keyof Store>(_: Electron.IpcMainInvokeEvent, key: K) => {
    return await storeFunctions.getStoreValue(key);
  }
);

ipcMain.handle(
  "set-store-value",
  async <K extends keyof Store>(
    _: Electron.IpcMainInvokeEvent,
    key: K,
    value: Store[K]
  ) => {
    await storeFunctions.setStoreValue(key, value);

    if (key === "settings") {
      restartActivityLogger();
    }
  }
);
