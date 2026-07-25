"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const boundAction = resetPasswordAction.bind(null, token);
  const [state, formAction, pending] = useActionState(boundAction, null);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center p-8">
          <p className="text-red-400 text-sm mb-4">Link inválido o expirado.</p>
          <a href="/admin/login" className="text-gold text-xs tracking-widest uppercase hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex flex-col gap-6 w-full max-w-sm p-8 border border-white/10">

        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Nueva contraseña</span>
          <h1 className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "var(--font-display, serif)" }}>
            Catering Profesional
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña (mín. 8 caracteres)"
            autoComplete="new-password"
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
          />
          <input
            type="password"
            name="confirm"
            placeholder="Repetir nueva contraseña"
            autoComplete="new-password"
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
          />
          {state?.error && (
            <p className="text-red-400 text-xs">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Establecer contraseña"}
          </button>
        </form>

        <a href="/admin/login" className="text-white/25 hover:text-white/50 text-xs text-center transition-colors">
          Volver al inicio
        </a>

      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetContent />
    </Suspense>
  );
}
