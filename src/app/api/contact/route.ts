import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload?.firstName || !payload?.lastName || !payload?.email || !payload?.message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Build-safe placeholder: connect Resend, Postmark, or another email provider here.
  return NextResponse.json({
    ok: true,
    message: "Contact submission accepted.",
  });
}
