import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { homedir } from 'os'
import { v4 as uuidv4 } from 'uuid'
import { SuggestionFilters } from '@/utils/suggestions'

export interface Settings {
  displayUnproductiveNotifications: boolean
  productivityThresholdPercentage: number
  productivityCheckInterval: number
  runInBackground: boolean
  runOnStartup: boolean
  showWindowOnStartup: boolean
}

export type SettingsKey = keyof Settings

export interface Task {
  id: string
  name: string
  cronExpression: string // e.g., '0 9 * * *' for 9 AM every day
  enabled: boolean
  filters: SuggestionFilters
}

export interface Store {
  settings: Settings
  tasks: Task[]
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
  tasks: [],
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

const deepMerge = (
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> => {
  if (
    typeof target === 'object' &&
    target !== null &&
    typeof source === 'object' &&
    source !== null
  ) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(
          source[key],
          deepMerge(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          ),
        )
      }
    }
    Object.assign(target || {}, source)
    return target
  }
  return source
}

export const readStore = async (): Promise<Store> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const parsedData = JSON.parse(data)
    const store = deepMerge(
      { ...defaultStoreValues },
      parsedData,
    ) as unknown as Store
    return store
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File does not exist, return default store values
      return defaultStoreValues
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
  getAllTasks: () => Promise<Task[]>
  getTask: (id: string) => Promise<Task | undefined>
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>
  editTask: (id: string, update: Partial<Omit<Task, 'id'>>) => Promise<Task>
  deleteTask: (task: Task) => Promise<void>
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

  getAllTasks: async (): Promise<Task[]> => {
    const store = await readStore()
    return store.tasks
  },

  getTask: async (id: string): Promise<Task | undefined> => {
    const store = await readStore()
    return store.tasks.find((t) => t.id === id)
  },

  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const store = await readStore()
    const newTask: Task = { ...task, id: uuidv4() }
    store.tasks.push(newTask)
    await storeFunctions.writeStore(store)
    return newTask
  },

  editTask: async (
    id: string,
    update: Partial<Omit<Task, 'id'>>,
  ): Promise<Task> => {
    const store = await readStore()
    const task = store.tasks.find((t) => t.id === id)
    if (task) {
      Object.assign(task, update)
      await storeFunctions.writeStore(store)
      return task
    } else {
      throw new Error('Task not found')
    }
  },

  deleteTask: async (task: Task): Promise<void> => {
    const store = await readStore()
    const index = store.tasks.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      store.tasks.splice(index, 1)
      await storeFunctions.writeStore(store)
    } else {
      throw new Error('Task not found')
    }
  },
}
