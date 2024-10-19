// import { ipcMain, Notification } from "electron";
// import { mainWindow } from "..";

// ipcMain.handle("display-notification", async () => {
//   const notification = new Notification({
//     title: "Task Reminder",
//     body: "Hey! You have a task to complete.",
//     silent: true,
//   });
//   notification.on("click", () => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) {
//         mainWindow.restore();
//       }
//       mainWindow.show();
//     }
//   });
//   notification.show();
// });
