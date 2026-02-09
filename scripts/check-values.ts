
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkValues() {
    const { data, error } = await supabase
        .from('high_schools')
        .select('admission_type')
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log("Sample admission_types:", data.map(d => d.admission_type));

    const { data: distinct } = await supabase
        .from('high_schools')
        .select('admission_type');

    // Manual distinct since Supabase JS doesn't have .distinct() easily without RPC
    const unique = [...new Set(distinct?.map((d: any) => d.admission_type))];
    console.log("Unique admission_types:", unique);
}

checkValues();
