import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe is planned but not configured. Add STRIPE_SECRET_KEY and install stripe when payments move into scope.",
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    {
      error:
        "Stripe dependency is intentionally deferred for v1. This route documents the future checkout boundary.",
    },
    { status: 501 },
  );
}
