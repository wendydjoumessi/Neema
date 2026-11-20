-- Emergency contacts: the people a mother chooses to call or alert from SOS.
-- Kept in their own table so a future SMS service can send alerts to them.
create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  relationship text not null default '' check (char_length(relationship) <= 40),
  -- International format, e.g. +237677123456
  phone text not null check (phone ~ '^\+[0-9]{8,15}$'),
  alert_by_sms boolean not null default true,
  position smallint not null default 0 check (position between 0 and 9),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index emergency_contacts_user_id_idx on public.emergency_contacts (user_id, position);

create trigger emergency_contacts_set_updated_at
  before update on public.emergency_contacts
  for each row execute function public.set_updated_at();

-- At most 5 contacts per person.
create or replace function public.limit_emergency_contacts()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.emergency_contacts where user_id = new.user_id) >= 5 then
    raise exception 'You can save up to 5 emergency contacts.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger emergency_contacts_limit
  before insert on public.emergency_contacts
  for each row execute function public.limit_emergency_contacts();

alter table public.emergency_contacts enable row level security;

create policy "Own emergency contacts: read" on public.emergency_contacts for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own emergency contacts: add" on public.emergency_contacts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own emergency contacts: update" on public.emergency_contacts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own emergency contacts: delete" on public.emergency_contacts for delete to authenticated using ((select auth.uid()) = user_id);
