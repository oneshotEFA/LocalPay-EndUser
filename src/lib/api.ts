import type { BulkReceipt } from '@/store/deposit.store'

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('hu-session')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.sessionToken ?? null
  } catch {
    return null
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const isFormData = init?.body instanceof FormData
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function exchangeRedirectToken(redirectToken: string) {
  return apiFetch<{ sessionToken: string; user: { userId: string; email: string; firstName?: string } }>(
    '/api/auth/exchange',
    { method: 'POST', body: JSON.stringify({ redirectToken }) },
  )
}

export async function fetchMe() {
  return apiFetch<{ userId: string; email: string; firstName?: string }>('/api/auth/me')
}

// ── Single deposit ────────────────────────────────────────────────────────────

export async function submitSingleDeposit(payload: {
  amount: number
  paymentMethod: string
  verificationMethod: string
  rawProof?: string
  screenshotFile?: File
}) {
  const form = new FormData()
  form.append('amount', String(payload.amount))
  form.append('paymentMethod', payload.paymentMethod)
  form.append('verificationMethod', payload.verificationMethod)
  if (payload.rawProof) form.append('rawProof', payload.rawProof)
  if (payload.screenshotFile) form.append('screenshot', payload.screenshotFile)
  return apiFetch<any>('/api/deposit', { method: 'POST', body: form })
}

// ── Bulk deposit ──────────────────────────────────────────────────────────────
// When verMethod is SCREENSHOT, receipts carry base64 images in rawProof.
// We send as JSON — NestJS decodes base64 on its side.

export async function submitBulkDeposit(payload: {
  declaredTotal: number
  paymentMethod: string
  verificationMethod: string
  receipts: BulkReceipt[]
}) {
  return apiFetch<any>('/api/deposit/bulk', {
    method: 'POST',
    body: JSON.stringify({
      declaredTotal: payload.declaredTotal,
      paymentMethod: payload.paymentMethod,
      verificationMethod: payload.verificationMethod,
      receipts: payload.receipts.map((r) => ({
        rawProof: r.rawProof,
        amount: r.amount,
      })),
    }),
  })
}

// ── History ───────────────────────────────────────────────────────────────────

export async function fetchHistory(page = 0) {
  return apiFetch<{
    total: number
    page: number
    pageSize: number
    totalPages: number
    deposits: Array<{
      id: string
      amount: number
      paymentMethod: string
      status: string
      transactionId: string | null
      rejectionReason: string | null
      createdAt: string
    }>
  }>(`/api/deposit/history?page=${page}`)
}
