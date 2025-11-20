import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ message: "Logged in" });
    response.cookies.set({
      name: "admin_token",
      value: "secret_token_123",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1h
    });
    return response;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
