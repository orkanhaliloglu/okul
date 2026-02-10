
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Checking high_schools...");
    const { data: hs, error: hsError } = await supabase.from('high_schools').select('*').limit(1);
    if (hsError) console.error(hsError);
    else if (hs && hs.length > 0) {
        console.log("High School Keys:", Object.keys(hs[0]));
    } else {
        console.log("No high schools found.");
    }

    console.log("Checking universities...");
    const { data: uni, error: uniError } = await supabase.from('universities').select('*').limit(1);
    if (uniError) console.error(uniError);
    else if (uni && uni.length > 0) {
        console.log("University Keys:", Object.keys(uni[0]));
    } else {
        console.log("No universities found.");
    }
}

check();
