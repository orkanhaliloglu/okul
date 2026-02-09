
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials in .env.local");
    process.exit(1);
}

console.log("Connecting to:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // Check High Schools
    const { count: hsCount, error: hsError } = await supabase
        .from('high_schools')
        .select('*', { count: 'exact', head: true });

    if (hsError) console.error("High Schools Error:", hsError);
    else console.log("High Schools Count:", hsCount);

    // Check Universities
    const { count: uCount, error: uError } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true });

    if (uError) console.error("Universities Error:", uError);
    else console.log("Universities Count:", uCount);

    // Try to fetch one row to verify Read access
    const { data: sample, error: sampleError } = await supabase
        .from('high_schools')
        .select('name')
        .limit(1);

    if (sampleError) console.error("Sample Fetch Error:", sampleError);
    else console.log("Sample Row:", sample);
}

check();
