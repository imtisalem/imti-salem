import { NextResponse } from "next/server";
import { checkAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
