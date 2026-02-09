
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loadJson = (filename: string) => {
    const p = path.join(process.cwd(), 'src/data', filename);
    if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
    console.warn(`File not found: ${filename}`);
    return [];
};

const mapType = (type: string) => {
    const t = type || '';
    if (t.includes('Devlet')) return 'Devlet';
    if (t.includes('Vakıf')) return 'Vakıf';
    if (t.includes('KKTC')) return 'KKTC';
    if (t.includes('Kıbrıs')) return 'KKTC';
    return 'Diğer';
};

const mapScholarship = (u: any) => {
    const fullText = (u.detail || '') + ' ' + (u.program || '') + ' ' + (u.type || '') + ' ' + (u.generalInfo || '');
    if (fullText.includes('Tam Burslu') || fullText.includes('(Burslu)')) return 'Tam Burslu';
    if (fullText.includes('%50')) return '%50 İndirimli';
    if (fullText.includes('%25')) return '%25 İndirimli';
    if (fullText.includes('Ücretli')) return 'Ücretli';
    if (mapType(u.type || u.generalInfo || '') === 'Devlet') return 'Ücretsiz';
    return 'Ücretsiz';
};

const parseScore = (str: string | undefined) => {
    if (!str || str === '---') return 0;
    return parseFloat(str.replace(',', '.')) || 0;
};

const parseRank = (str: string | undefined) => {
    if (!str || str === '---') return 0;
    return parseInt(str.replace(/\./g, '')) || 0;
};

const clean = (str: string) => str ? str.trim() : '';

async function seed() {
    console.log('Starting seed process...');

    const say1 = loadJson('universities_say_batch_1.json');
    const say2 = loadJson('universities_say_batch_2.json');
    const say3 = loadJson('universities_say_batch_2_part_2.json');
    const ea1 = loadJson('universities_ea_batch_1.json');

    const allData = [
        ...say1.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...say2.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...say3.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...ea1.map((u: any) => ({ ...u, score_type: 'EA' }))
    ];

    console.log(`Loaded ${allData.length} records.`);

    // Map to DB schema
    const rows = allData.map((u: any) => {
        const scoreVal = u.score2024 ? parseScore(u.score2024) : parseScore(u.score);
        const rankVal = u.order2024 ? parseRank(u.order2024) : parseRank(u.rank);
        const quotaVal = parseInt(u.quota || '0') || 0;

        const detailStr = (u.program || '') + (u.detail || '');
        let language = 'Türkçe';
        if (detailStr.includes('İngilizce') || detailStr.includes('(Eng)')) language = 'İngilizce';
        if (detailStr.includes('Fransızca')) language = 'Fransızca';
        if (detailStr.includes('Almanca')) language = 'Almanca';

        let city = u.city;
        if (!city && u.generalInfo) city = u.generalInfo.split(' ')[0];

        return {
            program_code: u.code,
            university: clean(u.university),
            faculty: clean(u.faculty),
            program: clean(u.program),
            score: scoreVal,
            rank: rankVal,
            quota: quotaVal,
            city: clean(city),
            score_type: u.score_type,
            type: mapType(u.type || u.generalInfo),
            language: language,
            scholarship: mapScholarship(u),
            // Ensure unique slug if needed, but schema might not enforce it strictly if we rely on ID. 
            // Better to let specific logic handle slug or generate a random/derived one if table requires it.
            // The table schema has 'slug text not null unique'. We MUST generate one.
            slug: `${clean(u.university)}-${clean(u.program)}-${u.code}`.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-').replace(/^-|-$/g, '')
        };
    });

    // Bulk insert in chunks
    const CHUNK_SIZE = 100;
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase.from('universities').upsert(chunk, { onConflict: 'program_code' });

        if (error) {
            console.error(`Error upserting chunk ${i}-${i + CHUNK_SIZE}:`, error.message);
        } else {
            console.log(`Upserted rows ${i} to ${i + chunk.length}`);
        }
    }

    console.log('Seeding complete.');
}

seed();
