
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const universitiesSayPath = path.join(process.cwd(), 'src', 'data', 'universities_say.json');
    const universitiesEaPath = path.join(process.cwd(), 'src', 'data', 'universities_ea.json');

    const detailsSayPath = path.join(process.cwd(), 'src', 'data', 'details_say.json');
    const detailsEaPath = path.join(process.cwd(), 'src', 'data', 'details_ea.json');

    let universitiesSayData: any[] = [];
    let universitiesEaData: any[] = [];
    let detailsSayData: any[] = [];
    let detailsEaData: any[] = [];

    try {
        universitiesSayData = JSON.parse(fs.readFileSync(universitiesSayPath, 'utf-8'));
        console.log(`Read ${universitiesSayData.length} SAY universities.`);
    } catch (e) { console.log('No SAY universities found or error reading universities_say.json'); }

    try {
        universitiesEaData = JSON.parse(fs.readFileSync(universitiesEaPath, 'utf-8'));
        console.log(`Read ${universitiesEaData.length} EA universities.`);
    } catch (e) { console.log('No EA universities found or error reading universities_ea.json'); }

    try {
        detailsSayData = JSON.parse(fs.readFileSync(detailsSayPath, 'utf-8'));
        console.log(`Read ${detailsSayData.length} SAY details.`);
    } catch (e) { console.log('No SAY details found or error reading details_say.json'); }

    try {
        detailsEaData = JSON.parse(fs.readFileSync(detailsEaPath, 'utf-8'));
        console.log(`Read ${detailsEaData.length} EA details.`);
    } catch (e) { console.log('No EA details found or error reading details_ea.json'); }

    const allUniversities = [...universitiesSayData, ...universitiesEaData];
    const allDetails = [...detailsSayData, ...detailsEaData];

    if (allUniversities.length > 0) {
        console.log(`Read ${allUniversities.length} universities total.`);
        console.log(`Read ${allDetails.length} details total.`);

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

            // Find details if available
            const detail = allDetails.find((d: any) => d.id === item.program_code);

            // Normalize fields
            const newItem = {
                slug: item.slug || `${university}-${program}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                university: university,
                faculty: item.faculty || '',
                program: program,
                program_code: item.program_code || null,
                score: typeof item.score === 'number' ? item.score : parseFloat(item.score || '0'),
                rank: typeof item.rank === 'number' ? item.rank : parseInt(item.rank || '0'),
                score_type: item.scoreType || item.type || 'SAY', // Default or map
                city: item.city || city, // Prioritize item.city if available, otherwise use inferred
                type: item.uni_type || uniType, // Prioritize item.uni_type if available, otherwise use inferred

                // Detailed fields
                quota: detail ? detail.quota : null,
                tyt_turkce_net: detail?.tyt?.turkce || null,
                tyt_sosyal_net: detail?.tyt?.sosyal || null,
                tyt_mat_net: detail?.tyt?.matematik || null,
                tyt_fen_net: detail?.tyt?.fen || null,
                ayt_mat_net: detail?.ayt?.matematik || null,
                ayt_fizik_net: detail?.ayt?.fizik || null,
                ayt_kimya_net: detail?.ayt?.kimya || null,
                ayt_biyoloji_net: detail?.ayt?.biyoloji || null,
                ayt_edebiyat_net: detail?.ayt?.edebiyat || null,
                ayt_tarih1_net: detail?.ayt?.tarih1 || null,
                ayt_cografya1_net: detail?.ayt?.cografya1 || null
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
