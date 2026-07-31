import messagesData from "@/lib/data/messages.json";
import type { Message } from "@/lib/services/types";

export async function getMessages(): Promise<Message[]> {
  return messagesData.map((message) => ({ ...message }));
}

export async function getUnreadMessages(): Promise<Message[]> {
  const messages = await getMessages();
  return messages.filter((message) => !message.read);
}

export async function getLatestMessage(): Promise<Message> {
  const messages = await getMessages();
  return messages.reduce((latest, current) =>
    Number(latest.created_at) > Number(current.created_at) ? latest : current
  );
}
