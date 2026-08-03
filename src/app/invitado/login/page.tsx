"use client";

import { useActionState } from "react";
import { loginGuestAction } from "@/app/actions/guest-auth";

export default function GuestLoginPage() {
  const [state, action, pending] = useActionState(loginGuestAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080808" }}>
      <div className="w-full max-w-sm px-6">

        <div className="mb-10 text-center">
          <p className="text-gold/70 text-[10px] tracking-[0.6em] uppercase mb-3">
            Catering Profesional
          </p>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-display, serif)" }}>
            Acceso de Colaborador
          </h1>
          <p className="text-white/30 text-xs mt-2">
            Ingresá con las credenciales que te proporcionaron
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Usuario"
            autoComplete="username"
            required
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
          />

          {state?.error && (
            <p className="text-red-400 text-xs text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50 mt-2"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}
