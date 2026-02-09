-- Create Universities Table
create table public.universities (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  university_name text not null,
  faculty text,
  program_name text not null,
  score numeric, -- YKS Base Score
  ranking integer, -- Success Ranking
  quota integer,
  city text,
  score_type text, -- SAY, EA, SOZ, DIL
  type text, -- Devlet, Vakif, KKTC
  language text,
  scholarship text, -- Tam Burslu, %50 vs.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create High Schools Table
create table public.high_schools (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  name text not null,
  type text, -- Fen, Anadolu, Imam Hatip...
  city text,
  district text,
  score numeric, -- LGS Score
  percentile numeric, -- Yuzdelik Dilim
  quota integer,
  education_duration integer,
  language text,
  admission_type text, -- LGS, OBP
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.universities enable row level security;
alter table public.high_schools enable row level security;

-- Create Policy to allow public read access
create policy "Allow public read access on universities"
on public.universities for select
to public
using (true);

create policy "Allow public read access on high_schools"
on public.high_schools for select
to public
using (true);
