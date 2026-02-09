
import fs from 'fs';
import path from 'path';

// Define the structure based on the scraped data
interface University {
    code: string;
    university: string;
    program: string;
    city: string;
    type: string;
    quota?: string;
    rank?: string;
    score?: string; // SAY structure uses 'score'
    order2025?: string; // EA structure uses these
    order2024?: string; // Added to fix type error
    score2025?: string;
    score2024?: string;
    detail?: string;
    generalInfo?: string;
    faculty?: string;
}

const mapType = (type: string) => {
    const t = type || '';
    if (t.includes('Devlet')) return 'Devlet';
    if (t.includes('Vakıf')) return 'Vakıf';
    if (t.includes('KKTC')) return 'KKTC';
    if (t.includes('Kıbrıs')) return 'KKTC';
    return 'Diğer';
};

const mapScholarship = (u: University) => {
    // Combine detail, program, and type to find scholarship info
    const fullText = (u.detail || '') + ' ' + (u.program || '') + ' ' + (u.type || '') + ' ' + (u.generalInfo || '');
    if (fullText.includes('Tam Burslu') || fullText.includes('(Burslu)')) return 'Tam Burslu';
    if (fullText.includes('%50')) return '%50 İndirimli';
    if (fullText.includes('%25')) return '%25 İndirimli';
    if (fullText.includes('Ücretli')) return 'Ücretli';
    if (mapType(u.type || u.generalInfo || '') === 'Devlet') return 'Ücretsiz';
    return 'Ücretsiz';
};

const cleanString = (str: string | undefined) => {
    if (!str) return '';
    return str.replace(/'/g, "''").trim();
};

const parseScore = (str: string | undefined) => {
    if (!str) return 0;
    if (str === '---') return 0;
    // Handle "527,81326" -> 527.81326
    return parseFloat(str.replace(',', '.')) || 0;
};

const parseRank = (str: string | undefined) => {
    if (!str) return 0;
    if (str === '---') return 0;
    // Handle "30.125" -> 30125
    return parseInt(str.replace(/\./g, '')) || 0;
};

async function generateSql() {
    const cwd = process.cwd();
    const loadJson = (filename: string, optional: boolean = false) => {
        const filePath = path.join(cwd, 'src/data', filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
        if (optional) return [];
        console.warn(`Warning: ${filename} not found.`);
        return [];
    };

    const sayBatch1 = loadJson('universities_say_batch_1.json');
    const sayBatch2 = loadJson('universities_say_batch_2.json');
    const sayBatch2Part2 = loadJson('universities_say_batch_2_part_2.json');
    const eaBatch1 = loadJson('universities_ea_batch_1.json');
    const eaBatchNew = loadJson('universities_ea_batch_new.json', true); // true = optional (if file doesn't exist yet)

    const allDataRaw = [
        ...sayBatch1.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...sayBatch2.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...sayBatch2Part2.map((u: any) => ({ ...u, score_type: 'SAY' })),
        ...eaBatch1.map((u: any) => ({ ...u, score_type: 'EA' })),
        ...eaBatchNew.map((u: any) => ({ ...u, score_type: 'EA' })),
    ];

    // Deduplicate based on 'code'
    const seenCodes = new Set();
    const allData = allDataRaw.filter(u => {
        if (seenCodes.has(u.code)) {
            return false;
        }
        seenCodes.add(u.code);
        return true;
    });

    console.log(`Total records: ${allDataRaw.length}, Unique records: ${allData.length}`);

    let sql = `-- Seed data for ${allData.length} universities (SAY + EA)\n`;
    sql += `INSERT INTO public.universities (program_code, university, faculty, program, score, rank, quota, city, score_type, type, language, scholarship, slug, created_at)\nVALUES\n`;

    const values = allData.map((u: University & { score_type: string }) => {
        const scoreVal = u.score2024 ? parseScore(u.score2024) : parseScore(u.score);
        // For rank, EA uses 'order2024' (success order), SAY uses 'rank'
        const rankVal = u.order2024 ? parseRank(u.order2024) : parseRank(u.rank);
        const quotaVal = parseInt(u.quota || '0') || 0;

        const isEnglish = (u.program + (u.detail || '')).includes('İngilizce') || (u.program + (u.detail || '')).includes('(Eng)');
        const isFrench = (u.program + (u.detail || '')).includes('Fransızca');
        const isGerman = (u.program + (u.detail || '')).includes('Almanca');

        let language = 'Türkçe';
        if (isEnglish) language = 'İngilizce';
        if (isFrench) language = 'Fransızca';
        if (isGerman) language = 'Almanca';

        const scholarship = mapScholarship(u);
        const typeDerived = mapType(u.type || u.generalInfo || ''); // EA has 'generalInfo' with type

        // Extract city from generalInfo if city is missing (EA structure)
        // General info string: "İSTANBUL Vakıf Burslu Örgün"
        let city = u.city;
        if (!city && u.generalInfo) {
            city = u.generalInfo.split(' ')[0];
        }

        // Generate Slug
        const slug = `${cleanString(u.university)}-${cleanString(u.program)}-${u.code}`.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-').replace(/^-|-$/g, '');

        return `(
            '${u.code}',
            '${cleanString(u.university)}', 
            '${cleanString(u.faculty)}',
            '${cleanString(u.program)}',
            ${scoreVal},
            ${rankVal},
            ${quotaVal},
            '${cleanString(city)}',
            '${u.score_type}',
            '${typeDerived}',
            '${language}',
            '${scholarship}',
            '${slug}',
            now()
        )`;
    });

    sql += values.join(',\n') + `\nON CONFLICT (program_code) DO UPDATE SET 
        score = EXCLUDED.score,
        rank = EXCLUDED.rank,
        quota = EXCLUDED.quota,
        scholarship = EXCLUDED.scholarship,
        type = EXCLUDED.type;
    `;

    const outPath = path.join(cwd, 'supabase/seeds/seed_all_800.sql');
    fs.writeFileSync(outPath, sql);
    console.log(`Generated SQL at ${outPath} with ${values.length} records.`);
}

generateSql();
