-- Plak dit in Supabase, onder SQL Editor, en klik op Run.

create table if not exists public.onbeantwoord (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question text not null,
  reason text not null,
  answer text not null default ''
);

-- Row Level Security aan en bewust geen policies: alleen de server (met de service role key)
-- heeft toegang. De publieke (anon) sleutel kan niets lezen of schrijven.
alter table public.onbeantwoord enable row level security;
