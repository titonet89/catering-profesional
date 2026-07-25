"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  signSessionToken,
  signResetToken,
  verifyResetToken,
  verifySessionToken,
  SESSION_EXPIRY,
} from "@/lib/session";

const SITE_URL = "https://catering-profesional.vercel.app";

// ─── Helpers Supabase ───────────────────────────────────────────────────────

async function getPasswordHash(): Promise<string | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("admin_config")
    .select("value")
    .eq("key", "password_hash")
    .single();
  return data?.value ?? null;
}

async function setPasswordHash(hash: string) {
  const db = supabaseAdmin();
  await db.from("admin_config").upsert({
    key: "password_hash",
    value: hash,
    updated_at: new Date().toISOString(),
  });
}

// ─── Cookie de sesión ───────────────────────────────────────────────────────

async function setSessionCookie() {
  const token = await signSessionToken();
  const jar   = await cookies();
  jar.set("admin_session", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   SESSION_EXPIRY,
    path:     "/",
  });
}

// ─── Verificar sesión activa ────────────────────────────────────────────────

export async function getSession(): Promise<boolean> {
  const jar   = await cookies();
  const token = jar.get("admin_session")?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

// ─── Login ──────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = (formData.get("password") as string) ?? "";
  if (!password) return { error: "Ingresá tu contraseña" };

  const hash = await getPasswordHash();
  if (!hash) return { error: "Error de configuración. Contactá al soporte." };

  const valid = await bcrypt.compare(password, hash);
  if (!valid) return { error: "Contraseña incorrecta" };

  await setSessionCookie();
  redirect("/admin");
}

// ─── Logout ─────────────────────────────────────────────────────────────────

export async function logoutAction() {
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
}

// ─── Olvidé mi contraseña ───────────────────────────────────────────────────

export async function forgotPasswordAction(): Promise<{ error?: string; ok?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("pegá")) {
    return { error: "El servicio de email no está configurado aún." };
  }

  const token    = await signResetToken();
  const resetUrl = `${SITE_URL}/admin/reset?token=${token}`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from:    "Catering Profesional <onboarding@resend.dev>",
    to:      "cateringprofesionaljujuy@gmail.com",
    subject: "Restablecer contraseña — Panel Admin",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:40px;">
        <p style="color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Panel Admin</p>
        <h1 style="color:#fff;font-size:22px;">Catering Profesional</h1>
        <p style="color:#ccc;line-height:1.6;">Recibiste este email porque solicitaste restablecer tu contraseña.</p>
        <p style="color:#ccc;line-height:1.6;">
          Hacé clic en el siguiente link para crear una nueva contraseña
          (válido por <strong style="color:#fff;">15 minutos</strong>):
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:20px 0;background:#C9A84C;color:#111;padding:14px 28px;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
          Restablecer contraseña
        </a>
        <p style="color:#555;font-size:12px;margin-top:30px;">
          Si no solicitaste este cambio, ignorá este email. La contraseña no se modificará.
        </p>
      </div>
    `,
  });

  if (error) return { error: "No se pudo enviar el email. Intentá de nuevo." };
  return { ok: true };
}

// ─── Restablecer contraseña (desde link de email) ───────────────────────────

export async function resetPasswordAction(
  token: string,
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const newPwd = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (newPwd.length < 8)
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  if (newPwd !== confirm)
    return { error: "Las contraseñas no coinciden" };

  const valid = await verifyResetToken(token);
  if (!valid)
    return { error: "El link expiró o es inválido. Solicitá uno nuevo." };

  const hash = await bcrypt.hash(newPwd, 12);
  await setPasswordHash(hash);

  redirect("/admin/login?reset=ok");
}

// ─── Cambiar contraseña (desde panel admin) ─────────────────────────────────

export async function changePasswordAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const currentPwd = (formData.get("current") as string) ?? "";
  const newPwd     = (formData.get("new") as string) ?? "";
  const confirm    = (formData.get("confirm") as string) ?? "";

  if (newPwd.length < 8)
    return { error: "La contraseña nueva debe tener al menos 8 caracteres" };
  if (newPwd !== confirm)
    return { error: "Las contraseñas no coinciden" };

  const hash = await getPasswordHash();
  if (!hash) return { error: "Error de configuración." };

  const valid = await bcrypt.compare(currentPwd, hash);
  if (!valid) return { error: "La contraseña actual es incorrecta" };

  const newHash = await bcrypt.hash(newPwd, 12);
  await setPasswordHash(newHash);

  return { success: "Contraseña actualizada correctamente" };
}
