import { SignJWT, jwtVerify } from "jose";

export const GUEST_SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 días

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET no configurado");
  return new TextEncoder().encode(s);
}

export type GuestPayload = { guestId: string; username: string; nombre: string; whatsapp: string };

export async function signGuestToken(payload: GuestPayload): Promise<string> {
  return new SignJWT({ ...payload, type: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${GUEST_SESSION_EXPIRY}s`)
    .setIssuedAt()
    .sign(secret());
}

export async function verifyGuestToken(token: string): Promise<GuestPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.type !== "guest") return null;
    return {
      guestId:   payload.guestId   as string,
      username:  payload.username  as string,
      nombre:    payload.nombre    as string,
      whatsapp: (payload.whatsapp  as string) ?? "",
    };
  } catch {
    return null;
  }
}
