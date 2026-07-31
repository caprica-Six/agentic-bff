import type { Notification } from "@/lib/services/types";

export interface NotificationOverrides {
  uid?: string;
  text?: string;
  created_at?: string;
  seen?: number;
}

export function createNotification(overrides: NotificationOverrides = {}): Notification {
  return {
    uid: "notification-1",
    text: "New activity",
    created_at: "1",
    seen: 0,
    ...overrides,
  };
}

export function createSeenNotification(): Notification {
  return createNotification({ seen: 1 });
}
