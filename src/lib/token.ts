// ── lib/token.ts ─────────────────────────────────────────────────────────────
// URL shape: /deposit/<jwt>
//
// JWT contains: userId, email, checkoutId, invoiceId, amount
// Signed with HS256 using URL_SECRET
// Expires in 5 minutes
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_S = 5 * 60; // 5 minutes

const encoder = new TextEncoder();

function b64url(buf: ArrayBuffer | Uint8Array): string {
  return Buffer.from(buf as ArrayBuffer).toString("base64url");
}

function fromB64url(str: string): ArrayBuffer {
  const buf = Buffer.from(str, "base64url");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.URL_SECRET!;
  if (!secret) throw new Error("URL_SECRET env var is not set");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// ── Payload shape ─────────────────────────────────────────────────────────────

export interface CheckoutTokenPayload {
  userId: string;
  email: string;
  checkoutId: string;
  invoiceId: string;
  amount: number;
}

// ── Build redirect URL (called by your NestJS /gateway/checkout) ──────────────
// Returns a full JWT path token: /deposit/<jwt>

export async function buildCheckoutToken(
  payload: CheckoutTokenPayload,
): Promise<string> {
  const header = b64url(
    encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })),
  );

  const body = b64url(
    encoder.encode(
      JSON.stringify({
        sub: payload.userId, // who — matches their pattern
        email: payload.email,
        cid: payload.checkoutId, // cryptic keys like their pattern
        iid: payload.invoiceId,
        amt: payload.amount,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + WINDOW_S,
        aud: "checkout", // matches their pattern
        iss: process.env.NEXT_PUBLIC_APP_DOMAIN,
      }),
    ),
  );

  const data = `${header}.${body}`;
  const key = await getSigningKey();
  const sig = await crypto.subtle.sign(
    { name: "HMAC" },
    key,
    encoder.encode(data),
  );

  return `${data}.${b64url(sig)}`;
}

// ── Decode + verify (called by /deposit/[token] page) ────────────────────────

export async function decodeCheckoutToken(
  token: string,
): Promise<CheckoutTokenPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("INVALID_TOKEN");

  const [header, body, sigPart] = parts;
  const data = `${header}.${body}`;

  const key = await getSigningKey();
  const valid = await crypto.subtle.verify(
    { name: "HMAC" },
    key,
    fromB64url(sigPart),
    encoder.encode(data),
  );
  if (!valid) throw new Error("INVALID_SIGNATURE");

  let claims: any;
  try {
    claims = JSON.parse(Buffer.from(fromB64url(body)).toString("utf8"));
  } catch {
    throw new Error("MALFORMED_TOKEN");
  }

  if (claims.exp < Math.floor(Date.now() / 1000))
    throw new Error("EXPIRED_TOKEN");
  if (!claims.sub || !claims.cid || !claims.iid || !claims.amt)
    throw new Error("INCOMPLETE_TOKEN");
  if (claims.aud !== "checkout") throw new Error("INVALID_AUDIENCE");

  return {
    userId: claims.sub,
    email: claims.email,
    checkoutId: claims.cid,
    invoiceId: claims.iid,
    amount: claims.amt,
  };
}

// ── Error messages ────────────────────────────────────────────────────────────

export function getCheckoutErrorMessage(code: string): string {
  switch (code) {
    case "INVALID_SIGNATURE":
      return "This link has been modified and cannot be trusted. Please return and try again.";
    case "EXPIRED_TOKEN":
      return "This link has expired. Links are only valid for 5 minutes. Please request a fresh one.";
    case "INVALID_AUDIENCE":
      return "This link was not issued for this page.";
    case "MALFORMED_TOKEN":
    case "INCOMPLETE_TOKEN":
      return "This link is corrupted. Please return and try again.";
    default:
      return "This link is invalid. Please return and try again.";
  }
}
