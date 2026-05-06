import { NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import archiver from "archiver";

declare global {
  var cachedBundleLocation: string | undefined;
  var bundleVersion: number | undefined;
}

const CURRENT_BUNDLE_VERSION = 19; // Incremented for milder toxic texts

export async function POST(req: Request) {
  try {
    const { preset, presetId, items, groupColor, lang } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "items 配列が必要です" }, { status: 400 });
    }

    // Remotionのエントリーポイント
    const entryPoint = path.resolve(process.cwd(), "remotion/Root.tsx");
    
    // 出力先のディレクトリを確保
    const outDir = path.resolve(process.cwd(), "public", "outputs");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    console.log("バンドルを開始します:", entryPoint);
    
    // Remotionプロジェクトのバンドル
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

    console.log("6枚の画像を生成します...");

    const generatedUrls: string[] = [];

    // 1. タイトル画像の生成
    if (preset.titleSlide) {
      const titleProps = {
        mainTitle: preset.titleSlide.mainTitle,
        subTitle: preset.titleSlide.subTitle,
        groupColor: groupColor,
        lang: lang
      };
      const composition = await selectComposition({
        serveUrl: global.cachedBundleLocation,
        id: "SlideTitleImage",
        inputProps: titleProps,
      });
      const outName = `slide_${presetId}_00_title_${Date.now()}.png`;
      const outPath = path.join(outDir, outName);
      await renderStill({
        composition,
        serveUrl: global.cachedBundleLocation,
        output: outPath,
        inputProps: titleProps,
        imageFormat: "png",
        frame: 0,
      });
      generatedUrls.push(`/outputs/${outName}`);
      console.log(`生成完了 (タイトル):`, outPath);
    }

    // 2. 4キャラクター画像の生成
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const inputProps = {
        mbtiType: item.mbtiType,
        catchphrase: item.catchphrase,
        groupColor: groupColor,
        points: item.points,
        lang: lang
      };

      const composition = await selectComposition({
        serveUrl: global.cachedBundleLocation,
        id: "SingleSlideImage",
        inputProps,
      });

      const outName = `slide_${presetId}_0${i + 1}_${item.mbtiType}_${Date.now()}.png`;
      const outPath = path.join(outDir, outName);

      await renderStill({
        composition,
        serveUrl: global.cachedBundleLocation,
        output: outPath,
        inputProps,
        imageFormat: "png",
        frame: 0,
      });

      generatedUrls.push(`/outputs/${outName}`);
      console.log(`生成完了 (${i + 1}/${items.length}):`, outPath);
    }

    // 3. まとめ画像の生成
    if (preset.summarySlide) {
      const summaryProps = {
        summaryTitle: preset.summarySlide.title,
        groupColor: groupColor,
        items: preset.summarySlide.items,
        lang: lang
      };
      const composition = await selectComposition({
        serveUrl: global.cachedBundleLocation,
        id: "SlideSummaryImage",
        inputProps: summaryProps,
      });
      const outName = `slide_${presetId}_99_summary_${Date.now()}.png`;
      const outPath = path.join(outDir, outName);
      await renderStill({
        composition,
        serveUrl: global.cachedBundleLocation,
        output: outPath,
        inputProps: summaryProps,
        imageFormat: "png",
        frame: 0,
      });
      generatedUrls.push(`/outputs/${outName}`);
      console.log(`生成完了 (まとめ):`, outPath);
    }

    // 4. 生成したすべての画像をZIP化してデスクトップの専用フォルダに直接保存
    console.log("ZIPファイルを作成中...");
    const desktopExportDir = "C:\\Users\\81901\\Desktop\\MBTI_GoogleDrive_Exports";
    if (!fs.existsSync(desktopExportDir)) {
      fs.mkdirSync(desktopExportDir, { recursive: true });
    }
    
    const zipFileName = `${presetId}_${Date.now()}.zip`;
    const zipFilePath = path.join(desktopExportDir, zipFileName);
    
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`ZIP保存完了: ${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn(err);
        } else {
          reject(err);
        }
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // 生成された画像をZIPに追加
      generatedUrls.forEach((url, index) => {
        // url is like `/outputs/slide_crush_purple_00_title_1700000.png`
        const fileName = path.basename(url);
        const filePath = path.join(outDir, fileName);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: fileName });
        }
      });

      archive.finalize();
    });

    return NextResponse.json({
      success: true,
      urls: generatedUrls,
      zipPath: zipFilePath
    });
  } catch (error: any) {
    console.error("Rendering error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
