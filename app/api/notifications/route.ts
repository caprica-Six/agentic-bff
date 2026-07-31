import { getNotifications, getUnseenNotifications } from "@/lib/services/notifications";

export async function GET(request: Request) {
  const action = new URL(request.url).searchParams.get("action");

  if (action === "unseen") {
    return Response.json(await getUnseenNotifications());
  }

  return Response.json(await getNotifications());
}
