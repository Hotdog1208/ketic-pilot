import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ketic_admin";

export function isAdminAuthenticated(): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const value = cookies().get(ADMIN_COOKIE)?.value;
  return value === expected;
}
