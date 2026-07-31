import type { Message } from "@/lib/services/types";

export interface MessageOverrides {
  uid?: string;
  text?: string;
  read?: boolean;
  created_at?: string;
}

export function createMessage(overrides: MessageOverrides = {}): Message {
  return {
    uid: "message-1",
    text: "Hello",
    read: false,
    created_at: "1",
    ...overrides,
  };
}

export function createReadMessage(): Message {
  return createMessage({ read: true });
}
