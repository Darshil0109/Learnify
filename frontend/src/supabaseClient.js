import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,{
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: localStorage,  // Stores tokens in localStorage
    }

  }
);

export default supabase;