// ── app/api/gateway/verify/[checkoutId]/route.ts ──────────────────────────────
// Called by StepProof after deposit verification succeeds on a gateway session.
// Reads the stored checkout session from NestJS, fires their webhook,
// and returns successUrl for the frontend to redirect to.
// The webhook URL never reaches the browser.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie, verifySessionJwt } from "@/lib/session";

const NESTJS = process.env.NESTJS_API_URL!;

export async function POST(
  req: NextRequest,
  { params }: { params: { checkoutId: string } },
) {
  const jwt = getSessionCookie(req);
  if (!jwt)
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });

  try {
    await verifySessionJwt(jwt);
  } catch {
    return NextResponse.json({ message: "Session expired." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(
      `${NESTJS}/api/gateway/verify/${params.checkoutId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
    