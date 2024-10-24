import { app, BrowserWindow, Tray, Menu, ipcMain, Notification } from 'electron'
import { join } from 'path'
import {
  restartActivityLogger,
  startActivityLogger,
  stopActivityLogger,
} from '@/utils/activityLogger'
import { Store, StoreFunctions, storeFunctions, Task } from '@/utils/store'
import AutoLaunch from 'auto-launch'
import schedule from 'node-schedule'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

declare global {
  interface Window {
    electronAPI: {
      getStoreValue: StoreFunctions['getStoreValue']
      setStoreValue: StoreFunctions['setStoreValue']
      getAllTasks: StoreFunctions['getAllTasks']
      getTask: StoreFunctions['getTask']
      createTask: StoreFunctions['createTask']
      editTask: StoreFunctions['editTask']
      deleteTask: StoreFunctions['deleteTask']
      onUnproductivePeriod: (
        callback: (activePercentage: number) => void,
      ) => Electron.IpcRenderer
      handleTask: (callback: (task: Task) => void) => Electron.IpcRenderer
      quitApp: () => void
    }
  }
}

export let mainWindow: BrowserWindow | null
let tray: Tray | null
let isQuitting = false
// ! This flag is needed because can't get async value on close event
let shouldRunInBackground: boolean
const scheduledJobs: { [key: string]: schedule.Job } = {}

;(async () => {
  shouldRunInBackground = (await storeFunctions.getStoreValue('settings'))
    .runInBackground
})()

const autoLauncher = new AutoLaunch({
  name: 'Active Pixel',
  path: app.getPath('exe'),
})

const initAutoLaunch = async () => {
  const runOnStartup = (await storeFunctions.getStoreValue('settings'))
    .runOnStartup
  if (runOnStartup) {
    await autoLauncher.enable()
  } else {
    await autoLauncher.disable()
  }
}

export const showHiddenWindow = () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
    }
  }
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  isQuitting = true
  app.quit()
} else {
  app.on('second-instance', () => {
    console.log('mainWindow', mainWindow)
    showHiddenWindow()
  })
}

const createWindow = async () => {
  const settings = await storeFunctions.getStoreValue('settings')
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: !settings.runInBackground || settings.showWindowOnStartup,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools in development.
  if (process.env['NODE_ENV'] === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      if (!shouldRunInBackground) {
        console.log('quitting app')
        isQuitting = true
        app.quit()
      } else {
        console.log('hiding window')
        event.preventDefault()
        mainWindow?.hide()
      }
    } else {
      console.log('quitting app')
      app.quit()
    }
  })
}

const createTray = () => {
  console.log(app.getAppPath())
  const iconPath =
    process.env['NODE_ENV'] === 'development'
      ? join(app.getAppPath(), 'src', 'assets', 'icon.png')
      : join(process.resourcesPath, 'assets', 'icon.png')
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        showHiddenWindow()
      },
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])
  tray.setToolTip('Active Pixel')
  tray.setContextMenu(contextMenu)
}

const createLaunchNotification = () => {
  const notification = new Notification({
    title: 'Active Pixel is running in the background',
    body: 'Click here to open the app',
  })
  notification.on('click', () => {
    console.log('mainWindow', mainWindow)
    showHiddenWindow()
  })
  notification.show()
}

const addCronJob = (task: Task) => {
  if (!task.enabled) {
    return
  }
  console.log('Adding cron job', task.name)
  const job = schedule.scheduleJob(task.cronExpression, () => {
    const notification = new Notification({
      title: task.name,
      body: 'Click here to get a suggestion',
    })
    notification.on('click', () => {
      showHiddenWindow()
      mainWindow?.webContents.send('handle-task', task)
    })
    notification.show()
  })
  scheduledJobs[task.id] = job
}

const editCronJob = (task: Task) => {
  console.log('Editing cron job', task.name)
  if (scheduledJobs[task.id]) {
    scheduledJobs[task.id]?.cancel()
  }
  addCronJob(task)
}

const deleteCronJob = (taskId: string) => {
  console.log('Deleting cron job', taskId)
  if (scheduledJobs[taskId]) {
    scheduledJobs[taskId]?.cancel()
    delete scheduledJobs[taskId]
  }
}

app.on('ready', async () => {
  console.log('App is ready')
  const settings = await storeFunctions.getStoreValue('settings')
  console.log('active settings', settings)
  createWindow()
  createTray()
  await startActivityLogger()
  await initAutoLaunch()
  if (!settings.showWindowOnStartup && settings.runInBackground) {
    createLaunchNotification()
  }
  const tasks = await storeFunctions.getAllTasks()
  tasks.forEach(addCronJob)
})

app.on('before-quit', () => {
  stopActivityLogger()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle(
  'get-store-value',
  async <K extends keyof Store>(_: Electron.IpcMainInvokeEvent, key: K) => {
    return await storeFunctions.getStoreValue(key)
  },
)

ipcMain.handle(
  'set-store-value',
  async <K extends keyof Store>(
    _: Electron.IpcMainInvokeEvent,
    key: K,
    value: Store[K],
  ) => {
    console.log('Setting store value', key, value)
    await storeFunctions.setStoreValue(key, value)

    if (key === 'settings') {
      // * Restart the activity logger if the settings have changed
      // TODO: fine tune this to only check the necessary settings
      restartActivityLogger()

      const settings = await storeFunctions.getStoreValue('settings')
      if (settings.runOnStartup) {
        autoLauncher.enable()
      } else {
        autoLauncher.disable()
      }

      shouldRunInBackground = settings.runInBackground
    }
  },
)

ipcMain.handle('get-all-tasks', async () => {
  return await storeFunctions.getAllTasks()
})

ipcMain.handle(
  'get-task',
  async (_: Electron.IpcMainInvokeEvent, id: string) => {
    return await storeFunctions.getTask(id)
  },
)

ipcMain.handle(
  'create-task',
  async (_: Electron.IpcMainInvokeEvent, task: Omit<Task, 'id'>) => {
    const newTask = await storeFunctions.createTask(task)
    addCronJob(newTask)
  },
)

ipcMain.handle(
  'edit-task',
  async (
    _: Electron.IpcMainInvokeEvent,
    id: string,
    update: Partial<Omit<Task, 'id'>>,
  ) => {
    try {
      const task = await storeFunctions.editTask(id, update)
      editCronJob(task)
    } catch (error) {
      console.error('Error editing task:', error)
    }
  },
)

ipcMain.handle(
  'delete-task',
  async (_: Electron.IpcMainInvokeEvent, task: Task) => {
    await storeFunctions.deleteTask(task)
    deleteCronJob(task.id)
  },
)

ipcMain.handle('quit-app', () => {
  isQuitting = true
  app.quit()
})
