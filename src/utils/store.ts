import { promises as fs } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";

export type SettingsKey = "displayUnproductiveNotifications";

const filePath = join(homedir(), ".active-pixel", "store.json");

async function ensureDirectoryExistence(filePath: string) {
  const dname = dirname(filePath);
  try {
    await fs.mkdir(dname, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

async function readStore() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File does not exist, return an empty object
      return {};
    }
    throw error;
  }
}

async function writeStore(data: any) {
  await ensureDirectoryExistence(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function getSetting(key: SettingsKey) {
  const store = await readStore();
  if (store.settings && store.settings[key] !== undefined) {
    return store.settings[key];
  }

  // Return default value if key is not found
  const defaults: Record<SettingsKey, any> = {
    displayUnproductiveNotifications: true,
  };
  return defaults[key];
}

async function setSetting(key: SettingsKey, value: any) {
  const store = await readStore();
  if (!store.settings) {
    store.settings = {};
  }
  store.settings[key] = value;
  await writeStore(store);
}

export { getSetting, setSetting };
