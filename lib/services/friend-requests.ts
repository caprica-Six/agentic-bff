import friendRequestsData from "@/lib/data/friend-requests.json";
import type { FriendRequest } from "@/lib/services/types";

export async function getFriendRequests(): Promise<FriendRequest[]> {
  return friendRequestsData.map((request) => ({ ...request }));
}
