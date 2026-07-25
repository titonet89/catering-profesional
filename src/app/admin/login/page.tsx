"use client";

import { useActionState, useState } from "react";
import { loginAction, forgotPasswordAction } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, null);
  const [forgotState, setForgotState] = useState<{ error?: string; ok?: boolean } | null>(null);
  const [forgotPending, setForgotPending] = useState(false);
  const searchParams = useSearchParams();

  const resetOk  = searchParams.get("reset") === "ok";
  const forgotSent = searchParams.get("forgot") === "sent";

  async function handleForgot() {
    setForgotPending(true);
    const result = await forgotPasswordAction();
    setForgotState(result);
    setForgotPending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex flex-col gap-6 w-full max-w-sm p-8 border border-white/10">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Panel Admin</span>
          <h1 className="text-white text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-display, serif)" }}>
            Catering Profesional
          </h1>
        </div>

        {/* Mensajes de estado */}
        {resetOk && (
          <p className="text-emerald-400 text-xs text-center border border-emerald-400/20 py-2 px-3">
            Contraseña restablecida correctamente. Podés ingresar.
          </p>
        )}
        {forgotSent && (
          <p className="text-emerald-400 text-xs text-center border border-emerald-400/20 py-2 px-3">
            Revisá tu email — te enviamos el link para restablecer tu contraseña.
          </p>
        )}

        {/* Formulario de login */}
        <form action={loginFormAction} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
          />
          {loginState?.error && (
            <p className="text-red-400 text-xs">{loginState.error}</p>
          )}
          <button
            type="submit"
            disabled={loginPending}
            className="py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loginPending ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        {/* Olvidé mi contraseña */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleForgot}
            disabled={forgotPending || forgotState?.ok === true}
            className="text-white/30 hover:text-white/60 text-xs transition-colors disabled:opacity-40"
          >
            {forgotPending
              ? "Enviando..."
              : forgotState?.ok
              ? "Email enviado ✓"
              : "Olvidé mi contraseña"}
          </button>
          {forgotState?.error && (
            <p className="text-red-400 text-xs text-center">{forgotState.error}</p>
          )}
          {forgotState?.ok && (
            <p className="text-emerald-400 text-xs text-center">
              Revisá tu casilla: cateringprofesionaljujuy@gmail.com
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
