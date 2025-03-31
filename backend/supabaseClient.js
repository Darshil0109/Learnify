const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Replace these with your Supabase Project URL and Anon Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey,{
    auth: {
      persistSession: true, // Default: true (stores in localStorage)
      autoRefreshToken: true, // Keeps session alive
    },
  });

module.exports = supabase;

