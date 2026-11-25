-- Where she lives: used to suggest local foods and exercise that fits the climate.
alter table public.profiles
  add column if not exists country text not null default 'Cameroon' check (char_length(country) between 1 and 60),
  add column if not exists region text check (region is null or char_length(region) <= 60);

-- In Cameroon, the region must be one of the 10 regions.
alter table public.profiles drop constraint if exists profiles_region_cameroon;
alter table public.profiles add constraint profiles_region_cameroon check (
  country <> 'Cameroon' or region is null or region in (
    'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'North-West', 'South', 'South-West', 'West'
  )
);

-- Save name, role, journey and location from sign-up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_country text := left(nullif(btrim(meta ->> 'country'), ''), 60);
  v_region text := left(nullif(btrim(meta ->> 'region'), ''), 60);
begin
  if coalesce(v_country, 'Cameroon') = 'Cameroon' and v_region is not null and v_region not in (
    'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'North-West', 'South', 'South-West', 'West'
  ) then
    v_region := null;
  end if;

  insert into public.profiles (id, full_name, role, journey, country, region, city)
  values (
    new.id,
    left(coalesce(meta ->> 'full_name', ''), 120),
    case when meta ->> 'role' = 'partner' then 'partner'::public.neema_role else 'mother'::public.neema_role end,
    case when meta ->> 'journey' in ('ttc', 'preg', 'pp', 'avoid') then (meta ->> 'journey')::public.neema_journey
         else 'preg'::public.neema_journey end,
    coalesce(v_country, 'Cameroon'),
    v_region,
    left(nullif(btrim(meta ->> 'city'), ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
