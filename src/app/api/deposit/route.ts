import { NextRequest, NextResponse } from "next/server";

const NESTJS = process.env.NESTJS_API_URL!;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";

  try {
    // Forward multipart form directly to NestJS
    const formData = await req.formData();

    // const res = await fetch(`${NESTJS}/web/deposit`, {
    //   method: 'POST',
    //   headers: { Authorization: auth },
    //   // @ts-ignore — Node fetch accepts FormData
    //   body: formData,
    // })

    // const data = await res.json()
    return NextResponse.json("data", { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
