-- Public read-only access with authenticated, owner-scoped admin writes.
-- Run this migration in the Supabase SQL Editor before enabling viewer mode.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'auction_items',
    'membership_items',
    'spent_items',
    'donation_items',
    'dues_items'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select on table public.%I to anon, authenticated', table_name);
    execute format('revoke insert, update, delete on table public.%I from anon, public', table_name);
    execute format('grant insert, update, delete on table public.%I to authenticated', table_name);

    execute format('drop policy if exists "Public can view %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Admins can insert %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Admins can update %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Admins can delete %s" on public.%I', table_name, table_name);

    execute format('create policy "Public can view %s" on public.%I for select to anon, authenticated using (true)', table_name, table_name);
    execute format('create policy "Admins can insert %s" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', table_name, table_name);
    execute format('create policy "Admins can update %s" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', table_name, table_name);
    execute format('create policy "Admins can delete %s" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', table_name, table_name);
  end loop;
end $$;
