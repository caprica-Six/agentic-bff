import type { FriendRequest } from "@/lib/services/types";
import { createUser } from "./user.factory";

export interface FriendRequestOverrides {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  ip_address?: string;
  address?: string;
  created_at?: string;
}

export function createFriendRequest(overrides: FriendRequestOverrides = {}): FriendRequest {
  const baseUser = createUser();

  return {
    id: 1,
    first_name: baseUser.first_name,
    last_name: baseUser.last_name,
    email: baseUser.email,
    gender: baseUser.gender,
    ip_address: baseUser.ip_address,
    address: baseUser.address,
    created_at: "2022-01-01",
    ...overrides,
  };
}
