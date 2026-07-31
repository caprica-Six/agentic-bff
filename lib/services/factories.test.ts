import { describe, expect, it } from "vitest";
import { createFriendRequest } from "@/lib/data/factories/friend-request.factory";
import { createMessage, createReadMessage } from "@/lib/data/factories/message.factory";
import { createNotification, createSeenNotification } from "@/lib/data/factories/notification.factory";
import { createUser } from "@/lib/data/factories/user.factory";
import { createIndigoUser } from "@/lib/data/fixtures/indigo-user.fixture";

describe("service factories", () => {
  it("creates a user with overrides and fresh state per call", () => {
    const first = createUser({ id: 1 });
    const second = createUser({ id: 2 });

    expect(first).toMatchObject({ id: 1, first_name: "User", last_name: "One" });
    expect(second).toMatchObject({ id: 2, first_name: "User", last_name: "One" });
    expect(first).not.toBe(second);
  });

  it("creates an indigo user from canonical fixture data", () => {
    const user = createIndigoUser();

    expect(user).toMatchObject({
      first_name: "Indigo",
      last_name: "Marchetti",
      location: "United Kingdom",
      address: "3717 Blackbird Center",
    });
  });

  it("creates message and notification variants for intent-based tests", () => {
    const unread = createMessage();
    const read = createReadMessage();
    const unseen = createNotification();
    const seen = createSeenNotification();

    expect(unread.read).toBe(false);
    expect(read.read).toBe(true);
    expect(unseen.seen).toBe(0);
    expect(seen.seen).toBe(1);
  });

  it("builds a friend request from a composed user factory", () => {
    const request = createFriendRequest({ id: 42, created_at: "4/12/2022" });

    expect(request).toMatchObject({
      id: 42,
      first_name: "User",
      last_name: "One",
      created_at: "4/12/2022",
    });
  });
});
