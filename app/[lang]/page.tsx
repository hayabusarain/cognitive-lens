import { getDictionary } from '@/lib/dictionaries';
import HomeClient from './HomeClient';
import { PRESET_TIER_LISTS } from '@/lib/tier-list-data';
import { PRESET_TIER_LISTS_EN } from '@/lib/tier-list-data-en';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  // Next.js 15ではparamsはPromiseとして渡されるためawaitで解決します
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'ja' | 'en';
  const dict = await getDictionary(lang);
  
  const presets = lang === "en" ? PRESET_TIER_LISTS_EN : PRESET_TIER_LISTS;
  // 最新のランキングデータを取得 (socially_awkward_genius を優先)
  const rankPreset = presets.find(p => p.id === "socially_awkward_genius") || presets[1] || presets[0];
  const rank1Entry = rankPreset.entries[rankPreset.entries.length - 1]; // 1位は最後尾
  
  const latestRank = {
    presetId: rankPreset.id,
    title: rankPreset.title,
    isTop5: rankPreset.videoType === "top5",
    rank1Type: rankPreset.entries[4]?.mbtiType || rank1Entry?.mbtiType,
    rank1Reason: rankPreset.entries[4]?.webAnswer || rank1Entry?.webAnswer || rank1Entry?.comment,
    updatedAt: new Date().toISOString()
  };
  
  return <HomeClient dict={dict} lang={lang} initialLatestRank={latestRank} />;
}
