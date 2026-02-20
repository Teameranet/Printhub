
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration
 * 
 * This file initializes the Supabase client using environment variables.
 * VITE_SUPABASE_URL: Your Supabase project URL
 * VITE_SUPABASE_ANON_KEY: Your Supabase anonymous API key
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client. 
// Uses placeholder values if environment variables are missing to prevent immediate startup errors.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
