import { NextRequest, NextResponse } from 'next/server'

const NESTJS = process.env.NESTJS_API_URL!

export async function POST(req: NextRequest) {
  try {
    const { redirectToken } = await req.json()
    // if (!redirectToken) {
    //   return NextResponse.json({ message: 'Missing redirectToken' }, { status: 400 })
    // }

    // // Forward to NestJS — NestJS verifies the redirect JWT and returns a session token
    // const res = await fetch(`${NESTJS}/web/auth/verify`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ redirectToken }),
    // })

    // const data = await res.json()
    // if (!res.ok) {
    //   return NextResponse.json({ message: data.message ?? 'Auth failed' }, { status: res.status })
    // }

    return NextResponse.json({ sessionToken:" data.sessionToken" })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
