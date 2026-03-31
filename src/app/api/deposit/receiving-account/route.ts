import { getSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const NESTJS = process.env.NESTJS_API_URL!;

export async function GET(req: NextRequest) {
  const jwt = getSessionCookie(req);
  if (!jwt)
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  const clientId = req.nextUrl.searchParams.get("clId");
  const checkoutId = req.nextUrl.searchParams.get("chId");
  try {
    const res = await fetch(
      `${NESTJS}/api/deposit/receiving-account/${clientId}/${checkoutId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    ); //`/api/deposit/receiving-account/${clientId}/${checkoutId}`
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
