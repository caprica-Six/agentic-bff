import { getFriendRequests } from "@/lib/services/friend-requests";

export async function GET() {
  const friendRequests = await getFriendRequests();
  return Response.json(friendRequests);
}
