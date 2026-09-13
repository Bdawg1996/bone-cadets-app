-- Run this once in Supabase → SQL Editor → New query → paste → Run.
-- Creates the two tables the app uses.

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists entries (
  id uuid primary key,
  kind text not null check (kind in ('income','expense','mileage')),
  date date not null,
  client_id uuid references clients(id) on delete set null,
  label text,
  amount numeric,
  miles numeric,
  created_at timestamptz default now()
);

create index if not exists entries_date_idx on entries(date);
create index if not exists entries_kind_idx on entries(kind);

-- Note: we talk to these tables only from the serverless functions using
-- the service key, so row-level security is left off. The passcode gate
-- in front of the API is what protects your data.
