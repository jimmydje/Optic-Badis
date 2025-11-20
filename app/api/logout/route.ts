// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.json(
    { message: "Déconnecté" },
    { headers: { "Set-Cookie": cookie } }
  );
}
