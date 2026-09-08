import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Recupera le variabili d'ambiente per Supabase.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
    throw new Error("SUPABASE_URL non trovato. Controlla il file backend/.env.");
}

if (!supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY non trovata. Controlla il file backend/.env.");
}

export const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    },
);