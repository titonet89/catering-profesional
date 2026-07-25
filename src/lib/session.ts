import { SignJWT, jwtVerify } from "jose";

export const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 días en segundos
export const RESET_EXPIRY   = 60 * 15;           // 15 minutos en segundos

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET no configurado");
  return new TextEncoder().encode(s);
}

export async function signSessionToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_EXPIRY}s`)
    .setIssuedAt()
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function signResetToken(): Promise<string> {
  return new SignJWT({ type: "reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${RESET_EXPIRY}s`)
    .setIssuedAt()
    .sign(secret());
}

export async function verifyResetToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.type === "reset";
  } catch {
    return false;
  }
}
