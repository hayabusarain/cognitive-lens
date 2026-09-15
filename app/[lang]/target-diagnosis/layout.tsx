// ページがクライアントコンポーネントのため、metadata はこのレイアウトから出す
import { canonical } from "@/lib/site";

export const metadata = {
  alternates: canonical("/ja/target-diagnosis"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
