
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspect() {
    console.log('Inspecting table structure...');
    const { data, error } = await supabase
        .from('universities')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
    } else {
        console.log('Table is empty, cannot easily infer columns from data. Trying to insert query.');
        // Try an insert to see what fails or just map known common errors
    }
}

inspect();
