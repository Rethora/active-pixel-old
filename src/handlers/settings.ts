import { ipcMain } from "electron";
import { getSetting, setSetting, SettingsKey } from "../utils/store";
import {
  startActivityLogger,
  stopActivityLogger,
} from "../utils/activityLogger";

ipcMain.handle("get-setting", async (_, key: SettingsKey) => {
  return await getSetting(key);
});

ipcMain.handle("set-setting", async (_, key: SettingsKey, value) => {
  await setSetting(key, value);

  if (key === "displayUnproductiveNotifications") {
    value === true ? startActivityLogger() : stopActivityLogger();
  }
});
