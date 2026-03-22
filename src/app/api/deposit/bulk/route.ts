import { NextRequest, NextResponse } from 'next/server'

const NESTJS = process.env.NESTJS_API_URL!

// ── POST /api/deposit/bulk ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''

  try {
    // const body = await req.json()
    // const res = await fetch(`${NESTJS}/web/deposit/bulk`, {
    //   method: 'POST',
    //   headers: { Authorization: auth, 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // })
    // const data = await res.json()
    return NextResponse.json("data", { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
