import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// モジュールロード時点では createClient を呼ばず、
// 初回アクセス時に遅延初期化することでビルド時のクラッシュを防ぐ
let _client: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を .env.local に設定してください。"
    );
  }

  _client = createClient<Database>(url, key);
  return _client;
}

// Proxy でアクセス時に初期化することで、
// SSG/ISR のビルドステップでは createClient が呼ばれない
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return (getClient() as never as Record<string, unknown>)[prop as string];
  },
});
