-- Add detailed columns to universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS program_code text UNIQUE,
ADD COLUMN IF NOT EXISTS quota int,
ADD COLUMN IF NOT EXISTS tyt_turkce_net float,
ADD COLUMN IF NOT EXISTS tyt_sosyal_net float,
ADD COLUMN IF NOT EXISTS tyt_mat_net float,
ADD COLUMN IF NOT EXISTS tyt_fen_net float,
ADD COLUMN IF NOT EXISTS ayt_mat_net float,
ADD COLUMN IF NOT EXISTS ayt_fizik_net float,
ADD COLUMN IF NOT EXISTS ayt_kimya_net float,
ADD COLUMN IF NOT EXISTS ayt_biyoloji_net float,
ADD COLUMN IF NOT EXISTS ayt_edebiyat_net float,
ADD COLUMN IF NOT EXISTS ayt_tarih1_net float,
ADD COLUMN IF NOT EXISTS ayt_cografya1_net float;
