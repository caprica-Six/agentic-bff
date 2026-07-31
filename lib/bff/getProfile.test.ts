import { describe, expect, it } from "vitest";
import { createIndigoUser } from "@/lib/data/fixtures/indigo-user.fixture";
import { getProfile } from "./getProfile";

describe("getProfile", () => {
  it("returns the expected mock profile values", async () => {
    const profile = await getProfile();
    const indigo = createIndigoUser();

    expect(profile).toEqual({
      name: `${indigo.first_name} ${indigo.last_name}`,
      location: indigo.location,
      address: indigo.address,
      joined: "2022-02-11T00:00:00.000Z",
      last_seen: "2024-05-01T00:00:00.000Z",
      new_notifications: 6,
      new_messages: 14,
      new_friend_requests: 18,
    });
  });
});
