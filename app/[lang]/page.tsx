import { getDictionary } from '@/lib/dictionaries';
import HomeClient from './HomeClient';
import { PRESET_TIER_LISTS } from '@/lib/tier-list-data';
import { PRESET_TIER_LISTS_EN } from '@/lib/tier-list-data-en';
import fs from 'fs';
import path from 'path';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  // Next.js 15ではparamsはPromiseとして渡されるためawaitで解決します
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'ja' | 'en';
  const dict = await getDictionary(lang);
  
  const presets = lang === "en" ? PRESET_TIER_LISTS_EN : PRESET_TIER_LISTS;
  
  // 自動プッシュされた最新の動画データ（latest-rank.json）を優先して読み込む
  let latestRank = null;
  try {
    const jsonPath = path.resolve(process.cwd(), "public", "latest-rank.json");
    if (fs.existsSync(jsonPath)) {
      latestRank = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read latest-rank.json", e);
  }

  // もしファイルがなければ、フォールバックとして一番上のデータを表示
  if (!latestRank) {
    const rankPreset = presets[0];
    const rank1Entry = rankPreset.entries[rankPreset.entries.length - 1]; // 1位は最後尾
    latestRank = {
      presetId: rankPreset.id,
      title: rankPreset.title,
      isTop5: rankPreset.videoType === "top5",
      rank1Type: rankPreset.entries[4]?.mbtiType || rank1Entry?.mbtiType,
      rank1Reason: rankPreset.entries[4]?.webAnswer || rank1Entry?.webAnswer || rank1Entry?.comment,
      updatedAt: new Date().toISOString()
    };
  }
  
  return <HomeClient dict={dict} lang={lang} initialLatestRank={latestRank} />;
}
