import { NextRequest, NextResponse } from 'next/server'

const NESTJS = process.env.NESTJS_API_URL!

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const page = req.nextUrl.searchParams.get('page') ?? '0'

  try {
    const res = await fetch(`${NESTJS}/web/deposit/history?page=${page}`, {
      headers: { Authorization: auth },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
