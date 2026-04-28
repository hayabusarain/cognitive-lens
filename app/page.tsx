import { redirect } from 'next/navigation';

export default function RootPage() {
  // メインサイトを日本語にするため、常に /ja へリダイレクト
  redirect('/ja');
}
