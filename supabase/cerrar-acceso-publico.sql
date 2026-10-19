-- ════════════════════════════════════════════════════════════════════════════
-- Cerrar el acceso público a la base de datos
--
-- CUÁNDO: solo DESPUÉS de que esté publicada la versión del sitio que hace
-- todo desde el servidor (rama "seguridad"). Si se ejecuta antes, el panel
-- admin viejo deja de funcionar.
--
-- DÓNDE: Supabase → SQL Editor → pegar y ejecutar por partes (1, 2, 3).
--
-- QUÉ HACE: la web ya no usa la clave pública para leer ni escribir datos,
-- así que se le quitan todos los permisos. El servidor usa la clave de
-- servicio, que no se ve afectada por estas reglas.
-- ════════════════════════════════════════════════════════════════════════════


-- ── 1) DIAGNÓSTICO: ver qué permisos hay hoy (no cambia nada) ──────────────
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;


-- ── 2) Tablas: activar protección y quitar todos los permisos públicos ─────
do $$
declare
  t text;
  p record;
begin
  foreach t in array array[
    'presupuesto_solicitudes', 'contacto_submissions', 'cotizacion_vajilla',
    'reviews', 'gallery_items', 'guest_users', 'admin_config'
  ] loop
    if to_regclass('public.' || t) is null then
      raise notice 'La tabla % no existe, se omite', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    for p in select policyname from pg_policies
             where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
      raise notice 'Quitado permiso "%" de %', p.policyname, t;
    end loop;
  end loop;
end $$;


-- ── 3) Fotos (Storage): quitar permisos de subir/borrar en "galeria" ───────
-- Las fotos se siguen viendo porque el bucket es público; lo que se quita es
-- la posibilidad de que cualquiera suba o borre archivos. El panel ahora sube
-- con un permiso firmado por el servidor.
do $$
declare
  p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'storage' and tablename = 'objects'
             and (coalesce(qual, '') ilike '%galeria%' or coalesce(with_check, '') ilike '%galeria%') loop
    execute format('drop policy %I on storage.objects', p.policyname);
    raise notice 'Quitado permiso de storage "%"', p.policyname;
  end loop;
end $$;


-- ── 4) VERIFICACIÓN: debería devolver 0 filas para estas tablas ────────────
select tablename, policyname
from pg_policies
where (schemaname = 'public' and tablename in (
        'presupuesto_solicitudes', 'contacto_submissions', 'cotizacion_vajilla',
        'reviews', 'gallery_items', 'guest_users', 'admin_config'))
   or (schemaname = 'storage' and tablename = 'objects'
       and (coalesce(qual, '') ilike '%galeria%' or coalesce(with_check, '') ilike '%galeria%'));
