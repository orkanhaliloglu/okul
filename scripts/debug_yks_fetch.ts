
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugFetch() {
    console.log("Debugging YKS Fetch...");

    // Simulate the frontend query
    /*
    query = supabase.from('universities').select('*');
    // ... filters ...
    query = query.order('score', { ascending: false }).limit(2000);
    */

    let query = supabase.from('universities').select('*');
    query = query.order('score', { ascending: false }).limit(2000);

    const { data, error } = await query;

    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Fetched ${data?.length} records.`);
        if (data && data.length > 0) {
            console.log("Sample record:", data[0].university, data[0].program);
        }
    }
}

debugFetch();
