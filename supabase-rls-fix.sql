-- Run this in Supabase SQL Editor to fix RLS policies
-- Drop existing policies first
drop policy if exists "users_own" on pf_users;
drop policy if exists "barcodes_own" on pf_barcodes;
drop policy if exists "owned_own" on pf_owned;
drop policy if exists "prices_own" on pf_prices;
drop policy if exists "custom_paints_own" on pf_custom_paints;
drop policy if exists "tools_own" on pf_tools;
drop policy if exists "consumables_own" on pf_consumables;
drop policy if exists "shop_items_own" on pf_shop_items;
drop policy if exists "projects_own" on pf_projects;

-- Allow all operations via anon key (data is separated by user_id in app)
create policy "allow_all" on pf_users for all to anon using (true) with check (true);
create policy "allow_all" on pf_barcodes for all to anon using (true) with check (true);
create policy "allow_all" on pf_owned for all to anon using (true) with check (true);
create policy "allow_all" on pf_prices for all to anon using (true) with check (true);
create policy "allow_all" on pf_custom_paints for all to anon using (true) with check (true);
create policy "allow_all" on pf_tools for all to anon using (true) with check (true);
create policy "allow_all" on pf_consumables for all to anon using (true) with check (true);
create policy "allow_all" on pf_shop_items for all to anon using (true) with check (true);
create policy "allow_all" on pf_projects for all to anon using (true) with check (true);
