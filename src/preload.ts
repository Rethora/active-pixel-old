// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { Store, Task } from '@/utils/store'

contextBridge.exposeInMainWorld('electronAPI', {
  getStoreValue: <K extends keyof Store>(key: K): Promise<Store[K]> =>
    ipcRenderer.invoke('get-store-value', key),
  setStoreValue: <K extends keyof Store>(
    key: K,
    value: Store[K],
  ): Promise<void> => ipcRenderer.invoke('set-store-value', key, value),
  getAllTasks: () => ipcRenderer.invoke('get-all-tasks'),
  getTask: (id: string) => ipcRenderer.invoke('get-task', id),
  createTask: (task: Omit<Task, 'id'>) =>
    ipcRenderer.invoke('create-task', task),
  editTask: (id: string, update: Partial<Omit<Task, 'id'>>) =>
    ipcRenderer.invoke('edit-task', id, update),
  deleteTask: (task: Store['tasks'][0]) =>
    ipcRenderer.invoke('delete-task', task),
  onUnproductivePeriod: (callback: (activePercentage: number) => void) =>
    ipcRenderer.on('unproductive-period', (_, activePercentage: number) =>
      callback(activePercentage),
    ),
  handleTask: (callback: (task: Task) => void) =>
    ipcRenderer.on('handle-task', (_, task: Task) => callback(task)),
  quitApp: () => ipcRenderer.invoke('quit-app'),
})
