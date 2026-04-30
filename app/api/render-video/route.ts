import { NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

declare global {
  var cachedBundleLocation: string | undefined;
  var bundleVersion: number | undefined;
}

const CURRENT_BUNDLE_VERSION = 5;

let lastRenderTime = 0;

export async function POST(req: Request) {
  try {
    const now = Date.now();
    if (now - lastRenderTime < 10000) {
      return NextResponse.json(
        { error: "【スパム防止】動画の作成は10秒間に1回までです。少し待機してから再度お試しください。" },
        { status: 429 }
      );
    }
    lastRenderTime = now;

    const body = await req.json();
    const { inputProps, compositionId = "TierListVideo", presetId } = body;

    if (!inputProps) {
      return NextResponse.json({ error: "inputProps が必要です" }, { status: 400 });
    }
    
    if (compositionId !== "AestheticPOVVideo" && !inputProps.entries) {
      return NextResponse.json({ error: "inputProps.entries が必要です" }, { status: 400 });
    }

    // Remotionのエントリーポイント（Root.tsx）
    const entryPoint = path.resolve(process.cwd(), "remotion/Root.tsx");
    
    // 出力先のディレクトリを確保
    const outDir = path.resolve(process.cwd(), "public", "outputs");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // トップページ連動用データの保存
    if (presetId && inputProps.entries && inputProps.entries.length > 0) {
      const isTop5 = compositionId === "Top5RankingVideo";
      const rank1Entry = isTop5 ? inputProps.entries[inputProps.entries.length - 1] : null;
      
      const latestRankData = {
        presetId,
        title: inputProps.title,
        isTop5,
        rank1Type: rank1Entry ? rank1Entry.mbtiType : null,
        rank1Reason: rank1Entry ? rank1Entry.webAnswer : null,
        updatedAt: new Date().toISOString()
      };
      const jsonPath = path.resolve(process.cwd(), "public", "latest-rank.json");
      fs.writeFileSync(jsonPath, JSON.stringify(latestRankData, null, 2), "utf-8");

      // 手間ゼロ！：生成と同時に自動でGitHubへプッシュし、Vercelの本番環境を自動更新（再デプロイ）させる
      if (process.env.NODE_ENV === "development") {
        exec('git add public/latest-rank.json && git commit -m "Auto: Update latest video for website banner" && git push', (error, stdout, stderr) => {
          if (error) {
            console.error("Git auto-push failed:", error);
          } else {
            console.log("Git auto-push successful! Vercel rebuild triggered.");
          }
        });
      }
    }

    // ファイル名の生成
    const outName = `tierlist_${Date.now()}.mp4`;
    const outPath = path.join(outDir, outName);

    console.log("バンドルを開始します:", entryPoint);
    
    // Remotionプロジェクトのバンドル（バージョンが変わった場合は破棄）
    if (global.bundleVersion !== CURRENT_BUNDLE_VERSION) {
      global.cachedBundleLocation = undefined;
      global.bundleVersion = CURRENT_BUNDLE_VERSION;
    }
    
    if (!global.cachedBundleLocation) {
      global.cachedBundleLocation = await bundle({
        entryPoint,
      });
    } else {
      console.log("キャッシュされたバンドルを使用します");
    }

    console.log("コンポジションを選択します...");
    
    const composition = await selectComposition({
      serveUrl: global.cachedBundleLocation,
      id: compositionId,
      inputProps,
    });

    console.log("レンダリングを開始します。この処理には数十秒かかります...", outPath);

    // バックグラウンドでレンダリングを実行
    await renderMedia({
      composition,
      serveUrl: global.cachedBundleLocation,
      codec: "h264",
      outputLocation: outPath,
      inputProps,
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log("レンダリング完了！:", outPath);

    return NextResponse.json({
      success: true,
      url: `/outputs/${outName}`,
    });
  } catch (error: any) {
    console.error("Rendering error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
