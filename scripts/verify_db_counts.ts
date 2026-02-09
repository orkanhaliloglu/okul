
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
    console.log('Verifying database counts...');

    const { count: totalCount, error: totalError } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true });

    if (totalError) {
        console.error('Error counting total:', totalError.message);
    } else {
        console.log(`Total universities in DB: ${totalCount}`);
    }

    const { count: sayCount, error: sayError } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true })
        .eq('score_type', 'SAY');

    if (sayError) {
        console.error('Error counting SAY:', sayError.message);
    } else {
        console.log(`SAY programs in DB: ${sayCount}`);
    }

    const { count: eaCount, error: eaError } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true })
        .eq('score_type', 'EA');

    if (eaError) {
        console.error('Error counting EA:', eaError.message);
    } else {
        console.log(`EA programs in DB: ${eaCount}`);
    }

    const { count: hsCount, error: hsError } = await supabase
        .from('high_schools')
        .select('*', { count: 'exact', head: true });

    if (hsError) {
        console.error('Error counting High Schools:', hsError.message);
    } else {
        console.log(`LGS High Schools in DB: ${hsCount}`);
    }
}

verify();
