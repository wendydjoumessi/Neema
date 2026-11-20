create type public.neema_role as enum ('mother', 'partner');
create type public.neema_journey as enum ('ttc', 'preg', 'pp', 'avoid');
create type public.pregnancy_status as enum ('active', 'born', 'loss', 'ended');
create type public.data_request_kind as enum ('export', 'delete');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  role public.neema_role not null default 'mother',
  phone text check (phone is null or phone ~ '^\+?[0-9 ]{6,20}$'),
  city text check (city is null or char_length(city) <= 120),
  language text not null default 'en' check (language in ('en', 'fr')),
  journey public.neema_journey not null default 'preg',
  faith text check (faith in ('christian', 'muslim', 'none')),
  discreet_mode boolean not null default false,
  consent_version text,
  consent_terms_at timestamptz,
  consent_health_data_at timestamptz,
  consent_sms boolean not null default false,
  consent_partner_sharing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per Neema account: name, role, preferences and consent.';

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, journey)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    case when new.raw_user_meta_data ->> 'role' = 'partner' then 'partner'::public.neema_role
         else 'mother'::public.neema_role end,
    case when new.raw_user_meta_data ->> 'journey' in ('ttc', 'preg', 'pp', 'avoid')
         then (new.raw_user_meta_data ->> 'journey')::public.neema_journey
         else 'preg'::public.neema_journey end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.medical_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  date_of_birth date check (date_of_birth is null or date_of_birth between date '1950-01-01' and current_date),
  blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),
  genotype text check (genotype in ('AA', 'AS', 'SS', 'AC', 'SC', 'unknown')),
  previous_pregnancies smallint check (previous_pregnancies between 0 and 20),
  previous_births smallint check (previous_births between 0 and 20),
  previous_caesarean boolean,
  conditions text[] not null default '{}',
  allergies text check (allergies is null or char_length(allergies) <= 500),
  current_medicines text check (current_medicines is null or char_length(current_medicines) <= 500),
  facility_name text check (facility_name is null or char_length(facility_name) <= 160),
  updated_at timestamptz not null default now()
);

comment on table public.medical_profiles is 'Optional health background. Sensitive: owner access only.';

grant select, insert, update, delete on public.medical_profiles to authenticated;
grant all on public.medical_profiles to service_role;

create trigger medical_profiles_updated_at
  before update on public.medical_profiles
  for each row execute function public.set_updated_at();

create table public.pregnancies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  last_period_date date,
  gestational_weeks_at_entry smallint check (gestational_weeks_at_entry between 1 and 42),
  entered_on date not null default current_date,
  due_date date not null,
  doctor_due_date date,
  baby_nickname text check (baby_nickname is null or char_length(baby_nickname) <= 60),
  status public.pregnancy_status not null default 'active',
  outcome_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.pregnancies is 'A mother''s pregnancies. At most one is active at a time.';

grant select, insert, update, delete on public.pregnancies to authenticated;
grant all on public.pregnancies to service_role;

create unique index pregnancies_one_active_per_user on public.pregnancies (user_id) where status = 'active';
create index pregnancies_user_id_idx on public.pregnancies (user_id);

create trigger pregnancies_updated_at
  before update on public.pregnancies
  for each row execute function public.set_updated_at();

create table public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object' and pg_column_size(state) < 65536),
  updated_at timestamptz not null default now()
);

comment on table public.app_state is 'Small per-user app settings and progress (checklists, habits, cycle).';

grant select, insert, update on public.app_state to authenticated;
grant all on public.app_state to service_role;

create trigger app_state_updated_at
  before update on public.app_state
  for each row execute function public.set_updated_at();

create table public.data_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.data_request_kind not null,
  status text not null default 'received' check (status in ('received', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

grant select, insert on public.data_requests to authenticated;
grant all on public.data_requests to service_role;

create index data_requests_user_id_idx on public.data_requests (user_id);

alter table public.profiles enable row level security;
alter table public.medical_profiles enable row level security;
alter table public.pregnancies enable row level security;
alter table public.app_state enable row level security;
alter table public.data_requests enable row level security;

create policy "Own profile: read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile: update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Own medical profile: read" on public.medical_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own medical profile: add" on public.medical_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own medical profile: update" on public.medical_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own medical profile: delete" on public.medical_profiles for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Own pregnancies: read" on public.pregnancies for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own pregnancies: add" on public.pregnancies for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own pregnancies: update" on public.pregnancies for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own pregnancies: delete" on public.pregnancies for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Own app state: read" on public.app_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own app state: add" on public.app_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own app state: update" on public.app_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Own data requests: read" on public.data_requests for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own data requests: add" on public.data_requests for insert to authenticated with check ((select auth.uid()) = user_id and status = 'received');

create or replace function public.keep_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and coalesce((select auth.role()), '') <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger profiles_keep_role
  before update on public.profiles
  for each row execute function public.keep_profile_role();