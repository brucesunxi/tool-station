import { NextResponse } from 'next/server'
import { setSessionCookie } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await setSessionCookie('admin')
    return NextResponse.json({ success: true, token })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
