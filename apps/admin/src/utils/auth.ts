import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret");
    return true;
  } catch {
    return false;
  }
}