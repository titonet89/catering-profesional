import { headers } from "next/headers";

// ─── Escapar texto del usuario antes de meterlo en HTML (emails) ────────────

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Validaciones simples ───────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email);
}

/** Recorta un texto del usuario a un largo máximo razonable. */
export function clip(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

// ─── Límite de intentos por IP ──────────────────────────────────────────────
// Best effort: vive en la memoria de cada instancia de Vercel, así que frena
// abusos desde una misma IP pero no es una garantía global. Para un límite
// estricto, sumar una regla de Rate Limiting en el Firewall de Vercel.

const buckets = new Map<string, number[]>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconocida"
  );
}

/**
 * Devuelve true si la acción está permitida y registra el intento.
 * @param key     nombre de la acción (ej. "login-admin")
 * @param limit   intentos permitidos dentro de la ventana
 * @param windowMs duración de la ventana en milisegundos
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const id  = `${key}:${await clientIp()}`;
  const now = Date.now();
  const hits = (buckets.get(id) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(id, hits);
    return false;
  }

  hits.push(now);
  buckets.set(id, hits);

  // Limpieza ocasional para que el mapa no crezca indefinidamente
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}
