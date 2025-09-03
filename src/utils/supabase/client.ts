import { createBrowserClient } from '@supabase/ssr';

// Export the function to create a Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, https://ejmubqnsnibbmwbslcab.supabase.co
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXVicW5zbmliYm13YnNsY2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTU5NDgsImV4cCI6MjA3MDk3MTk0OH0.sDThBWXtjVZodqoRxqy4Qnufx_BCTOrR9e7HFrz1oZc
  );
}

// Export a default client instance
export const supabase = createClient();