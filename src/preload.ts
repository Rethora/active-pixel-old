// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getSystemIdleTime: () => ipcRenderer.invoke("get-system-idle-time"),
  displayNotification: () => ipcRenderer.invoke("display-notification"),
  getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
  setSetting: (key: string, value: any) =>
    ipcRenderer.invoke("set-setting", key, value),
  onUnproductivePeriod: (callback: (activePercentage: number) => void) =>
    ipcRenderer.on("unproductive-period", (_, activePercentage: number) =>
      callback(activePercentage)
    ),
});
