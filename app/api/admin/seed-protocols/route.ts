import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PROTOCOLS_JA } from "@/lib/protocols-ja";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase credentials not found" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 既存のデータをすべて削除
    const { error: delError } = await supabase.from("protocols").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delError) {
      return NextResponse.json({ error: "Failed to delete old protocols", details: delError }, { status: 500 });
    }

    const inserts = [];
    for (const [mbti, categories] of Object.entries(PROTOCOLS_JA)) {
      const ngWords = categories["NG_WORDS"] || [];
      for (const [category, texts] of Object.entries(categories)) {
        if (category === "NG_WORDS") continue;
        for (const text of texts) {
          inserts.push({
            target_type: mbti,
            category: category,
            content: text,
            ng_words: ngWords
          });
        }
      }
    }

    // 新しいデータを挿入
    const { error: insError } = await supabase.from("protocols").insert(inserts);
    if (insError) {
      return NextResponse.json({ error: "Failed to insert new protocols", details: insError }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Successfully updated ${inserts.length} protocols.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
