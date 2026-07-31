import notificationsData from "@/lib/data/notifications.json";
import type { Notification } from "@/lib/services/types";

export async function getNotifications(): Promise<Notification[]> {
  return notificationsData.map((notification) => ({ ...notification }));
}

export async function getUnseenNotifications(): Promise<Notification[]> {
  const notifications = await getNotifications();
  return notifications.filter((notification) => !notification.seen);
}
