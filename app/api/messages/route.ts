import { getMessages, getUnreadMessages, getLatestMessage } from "@/lib/services/messages";

export async function GET(request: Request) {
  const action = new URL(request.url).searchParams.get("action");

  if (action === "unread") {
    return Response.json(await getUnreadMessages());
  }

  if (action === "latest") {
    return Response.json(await getLatestMessage());
  }

  return Response.json(await getMessages());
}
