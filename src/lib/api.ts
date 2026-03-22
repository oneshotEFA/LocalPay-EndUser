import type { BulkReceipt } from "@/store/deposit.store";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("hu-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.sessionToken ?? null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function exchangeRedirectToken(redirectToken: string) {
  return apiFetch<{
    sessionToken: string;
    user: { userId: string; email: string; firstName?: string };
  }>("/api/auth/exchange", {
    method: "POST",
    body: JSON.stringify({ redirectToken }),
  });
}

export async function fetchMe() {
  return apiFetch<{ userId: string; email: string; firstName?: string }>(
    "/api/auth/me",
  );
}

// ── Single deposit ────────────────────────────────────────────────────────────

export async function submitSingleDeposit(payload: {
  amount: number;
  paymentMethod: string;
  verificationMethod: string;
  rawProof?: string | null;
}) {
  const body = JSON.stringify({
    amount: payload.amount,
    paymentMethod: payload.paymentMethod,
    verificationMethod: payload.verificationMethod,
    rawProof: payload.rawProof ?? null,
  });

  const res = await fetch(`${DEPOSIT_ENDPOINT}/single`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEPOSIT_API_TOKEN}`,
    },
    body,
  });

  return parseJsonResponse<any>(res);
}

// ── Bulk deposit ──────────────────────────────────────────────────────────────
// When verMethod is SCREENSHOT, receipts carry base64 images in rawProof.
// We send as JSON — NestJS decodes base64 on its side.

export async function submitBulkDeposit(payload: {
  declaredTotal: number;
  paymentMethod: string;
  verificationMethod: string;
  receipts: BulkReceipt[];
}) {
  const res = await fetch(`${DEPOSIT_ENDPOINT}/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEPOSIT_API_TOKEN}`,
    },
    body: JSON.stringify({
      declaredTotal: payload.declaredTotal,
      paymentMethod: payload.paymentMethod,
      verificationMethod: payload.verificationMethod,
      receipts: payload.receipts.map((r) => ({
        rawProof: r.rawProof,
        amount: r.amount,
      })),
    }),
  });

  return parseJsonResponse<any>(res);
}

const DEPOSIT_ENDPOINT = "http://localhost:3000/api/deposit";
const DEPOSIT_API_TOKEN = "76169202681efa.21@gmai.com";

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let payload: any = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }
  if (!res.ok) {
    const errorMessage =
      payload?.message ??
      payload?.reason ??
      payload?.error ??
      `Request failed: ${res.status}`;
    throw new Error(errorMessage);
  }
  return (payload ?? {}) as T;
}

// ── History ───────────────────────────────────────────────────────────────────

const HISTORY_ENDPOINT = "http://localhost:3000/api/history";
const HISTORY_API_TOKEN = "76169202681efa.21@gmai.com";
const HISTORY_DEFAULT_PAGE_SIZE = 10;

export async function fetchHistory(
  page = 0,
  pageSize = HISTORY_DEFAULT_PAGE_SIZE,
) {
  const res = await fetch(
    `${HISTORY_ENDPOINT}?page=${page}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${HISTORY_API_TOKEN}` },
    },
  );

  const data = await parseJsonResponse<any>(res);
  const safePageSize = data.pageSize ?? pageSize ?? HISTORY_DEFAULT_PAGE_SIZE;
  const safePage = data.page ?? page;
  const total = typeof data.total === "number" ? data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const inferredHasMore = (safePage + 1) * safePageSize < total;
  const hasMore =
    typeof data.hasMore === "boolean" ? data.hasMore : inferredHasMore;

  return {
    ...data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    hasMore,
  };
}
