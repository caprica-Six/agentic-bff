import { getProfile } from "@/lib/bff/getProfile";

/**
 * The web client refetches this endpoint client-side (via React Query) to
 * demonstrate the modern equivalent of the legacy repo's axios refetch —
 * the aggregator itself never makes an HTTP call to get here.
 */
export async function GET() {
  const profile = await getProfile();
  return Response.json(profile);
}
