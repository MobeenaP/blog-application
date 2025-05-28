import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password;

  const username = body.username || "admin";
  if (password === "123") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "10m" });

    // Set cookie for 3 minutes
    const expires = new Date(Date.now() + 3 * 60 * 1000).toUTCString();
    const response = NextResponse.json({ token });
    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; SameSite=Lax; Expires=${expires}; HttpOnly`
    );
    return response;
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}