import { Platform } from "react-native";

let Notifications = null;

try {
  Notifications = require("expo-notifications");
} catch (error) {
  console.warn("expo-notifications unavailable, reminders disabled", error);
}

if (Notifications && Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const notificationsService = {
  async requestPermissions() {
    if (!Notifications || Platform.OS === "web") return false;

    const settings = await Notifications.requestPermissionsAsync();
    return settings.granted;
  },

  async scheduleReminder(taskTitle) {
    if (!Notifications || Platform.OS === "web") {
      console.warn("Notifications are unavailable in this environment");
      return false;
    }

    const permissionGranted = await this.requestPermissions();
    if (!permissionGranted) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pending task reminder",
        body: `${taskTitle} still needs attention.`,
        sound: true,
      },
      trigger: {
        type: "timeInterval",
        seconds: 10,
      },
    });

    return true;
  },

  async cancelAll() {
    if (!Notifications || Platform.OS === "web") return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
