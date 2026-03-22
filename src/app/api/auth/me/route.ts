import { NextRequest, NextResponse } from 'next/server'

const NESTJS = process.env.NESTJS_API_URL!

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''

  try {
    // const res = await fetch(`${NESTJS}/web/auth/me`, {
    //   headers: { Authorization: auth },
    // })
    // const data = await res.json()
    // if (!res.ok) {
    //   return NextResponse.json({ message: data.message }, { status: res.status })
    // }
    return NextResponse.json("data")
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
