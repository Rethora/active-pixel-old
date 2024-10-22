// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { Store } from '@/utils/store'

contextBridge.exposeInMainWorld('electronAPI', {
  getStoreValue: <K extends keyof Store>(key: K): Promise<Store[K]> =>
    ipcRenderer.invoke('get-store-value', key),
  setStoreValue: <K extends keyof Store>(
    key: K,
    value: Store[K],
  ): Promise<void> => ipcRenderer.invoke('set-store-value', key, value),
  onUnproductivePeriod: (callback: (activePercentage: number) => void) =>
    ipcRenderer.on('unproductive-period', (_, activePercentage: number) =>
      callback(activePercentage),
    ),
  quitApp: () => ipcRenderer.invoke('quit-app'),
})
