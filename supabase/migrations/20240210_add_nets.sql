
-- Add columns for YÖK Atlas data
alter table public.universities add column if not exists program_code text; -- Remove unique constraint if it causes issues, or keep it if strictly 1:1
alter table public.universities add column if not exists tyt_turkce_net numeric;
alter table public.universities add column if not exists tyt_mat_net numeric;
alter table public.universities add column if not exists tyt_sosyal_net numeric;
alter table public.universities add column if not exists tyt_fen_net numeric;
alter table public.universities add column if not exists ayt_mat_net numeric;
alter table public.universities add column if not exists ayt_fizik_net numeric;
alter table public.universities add column if not exists ayt_kimya_net numeric;
alter table public.universities add column if not exists ayt_biyoloji_net numeric;
alter table public.universities add column if not exists ayt_edebiyat_net numeric;
alter table public.universities add column if not exists ayt_tarih1_net numeric;
alter table public.universities add column if not exists ayt_cografya1_net numeric;

-- Ensure unique constraint on program_code for upserting
alter table public.universities drop constraint if exists universities_program_code_key;
alter table public.universities add constraint universities_program_code_key unique (program_code);
