-- Add financial-year isolation to all active dashboard tables.
-- Existing records belong to 2025; new records default to the calendar year.

begin;

alter table public.auction_items add column if not exists year smallint;
alter table public.membership_items add column if not exists year smallint;
alter table public.spent_items add column if not exists year smallint;
alter table public.donation_items add column if not exists year smallint;
alter table public.dues_items add column if not exists year smallint;

update public.auction_items set year = 2025 where year is null;
update public.membership_items set year = 2025 where year is null;
update public.spent_items set year = 2025 where year is null;
update public.donation_items set year = 2025 where year is null;
update public.dues_items set year = 2025 where year is null;

alter table public.auction_items alter column year set default (extract(year from current_date))::smallint, alter column year set not null;
alter table public.membership_items alter column year set default (extract(year from current_date))::smallint, alter column year set not null;
alter table public.spent_items alter column year set default (extract(year from current_date))::smallint, alter column year set not null;
alter table public.donation_items alter column year set default (extract(year from current_date))::smallint, alter column year set not null;
alter table public.dues_items alter column year set default (extract(year from current_date))::smallint, alter column year set not null;

do $$
declare table_name text;
begin
  foreach table_name in array array['auction_items','membership_items','spent_items','donation_items','dues_items']
  loop
    if not exists (
      select 1 from pg_constraint
      where conname = table_name || '_year_valid'
        and conrelid = ('public.' || table_name)::regclass
    ) then
      execute format(
        'alter table public.%I add constraint %I check (year between 2000 and 2100)',
        table_name,
        table_name || '_year_valid'
      );
    end if;
  end loop;
end $$;

create index if not exists auction_items_user_year_created_idx on public.auction_items (user_id, year, created_at desc);
create index if not exists membership_items_user_year_created_idx on public.membership_items (user_id, year, created_at desc);
create index if not exists spent_items_user_year_created_idx on public.spent_items (user_id, year, created_at desc);
create index if not exists donation_items_user_year_created_idx on public.donation_items (user_id, year, created_at desc);
create index if not exists dues_items_user_year_created_idx on public.dues_items (user_id, year, created_at desc);

commit;
