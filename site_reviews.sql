-- Create the site_reviews table
create table public.site_reviews (
  id uuid not null default gen_random_uuid (),
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  is_approved boolean not null default true,
  created_at timestamp with time zone not null default now(),
  constraint site_reviews_pkey primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.site_reviews enable row level security;

-- Allow anyone (anon) to insert reviews
create policy "Enable insert for everyone" on public.site_reviews
  for insert with check (true);

-- Allow anyone to read approved reviews
create policy "Enable read access for approved reviews" on public.site_reviews
  for select using (is_approved = true);
