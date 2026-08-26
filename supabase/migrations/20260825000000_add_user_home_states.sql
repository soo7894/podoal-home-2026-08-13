create table if not exists public.user_home_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  schema_version smallint not null default 1,
  updated_at timestamptz not null default now(),
  constraint user_home_states_state_object check (jsonb_typeof(state) = 'object'),
  constraint user_home_states_schema_version check (schema_version = 1),
  constraint user_home_states_state_version check (state ->> 'v' = '1'),
  constraint user_home_states_state_size check (octet_length(state::text) <= 1000000)
);

alter table public.user_home_states enable row level security;

revoke all on table public.user_home_states from anon;
grant select, insert, update, delete on table public.user_home_states to authenticated;

drop policy if exists "users can read own home state" on public.user_home_states;
create policy "users can read own home state"
on public.user_home_states for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can insert own home state" on public.user_home_states;
create policy "users can insert own home state"
on public.user_home_states for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update own home state" on public.user_home_states;
create policy "users can update own home state"
on public.user_home_states for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete own home state" on public.user_home_states;
create policy "users can delete own home state"
on public.user_home_states for delete
to authenticated
using ((select auth.uid()) = user_id);
