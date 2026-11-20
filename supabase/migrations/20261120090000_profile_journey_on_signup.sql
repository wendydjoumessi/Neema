-- Save the journey chosen in "What brings you to Neema?" when an account is created.
-- Safe to run whether or not the previous migration already included this change.
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
