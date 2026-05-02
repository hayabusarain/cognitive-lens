import { NextResponse } from "next/server";
import { YouTubeScraper } from "@/lib/scraper/youtube-scraper";
import { MediaExtractor } from "@/lib/analyzer/media-extractor";
import { WhisperTranscriber } from "@/lib/analyzer/whisper-transcriber";
import { VisionOCR } from "@/lib/analyzer/vision-ocr";
import { ViralStructureExtractor } from "@/lib/ai/viral-structure-extractor";
import { ZGenLocalizer } from "@/lib/ai/z-gen-localizer";
import fs from "fs";
import path from "path";

// Cronジョブや外部からトリガーするためのAPI
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let targetUrl = body.url;
    const keyword = body.keyword;

    const scraper = new YouTubeScraper();

    if (!targetUrl && keyword) {
      console.log(`[Batch] Searching for viral video with keyword: ${keyword}`);
      // ランダム性を持たせるため、多めに検索してランダムに1つ選ぶ
      const urls = await scraper.searchViralShorts(keyword, 10);
      if (urls.length > 0) {
        const randomIndex = Math.floor(Math.random() * urls.length);
        targetUrl = urls[randomIndex];
        console.log(`[Batch] Selected random video (${randomIndex + 1}/${urls.length}): ${targetUrl}`);
      }
    }

    if (!targetUrl) {
      return NextResponse.json({ error: "URL or keyword is required, or no videos found." }, { status: 400 });
    }

    const extractor = new MediaExtractor();
    const transcriber = new WhisperTranscriber();
    const ocr = new VisionOCR();
    const structExtractor = new ViralStructureExtractor();
    const localizer = new ZGenLocalizer();

    console.log(`[Batch] Starting processing for: ${targetUrl}`);

    // 1. Download
    const videoInfo = await scraper.downloadVideo(targetUrl);
    if (!videoInfo) throw new Error("Failed to download video");

    // 2. Extract Audio & Frames
    const { audioPath, framePaths } = await extractor.extractAll(videoInfo.videoFilePath, videoInfo.id);

    // 3. Transcription & OCR
    let transcript = "";
    if (audioPath) transcript = await transcriber.transcribe(audioPath);
    const ocrTexts = await ocr.extractTextFromFrames(framePaths);

    const localizedScript = await localizer.localizeDirectly(transcript, ocrTexts);
    if (!localizedScript) throw new Error("Failed to localize script directly");

    if (localizedScript.status === "skip") {
      console.log(`[Batch] Skipped video ${videoInfo.id} due to: ${localizedScript.reason}`);
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: localizedScript.reason,
        videoId: videoInfo.id,
      });
    }

    // 5. Cleanup temporary files (Optional but recommended)
    try {
      if (audioPath && fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      const frameDir = path.dirname(framePaths[0] || "");
      if (frameDir && fs.existsSync(frameDir)) fs.rmSync(frameDir, { recursive: true, force: true });
    } catch (e) {
      console.warn("Cleanup failed, ignoring:", e);
    }

    return NextResponse.json({
      success: true,
      original_title: videoInfo.title,
      videoId: videoInfo.id,
      script: localizedScript
    });

  } catch (error: any) {
    console.error("[Batch] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
