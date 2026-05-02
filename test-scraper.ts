import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { YouTubeScraper } from "./lib/scraper/youtube-scraper";
import { MediaExtractor } from "./lib/analyzer/media-extractor";
import { WhisperTranscriber } from "./lib/analyzer/whisper-transcriber";
import { VisionOCR } from "./lib/analyzer/vision-ocr";
import { ViralStructureExtractor } from "./lib/ai/viral-structure-extractor";
import { ZGenLocalizer } from "./lib/ai/z-gen-localizer";

async function main() {
  console.log("=== Starting Viral Pipeline Test ===");

  const scraper = new YouTubeScraper();
  const extractor = new MediaExtractor();
  const transcriber = new WhisperTranscriber();
  const ocr = new VisionOCR();
  const structExtractor = new ViralStructureExtractor();
  const localizer = new ZGenLocalizer();

  // 1. Target a specific viral MBTI short
  const urls = await scraper.searchViralShorts("MBTI", 1);
  if (urls.length === 0) {
    console.error("No viral shorts found.");
    return;
  }
  const targetUrl = urls[0];
  console.log(`Target video: ${targetUrl}`);

  // 2. Download
  const videoInfo = await scraper.downloadVideo(targetUrl);
  if (!videoInfo) {
    console.error("Failed to download video.");
    return;
  }
  console.log(`Downloaded: ${videoInfo.title}`);

  // 3. Extract Audio and Frames
  const { audioPath, framePaths } = await extractor.extractAll(videoInfo.videoFilePath, videoInfo.id);
  
  // 4. Transcribe Audio
  let transcript = "";
  if (audioPath) {
    transcript = await transcriber.transcribe(audioPath);
    console.log(`Transcript: ${transcript}`);
  }

  // 5. OCR Frames
  const ocrTexts = await ocr.extractTextFromFrames(framePaths);
  console.log(`OCR Texts:`, ocrTexts);

  // 6. Extract Structure
  const structure = await structExtractor.extractStructure(transcript, ocrTexts);
  if (!structure) {
    console.error("Failed to extract structure.");
    return;
  }
  console.log("Extracted Structure:", JSON.stringify(structure, null, 2));

  // 7. Localize to Script
  const script = await localizer.localizeToScript(structure);
  if (!script) {
    console.error("Failed to localize script.");
    return;
  }
  console.log("=== FINAL GENERATED SCRIPT ===");
  console.log(JSON.stringify(script, null, 2));
}

main().catch(console.error);
