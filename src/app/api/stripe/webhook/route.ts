import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Stripe webhooks are reserved for the payment phase. Verify signatures and fulfill purchases here.",
    },
    { status: 501 },
  );
}
