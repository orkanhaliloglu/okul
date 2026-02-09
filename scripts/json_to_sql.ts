
import fs from 'fs';
import path from 'path';

const mapType = (type: string) => {
    if (type.includes('Devlet')) return 'Devlet';
    if (type.includes('Vakıf')) return 'Vakıf';
    if (type.includes('KKTC')) return 'KKTC';
    return 'Diğer';
};

const mapScholarship = (details: string) => {
    if (details.includes('Burslu')) return 'Tam Burslu';
    if (details.includes('%50')) return '%50 İndirimli';
    if (details.includes('%25')) return '%25 İndirimli';
    if (details.includes('Ücretli')) return 'Ücretli';
    return 'Ücretsiz'; // Default for Devlet
};

async function generateSql() {
    const jsonPath = path.join(process.cwd(), 'src/data/universities_say_batch_1.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const universities = JSON.parse(rawData);

    let sql = `-- Seed data for 200 SAY universities\n`;
    sql += `INSERT INTO public.universities (program_code, university_name, faculty, program_name, score, ranking, quota, city, score_type, type, language, scholarship, created_at)\nVALUES\n`;

    const values = universities.map((u: any) => {
        const score = parseFloat(u.score.replace(',', '.')) || 0;
        const rank = parseInt(u.rank.replace('.', '')) || 0;
        const quota = parseInt(u.quota) || 0;

        // Infer fields
        const isEnglish = u.program.includes('(İngilizce)');
        const lang = isEnglish ? 'İngilizce' : 'Türkçe';
        const scholarship = mapScholarship(u.type); // 'type' field in JSON held the full program details string in some scrape logic, let's double check mapping
        // Wait, in my scrape logic:
        // type: row[4] -> This was "Vakıf" or "Devlet" usually.
        // But let's look at a sample: {"type":"Vakıf", "program":"Tıp"} 
        // Ah, the scrape mapping was:
        // type: clean(row[4]) -> "Vakıf"
        // program: clean(row[2]) -> "Tıp"
        // scholarship? It wasn't explicitly scraped in the strict batch.
        // The program name often contains it: "Tıp (İngilizce) (Burslu)"

        const scholarshipDerived = mapScholarship(u.program);
        const typeDerived = u.type;

        return `(
            '${u.code}',
            '${u.university.replace(/'/g, "''")}', 
            '${u.program.includes('Fakülte') ? u.program : ''}', -- Faculty/Program is mixed in some fields, sticking to simple mapping
            '${u.program.replace(/'/g, "''")}',
            ${score},
            ${rank},
            ${quota},
            '${u.city.replace(/'/g, "''")}',
            'SAY',
            '${typeDerived}',
            '${lang}',
            '${scholarshipDerived}',
            now()
        )`;
    });

    sql += values.join(',\n') + `\nON CONFLICT (program_code) DO UPDATE SET 
        score = EXCLUDED.score,
        ranking = EXCLUDED.ranking,
        quota = EXCLUDED.quota;
    `;

    const outPath = path.join(process.cwd(), 'supabase/seeds/seed_say_200.sql');
    fs.writeFileSync(outPath, sql);
    console.log(`Generated SQL at ${outPath}`);
}

generateSql();
