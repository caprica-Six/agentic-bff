import type { User } from "@/lib/services/types";

export interface UserOverrides {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  ip_address?: string;
  location?: string;
  address?: string;
  created_at?: string;
}

function createBaseUser(overrides: UserOverrides = {}): User {
  return {
    id: 1,
    first_name: "User",
    last_name: "One",
    email: "user.one@example.com",
    gender: "Unknown",
    ip_address: "127.0.0.1",
    location: "Unknown",
    address: "123 Test Street",
    created_at: "2022-01-01",
    ...overrides,
  };
}

export function createUser(overrides: UserOverrides = {}): User {
  return createBaseUser(overrides);
}
