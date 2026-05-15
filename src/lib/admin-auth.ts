import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'toolstation_admin'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function getSecret(): string {
  return process.env.ADMIN_SECRET || 'default-secret-change-me'
}

function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}

export function createSession(username: string): string {
  const secret = getSecret()
  const payload = `${username}:${Date.now()}`
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${hmac}`
}

function verifySession(token: string): string | null {
  try {
    const secret = getSecret()
    const parts = token.split(':')
    if (parts.length < 3) return null
    const hmac = parts.pop()
    const payload = parts.join(':')
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (hmac !== expected) return null
    const [, timestampStr] = payload.split(':')
    const timestamp = parseInt(timestampStr, 10)
    if (Date.now() - timestamp > SESSION_DURATION) return null
    return parts[0]
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

export async function setSessionCookie(username: string): Promise<string> {
  const token = createSession(username)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
  return token
}

export function clearSession() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  return input === pw
}
