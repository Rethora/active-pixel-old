import { powerMonitor, Notification } from "electron";
import { mainWindow } from "../index";

const IDLE_THRESHOLD = 1; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
// TODO: change back to 5 minutes
const PRODUCTIVITY_CHECK_INTERVAL_MIN = 1; // 5 minutes
const PRODUCTIVITY_CHECK_INTERVAL_MS =
  PRODUCTIVITY_CHECK_INTERVAL_MIN * 60 * 1000; // 5 minutes
const PRODUCTIVITY_THRESHOLD_PERCENTAGE = 70; // 70%
const NOTIFICATION_DELAY_MS = 5000; // 5 seconds

let activeTime = 0;
let shortCheckInterval: NodeJS.Timeout;
let longCheckInterval: NodeJS.Timeout;

const resetActiveTime = () => {
  activeTime = 0;
};

const trackActivity = () => {
  const idleTime = powerMonitor.getSystemIdleTime();
  if (idleTime < IDLE_THRESHOLD) {
    activeTime += 1;
  }
  console.log("Idle Time:", idleTime);
  console.log("Active Time:", activeTime);
};

const showUnproductiveNotification = (activePercentage: number) => {
  const activePercentageRounded = Math.round(activePercentage);
  const notification = new Notification({
    title: "Ready for a short break?",
    body: "A quick stretch can help you stay productive!",
  });
  notification.on("click", () => {
    console.log(mainWindow);
    if (mainWindow?.isMinimized()) {
      console.log("Restoring window...");
      mainWindow.restore();
    }
    mainWindow?.show();
    mainWindow?.focus();
    mainWindow?.webContents.send(
      "unproductive-period",
      activePercentageRounded
    );
  });

  notification.show();
};

const checkUserProductivity = () => {
  const activePercentage =
    (activeTime / (PRODUCTIVITY_CHECK_INTERVAL_MS / 1000)) * 100;

  const idleTime = powerMonitor.getSystemIdleTime();
  if (activePercentage <= PRODUCTIVITY_THRESHOLD_PERCENTAGE) {
    if (idleTime >= IDLE_THRESHOLD) {
      handleUnproductivePeriod(activePercentage);
    } else {
      console.log("User is busy, delaying notification...");
      setTimeout(checkUserProductivity, NOTIFICATION_DELAY_MS);
    }
  } else {
    resetActiveTime();
  }
};

const handleUnproductivePeriod = (activePercentage: number) => {
  showUnproductiveNotification(activePercentage);
  resetActiveTime();
};

export const startActivityLogger = () => {
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS); // Check every second
  longCheckInterval = setInterval(
    checkUserProductivity,
    PRODUCTIVITY_CHECK_INTERVAL_MS
  ); // Check every 5 minutes
};

export const stopActivityLogger = () => {
  clearInterval(shortCheckInterval);
  clearInterval(longCheckInterval);
};
