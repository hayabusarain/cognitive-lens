import { getDictionary } from '@/lib/dictionaries';
import HomeClient from './HomeClient';
import { canonical } from '@/lib/site';

export const metadata = {
  alternates: canonical('/ja'),
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  // Next.js 15ではparamsはPromiseとして渡されるためawaitで解決します
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'ja' | 'en';
  const dict = await getDictionary(lang);
  
  return <HomeClient dict={dict} lang={lang} />;
}
