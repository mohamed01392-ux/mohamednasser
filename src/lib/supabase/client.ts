import { createBrowserClient } from "@supabase/ssr";

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      !url.includes("your-project-id") &&
      !key.includes("your-supabase-publishable")
  );
};

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  return createBrowserClient(url, key);
};
