
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting seed process...");

    // --- 1. Seed High Schools ---
    const highSchoolsPath = path.join(process.cwd(), 'src', 'data', 'high-schools.json');
    if (fs.existsSync(highSchoolsPath)) {
        try {
            const rawData = JSON.parse(fs.readFileSync(highSchoolsPath, 'utf-8'));
            console.log(`Read ${rawData.length} high schools.`);

            // Deduplicate by slug
            const uniqueSchoolsMap = new Map();
            rawData.forEach((item: any) => {
                if (item.slug) uniqueSchoolsMap.set(item.slug, item);
            });
            const uniqueSchools = Array.from(uniqueSchoolsMap.values());
            console.log(`Deduced to ${uniqueSchools.length} unique high schools.`);

            // Batch insert
            const batchSize = 100;
            for (let i = 0; i < uniqueSchools.length; i += batchSize) {
                const batch = uniqueSchools.slice(i, i + batchSize);
                const { error, count } = await supabase.from('high_schools').upsert(batch, { onConflict: 'slug', ignoreDuplicates: false });
                if (error) {
                    console.error(`Error inserting High Schools batch ${i}:`, error.message);
                } else {
                    console.log(`Inserted/Updated High Schools batch ${i}-${i + batch.length}`);
                }
            }
        } catch (e) {
            console.error("Error processing high schools:", e);
        }
    } else {
        console.log("high-schools.json not found.");
    }

    // --- 2. Seed Universities ---
    const files = ['universities_say.json', 'universities_ea.json'];
    const allUniversities: any[] = [];

    for (const file of files) {
        const filePath = path.join(process.cwd(), 'src', 'data', file);
        if (fs.existsSync(filePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                allUniversities.push(...data);
            } catch (e) {
                console.error(`Error reading ${file}:`, e);
            }
        }
    }

    if (allUniversities.length > 0) {
        console.log(`Read ${allUniversities.length} universities total.`);

        // Known Vakıf Universities for type inference
        const vakifUniversities = [
            'KOÇ', 'SABANCI', 'İHSAN DOĞRAMACI BİLKENT', 'ÖZYEĞİN', 'YEDİTEPE',
            'BAHÇEŞEHİR', 'İSTANBUL MEDİPOL', 'TOBB EKONOMİ', 'BAŞKENT',
            'İSTANBUL AYDIN', 'KTO KARATAY', 'İSTİNYE', 'BEZM-İ ÂLEM',
            'İSTANBUL OKAN', 'İSTANBUL NİŞANTAŞI', 'ALTINBAŞ', 'İBN HALDUN',
            'İSTANBUL BİLGİ', 'İZMİR EKONOMİ', 'KADİR HAS', 'TÜRK HAVA KURUMU',
            'ATILIM', 'ACIBADEM'
        ];

        // Map and Validate
        const validUniversities: any[] = [];
        allUniversities.forEach((item: any) => {
            const university = item.university || item.universityName || 'Bilinmiyor';
            const program = item.program || item.programName || item.name;

            if (!program) return;

            // Infer Type
            let uniType = 'Devlet';
            const upperUni = university.toUpperCase();
            if (vakifUniversities.some(v => upperUni.includes(v))) {
                uniType = 'Vakıf';
            }

            // Infer City
            let city = 'İstanbul'; // Default
            if (upperUni.includes('ANKARA') || upperUni.includes('HACETTEPE') || upperUni.includes('ODTÜ') || upperUni.includes('ORTA DOĞU') || upperUni.includes('GAZİ') || upperUni.includes('BİLKENT') || upperUni.includes('TOBB') || upperUni.includes('BAŞKENT') || upperUni.includes('TÜRK HAVA')) {
                city = 'Ankara';
            } else if (upperUni.includes('İZMİR') || upperUni.includes('EGE') || upperUni.includes('DOKUZ EYLÜL')) {
                city = 'İzmir';
            } else if (upperUni.includes('ESKİŞEHİR') || upperUni.includes('ANADOLU')) {
                city = 'Eskişehir';
            }

            // Normalize fields
            const newItem = {
                slug: item.slug || `${university}-${program}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                university: university,
                faculty: item.faculty || '',
                program: program,
                score: typeof item.score === 'number' ? item.score : parseFloat(item.score || '0'),
                rank: typeof item.rank === 'number' ? item.rank : parseInt(item.rank || '0'),
                score_type: item.type || item.scoreType || 'SAY',
                city: city,
                type: uniType
            };

            validUniversities.push(newItem);
        });

        // Deduplicate
        const uniqueUniMap = new Map();
        validUniversities.forEach(item => {
            uniqueUniMap.set(item.slug, item);
        });
        const uniqueUniversities = Array.from(uniqueUniMap.values());
        console.log(`Deduced to ${uniqueUniversities.length} unique universities.`);

        // Batch insert
        const batchSize = 100;
        for (let i = 0; i < uniqueUniversities.length; i += batchSize) {
            const batch = uniqueUniversities.slice(i, i + batchSize);
            const { error } = await supabase.from('universities').upsert(batch, { onConflict: 'slug', ignoreDuplicates: false });
            if (error) {
                console.error(`Error inserting Universities batch ${i}:`, error.message);
            } else {
                console.log(`Inserted/Updated Universities batch ${i}-${i + batch.length}`);
            }
        }
    } else {
        console.log("No university data found in JSON files.");
    }

    console.log("Seed process completed.");
}

seed();
