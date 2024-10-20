import { powerMonitor, Notification } from "electron";

const IDLE_THRESHOLD = 1; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
const PRODUCTIVITY_CHECK_INTERVAL_MIN = 5;
const PRODUCTIVITY_CHECK_INTERVAL_MS =
  PRODUCTIVITY_CHECK_INTERVAL_MIN * 60 * 1000; // 5 minutes
const PRODUCTIVITY_THRESHOLD_PERCENTAGE = 70; // 70%
const NOTIFICATION_DELAY_MS = 5000; // 5 seconds

let activeTime = 0;
let checkInterval: NodeJS.Timeout;

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

const showProductivityNotification = (activePercentage: number) => {
  const notification = new Notification({
    title: "Productivity Check",
    body: `You've been ${activePercentage.toFixed(
      2
    )}% active in the last 5 minutes. ${
      activePercentage >= PRODUCTIVITY_THRESHOLD_PERCENTAGE
        ? "Keep it up!"
        : "Time to focus!"
    }`,
  });
  notification.show();
};

const checkUserProductivity = () => {
  const activePercentage =
    (activeTime / (PRODUCTIVITY_CHECK_INTERVAL_MS / 1000)) * 100;

  const idleTime = powerMonitor.getSystemIdleTime();
  if (idleTime >= IDLE_THRESHOLD) {
    showProductivityNotification(activePercentage);
    resetActiveTime();
  } else {
    console.log("User is busy, delaying notification...");
    setTimeout(checkUserProductivity, NOTIFICATION_DELAY_MS);
  }
};

export const startActivityLogger = () => {
  checkInterval = setInterval(trackActivity, CHECK_INTERVAL_MS); // Check every second
  setInterval(checkUserProductivity, PRODUCTIVITY_CHECK_INTERVAL_MS); // Check every 5 minutes
};

export const stopActivityLogger = () => {
  clearInterval(checkInterval);
};
