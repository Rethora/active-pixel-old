import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { homedir } from 'os'

export interface Settings {
  displayUnproductiveNotifications: boolean
  productivityThresholdPercentage: number
  productivityCheckInterval: number
  runInBackground: boolean
  runOnStartup: boolean
  showWindowOnStartup: boolean
}

export type SettingsKey = keyof Settings

export interface Store {
  settings: Settings
}

export const defaultSettings: Settings = {
  displayUnproductiveNotifications: false,
  productivityThresholdPercentage: 70, // 70%
  productivityCheckInterval: 300000, // 5 minutes
  runInBackground: false,
  runOnStartup: false,
  showWindowOnStartup: true,
}

export const defaultStoreValues: Store = {
  settings: defaultSettings,
}

const filePath = join(
  homedir(),
  '.active-pixel',
  `${process.env['NODE_ENV'] === 'development' ? 'dev-' : ''}store.json`,
)

export const ensureDirectoryExistence = async (filePath: string) => {
  const dname = dirname(filePath)
  try {
    await fs.mkdir(dname, { recursive: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

export const readStore = async (): Promise<Store> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data) as Store
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File does not exist, return default store values
      return { ...defaultStoreValues }
    }
    throw error
  }
}

export type StoreFunctions = {
  writeStore: (store: Store) => Promise<void>
  getStoreValue: <K extends keyof Store>(key: K) => Promise<Store[K]>
  setStoreValue: <K extends keyof Store>(
    key: K,
    value: Store[K],
  ) => Promise<void>
  deleteStoreValue: <K extends keyof Store>(key: K) => Promise<void>
}

export const storeFunctions: StoreFunctions = {
  writeStore: async (store: Store) => {
    await ensureDirectoryExistence(filePath)
    await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf-8')
  },

  getStoreValue: async <K extends keyof Store>(key: K): Promise<Store[K]> => {
    const store = await readStore()
    return store[key]
  },

  setStoreValue: async <K extends keyof Store>(
    key: K,
    value: Store[K],
  ): Promise<void> => {
    const store = await readStore()
    store[key] = value
    await storeFunctions.writeStore(store)
  },

  deleteStoreValue: async <K extends keyof Store>(key: K): Promise<void> => {
    const store = await readStore()
    delete store[key]
    await storeFunctions.writeStore(store)
  },
}
