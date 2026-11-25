-- =========================================================
-- Club DRINKA · base de datos de tarjetas de cliente frecuente
-- Pegar completo en Supabase → SQL Editor → Run
--
-- Seguridad:
--   · Nadie puede leer las tablas directamente (RLS activado, sin políticas).
--   · El cliente solo usa funciones que le devuelven SU tarjeta (con su sesión).
--   · Solo los usuarios en la tabla "admins" (DRINKA) ven todas y ponen sellos.
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- Tablas ----------
create table if not exists public.socios (
  id                  uuid primary key default gen_random_uuid(),
  codigo              text unique not null,
  nombre              text not null check (char_length(nombre) between 2 and 40),
  telefono            text unique not null check (telefono ~ '^593[0-9]{9}$'),
  pin_hash            text not null,
  sellos              int  not null default 0 check (sellos between 0 and 10),
  tarjetas_completas  int  not null default 0,
  intentos            int  not null default 0,
  bloqueado_hasta     timestamptz,
  creado              timestamptz not null default now()
);

create table if not exists public.sesiones (
  token     text primary key,
  socio_id  uuid not null references public.socios(id) on delete cascade,
  expira    timestamptz not null default now() + interval '180 days'
);

create table if not exists public.movimientos (
  id        bigserial primary key,
  socio_id  uuid not null references public.socios(id) on delete cascade,
  tipo      text not null,          -- sello, quitar, canje, pin
  cambio    int  not null default 0,
  admin     uuid,
  fecha     timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.socios      enable row level security;
alter table public.sesiones    enable row level security;
alter table public.movimientos enable row level security;
alter table public.admins      enable row level security;
revoke all on public.socios, public.sesiones, public.movimientos, public.admins from anon, authenticated;

-- ---------- Ayudantes ----------
-- 0991234567 / 991234567 / +593 99 123 4567  →  593991234567
create or replace function public._tel(p text) returns text
language sql immutable set search_path = public as $$
  select case
    when d ~ '^593[0-9]{9}$' then d
    when d ~ '^0[0-9]{9}$'   then '593' || substr(d, 2)
    when d ~ '^[0-9]{9}$'    then '593' || d
    else null end
  from (select regexp_replace(coalesce(p, ''), '\D', '', 'g') as d) t
$$;

create or replace function public._tarjeta(s public.socios) returns json
language sql stable set search_path = public as $$
  select json_build_object(
    'codigo', s.codigo, 'nombre', s.nombre, 'sellos', s.sellos,
    'tarjetas_completas', s.tarjetas_completas, 'creado', s.creado)
$$;

create or replace function public._es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

create or replace function public._nueva_sesion(p_socio uuid) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare t text := encode(gen_random_bytes(32), 'hex');
begin
  delete from public.sesiones where expira < now();
  insert into public.sesiones(token, socio_id) values (t, p_socio);
  return t;
end $$;

-- ---------- Funciones del cliente ----------
create or replace function public.club_registrar(p_nombre text, p_telefono text, p_pin text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare
  tel text := public._tel(p_telefono);
  nom text := btrim(regexp_replace(coalesce(p_nombre, ''), '\s+', ' ', 'g'));
  cod text;
  s   public.socios;
begin
  if char_length(nom) < 2 or char_length(nom) > 40 then return json_build_object('error', 'nombre'); end if;
  if tel is null then return json_build_object('error', 'telefono'); end if;
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then return json_build_object('error', 'pin'); end if;
  if exists (select 1 from public.socios where telefono = tel) then return json_build_object('error', 'ya_existe'); end if;

  loop
    cod := 'DRK-' || lpad((floor(random() * 10000))::int::text, 4, '0');
    exit when not exists (select 1 from public.socios where codigo = cod);
  end loop;

  insert into public.socios(codigo, nombre, telefono, pin_hash)
  values (cod, nom, tel, crypt(p_pin, gen_salt('bf', 8)))
  returning * into s;

  return json_build_object('token', public._nueva_sesion(s.id), 'tarjeta', public._tarjeta(s));
end $$;

create or replace function public.club_entrar(p_telefono text, p_pin text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare
  s public.socios;
begin
  select * into s from public.socios where telefono = public._tel(p_telefono);
  if s.id is null then return json_build_object('error', 'datos'); end if;
  if s.bloqueado_hasta is not null and s.bloqueado_hasta > now() then
    return json_build_object('error', 'bloqueado', 'minutos', ceil(extract(epoch from s.bloqueado_hasta - now()) / 60));
  end if;
  if s.pin_hash <> crypt(coalesce(p_pin, ''), s.pin_hash) then
    -- 5 intentos fallidos → bloqueado 15 minutos (evita que adivinen el PIN)
    update public.socios
       set intentos = case when intentos + 1 >= 5 then 0 else intentos + 1 end,
           bloqueado_hasta = case when intentos + 1 >= 5 then now() + interval '15 minutes' else bloqueado_hasta end
     where id = s.id;
    return json_build_object('error', 'datos');
  end if;
  update public.socios set intentos = 0, bloqueado_hasta = null where id = s.id;
  return json_build_object('token', public._nueva_sesion(s.id), 'tarjeta', public._tarjeta(s));
end $$;

create or replace function public.club_mi_tarjeta(p_token text) returns json
language plpgsql security definer set search_path = public as $$
declare s public.socios;
begin
  select so.* into s from public.sesiones se join public.socios so on so.id = se.socio_id
   where se.token = p_token and se.expira > now();
  if s.id is null then return json_build_object('error', 'sesion'); end if;
  return json_build_object('tarjeta', public._tarjeta(s));
end $$;

create or replace function public.club_salir(p_token text) returns json
language sql security definer set search_path = public as $$
  delete from public.sesiones where token = p_token;
  select json_build_object('ok', true);
$$;

-- ---------- Funciones de DRINKA (solo admins) ----------
create or replace function public.admin_socios(p_buscar text default '') returns json
language plpgsql security definer set search_path = public as $$
declare q text := '%' || coalesce(btrim(p_buscar), '') || '%';
begin
  if not public._es_admin() then return json_build_object('error', 'no_autorizado'); end if;
  return json_build_object('socios', coalesce((
    select json_agg(x order by x.creado desc) from (
      select codigo, nombre, telefono, sellos, tarjetas_completas, creado,
             (bloqueado_hasta is not null and bloqueado_hasta > now()) as bloqueado
        from public.socios
       where nombre ilike q or codigo ilike q or telefono ilike q
       order by creado desc limit 200) x), '[]'::json),
    'total', (select count(*) from public.socios));
end $$;

create or replace function public.admin_sellar(p_codigo text, p_cambio int default 1) returns json
language plpgsql security definer set search_path = public as $$
declare s public.socios;
begin
  if not public._es_admin() then return json_build_object('error', 'no_autorizado'); end if;
  if p_cambio not in (1, -1) then return json_build_object('error', 'cambio'); end if;
  update public.socios set sellos = least(10, greatest(0, sellos + p_cambio))
   where codigo = upper(btrim(p_codigo)) returning * into s;
  if s.id is null then return json_build_object('error', 'no_existe'); end if;
  insert into public.movimientos(socio_id, tipo, cambio, admin)
  values (s.id, case when p_cambio > 0 then 'sello' else 'quitar' end, p_cambio, auth.uid());
  return json_build_object('tarjeta', public._tarjeta(s));
end $$;

-- Al completar los 10 sellos: se canjea el premio y empieza una tarjeta nueva
create or replace function public.admin_canjear(p_codigo text) returns json
language plpgsql security definer set search_path = public as $$
declare s public.socios;
begin
  if not public._es_admin() then return json_build_object('error', 'no_autorizado'); end if;
  update public.socios set sellos = 0, tarjetas_completas = tarjetas_completas + 1
   where codigo = upper(btrim(p_codigo)) and sellos = 10 returning * into s;
  if s.id is null then return json_build_object('error', 'no_completa'); end if;
  insert into public.movimientos(socio_id, tipo, admin) values (s.id, 'canje', auth.uid());
  return json_build_object('tarjeta', public._tarjeta(s));
end $$;

-- Si el cliente olvida su PIN, DRINKA le pone uno nuevo (y se cierran sus sesiones)
create or replace function public.admin_nuevo_pin(p_codigo text, p_pin text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s public.socios;
begin
  if not public._es_admin() then return json_build_object('error', 'no_autorizado'); end if;
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then return json_build_object('error', 'pin'); end if;
  update public.socios set pin_hash = crypt(p_pin, gen_salt('bf', 8)), intentos = 0, bloqueado_hasta = null
   where codigo = upper(btrim(p_codigo)) returning * into s;
  if s.id is null then return json_build_object('error', 'no_existe'); end if;
  delete from public.sesiones where socio_id = s.id;
  insert into public.movimientos(socio_id, tipo, admin) values (s.id, 'pin', auth.uid());
  return json_build_object('ok', true);
end $$;

-- ---------- Permisos ----------
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.club_registrar(text, text, text) to anon, authenticated;
grant execute on function public.club_entrar(text, text)          to anon, authenticated;
grant execute on function public.club_mi_tarjeta(text)            to anon, authenticated;
grant execute on function public.club_salir(text)                 to anon, authenticated;
grant execute on function public.admin_socios(text)               to authenticated;
grant execute on function public.admin_sellar(text, int)          to authenticated;
grant execute on function public.admin_canjear(text)              to authenticated;
grant execute on function public.admin_nuevo_pin(text, text)      to authenticated;

-- =========================================================
-- ÚLTIMO PASO (después de crear tu usuario en Authentication → Users):
-- cambia el correo y ejecuta esta línea sola.
--
-- insert into public.admins(user_id) select id from auth.users where email = 'TU_CORREO@gmail.com';
-- =========================================================
