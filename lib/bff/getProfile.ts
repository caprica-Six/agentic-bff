import { getUser } from "@/lib/services/user";
import { getUnreadMessages, getLatestMessage } from "@/lib/services/messages";
import { getUnseenNotifications } from "@/lib/services/notifications";
import { getFriendRequests } from "@/lib/services/friend-requests";

function toTimestamp(value: string): Date {
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    return new Date(numericValue * 1000);
  }

  return new Date(value);
}

export interface Profile {
  name: string;
  location: string;
  address: string;
  joined: string;
  last_seen: string;
  new_notifications: number;
  new_messages: number;
  new_friend_requests: number;
}

/**
 * The BFF aggregator. Calls each service function directly (no internal
 * HTTP hop) and shapes the result into the single DTO both the web UI and
 * the MCP tool consume — the "why this matters for agents" payload stays
 * small because the shaping happens once, here, not per consumer.
 */
export async function getProfile(): Promise<Profile> {
  const [user, unreadMessages, latestMessage, unseenNotifications, friendRequests] =
    await Promise.all([
      getUser(),
      getUnreadMessages(),
      getLatestMessage(),
      getUnseenNotifications(),
      getFriendRequests(),
    ]);

  return {
    name: `${user.first_name} ${user.last_name}`,
    location: user.location,
    address: user.address,
    joined: new Date(user.created_at).toISOString(),
    last_seen: toTimestamp(latestMessage.created_at).toISOString(),
    new_notifications: unseenNotifications.length,
    new_messages: unreadMessages.length,
    new_friend_requests: friendRequests.length,
  };
}
