import userData from "@/lib/data/user.json";
import type { User } from "@/lib/services/types";
import { createIndigoUser } from "@/lib/data/fixtures/indigo-user.fixture";

/**
 * User service. Stands in for a real user microservice; in this demo it
 * reads a static fixture, but the signature is what the BFF depends on.
 */
export async function getUser(): Promise<User> {
  return { ...userData, ...createIndigoUser() };
}
