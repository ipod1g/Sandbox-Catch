/// <reference types="vite/client" />

// Vite replaces process.env with the values loaded in vite.config.ts.
declare const process: {
  env: {
    BACKEND_API_URL?: string;
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  };
};
