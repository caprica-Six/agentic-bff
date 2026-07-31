import type { User } from "@/lib/services/types";
import { createUser } from "../factories/user.factory";

export function createIndigoUser(): User {
  return createUser({
    first_name: "Indigo",
    last_name: "Marchetti",
    email: "imarchetti0@webs.com",
    gender: "Female",
    location: "United Kingdom",
    address: "3717 Blackbird Center",
    created_at: "2/11/2022",
  });
}
