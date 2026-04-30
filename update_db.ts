import { createClient } from "@supabase/supabase-js";
import { PROTOCOLS_JA } from "./lib/protocols-ja";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Starting DB update for protocols...");

  for (const [mbti, categories] of Object.entries(PROTOCOLS_JA)) {
    for (const [category, texts] of Object.entries(categories)) {
      if (category === "NG_WORDS") {
        // NG words are array of strings
        // We will just skip them if they are stored differently, or update them.
        // Actually, let's just delete all and insert everything.
      }
    }
  }

  // Let's just wipe and re-insert everything.
  const { error: delError } = await supabase.from("protocols").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) {
    console.error("Error deleting old protocols:", delError);
    return;
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

  const { error: insError } = await supabase.from("protocols").insert(inserts);
  if (insError) {
    console.error("Error inserting new protocols:", insError);
  } else {
    console.log(`Successfully inserted ${inserts.length} protocols.`);
  }
}

main().catch(console.error);
