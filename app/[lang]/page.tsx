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
  
  return <HomeClient dict={dict} lang={lang} />;
}
