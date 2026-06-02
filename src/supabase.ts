// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://srbrabovxplcefujcyve.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_se9V04nZEVnyIiGmQUsIQQ_FaZHbn3c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)