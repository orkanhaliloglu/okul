-- 1. Fix RLS Policies to allow inserts
-- Drop existing policies if they conflict (or just add new ones)
drop policy if exists "Allow public read access on universities" on public.universities;
drop policy if exists "Allow public read access on high_schools" on public.high_schools;

-- Create full access policies for public (simpler for now)
create policy "Allow full access on universities"
on public.universities for all
to public
using (true)
with check (true);

create policy "Allow full access on high_schools"
on public.high_schools for all
to public
using (true)
with check (true);

-- 2. Update Table Structure to match JSON data
-- Universities table JSON keys: university, faculty, program, score, rank, type, slug, city...
-- My previous schema might have used snake_case or different names.
-- Let's make sure columns match standard JSON keys or we map them in seed script.
-- Seed script just dumps JSON. So columns must match JSON keys if using simple upsert.
-- JSON Item: { "university": "...", "faculty": "...", "program": "...", "score": 123, "rank": 1, ... }
-- Previous SQL: university_name, program_name...
-- I will alter table to match JSON keys for simplicity in seeding.

alter table public.universities rename column university_name to university;
alter table public.universities rename column program_name to program;
alter table public.universities rename column ranking to rank;
-- score is ok
-- type is ok
-- city is ok
-- slug is ok
-- faculty is ok

-- Add missing columns if any
alter table public.universities add column if not exists score_type text; -- Match JSON "scoreType" or "type" logic? 
-- JSON has "type": "SAY" or "EA". 
-- Actually, the JSON has "type": "SAY" and also "type": "Vakif" (in my manual fix). 
-- Wait, scraping script output: { university, faculty, program, score, rank, type: 'SAY', slug }
-- The scraping script uses 'type' for Score Type (SAY/EA). 
-- But my manual mock data used 'type' for University Type (State/Private).
-- A conflict! 
-- I should standardize.
-- Let's rename 'type' in DB to 'score_type' for clarity, and 'uni_type' for State/Private.
-- But the JSON has 'type': 'SAY'. 
-- So let's add 'score_type' column and I will fix the seed script to map it correctly.

-- High Schools table JSON keys: name, city, district, type, score, percentile, admission_type
-- Previous SQL: name, city, district, type, score, percentile, admission_type. Match seems OK.

-- 3. Verify types
alter table public.universities alter column score type numeric;
alter table public.universities alter column rank type integer;

alter table public.high_schools alter column score type numeric;
alter table public.high_schools alter column percentile type numeric;
