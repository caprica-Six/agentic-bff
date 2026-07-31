import { getUser } from "@/lib/services/user";

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
