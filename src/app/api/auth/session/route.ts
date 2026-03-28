// ── app/api/auth/session/route.ts ─────────────────────────────────────────────
// Called by /deposit/[token]/page.tsx after the user lands from the external
// service. Decodes the JWT token, verifies signature + expiry, signs a session
// JWT, and sets it as an httpOnly cookie.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { decodeCheckoutToken } from "@/lib/token";
import {
  createSessionJwt,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { code: "MISSING_PARAMS", message: "Missing token." },
        { status: 400 },
      );
    }

    const { userId, email, checkoutId, invoiceId, amount } =
      await decodeCheckoutToken(token);

    const jwt = await createSessionJwt({ userId, email });
    const response = NextResponse.json({
      ok: true,
      email,
      checkoutId,
      invoiceId,
      amount,
    });
    setSessionCookie(response, jwt);

    return response;
  } catch (err: any) {
    const code = err.message ?? "UNKNOWN_ERROR";
    return NextResponse.json({ code, message: code }, { status: 401 });
  }
}

export async function DELETE(_req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
