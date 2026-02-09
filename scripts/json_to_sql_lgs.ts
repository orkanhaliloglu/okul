
import fs from 'fs';
import path from 'path';

// Define Interface
interface HighSchool {
    name: string;
    slug: string;
    city: string;
    district: string;
    type: string;
    education_duration: number;
    language: string;
    quota: number;
    percentile: number;
    score: number;
    admission_type: string;
}

const cleanString = (str: string | undefined) => {
    if (!str) return '';
    return str.replace(/'/g, "''").trim();
};

async function generateSql() {
    const cwd = process.cwd();
    const inputPath = path.join(cwd, 'src/data/high_schools_lgs.json');
    const outputPath = path.join(cwd, 'supabase/seeds/seed_lgs.sql');

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: ${inputPath} not found.`);
        return;
    }

    const data: HighSchool[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    console.log(`Loaded ${data.length} high schools.`);

    // Deduplicate by slug
    const seenSlugs = new Set();
    const uniqueData = data.filter(s => {
        if (seenSlugs.has(s.slug)) return false;
        seenSlugs.add(s.slug);
        return true;
    });

    console.log(`Unique records: ${uniqueData.length}`);

    let sql = `-- Seed data for ${uniqueData.length} LGS High Schools\n`;
    sql += `INSERT INTO public.high_schools (name, slug, city, district, type, education_duration, language, quota, percentile, score, admission_type, created_at)\nVALUES\n`;

    const values = uniqueData.map(s => {
        return `(
            '${cleanString(s.name)}',
            '${cleanString(s.slug)}',
            '${cleanString(s.city)}',
            '${cleanString(s.district)}',
            '${cleanString(s.type)}',
            ${s.education_duration},
            '${cleanString(s.language)}',
            ${s.quota},
            ${s.percentile},
            ${s.score},
            '${cleanString(s.admission_type)}',
            now()
        )`;
    });

    sql += values.join(',\n') + `\nON CONFLICT (slug) DO UPDATE SET 
        score = EXCLUDED.score,
        percentile = EXCLUDED.percentile,
        quota = EXCLUDED.quota,
        type = EXCLUDED.type,
        language = EXCLUDED.language;
    `;

    fs.writeFileSync(outputPath, sql);
    console.log(`Generated SQL at ${outputPath} with ${values.length} records.`);
}

generateSql();
