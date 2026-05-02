import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import ytdlp from "yt-dlp-exec";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

const execAsync = promisify(exec);

export interface ScrapedVideoInfo {
  id: string;
  url: string;
  title: string;
  description: string;
  viewCount: number;
  duration: number;
  videoFilePath: string;
}

export class YouTubeScraper {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), "public", "downloads");
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * キーワードから最新のバズShorts動画のURLリストを取得する（キャッシュ付き）
   */
  async searchViralShorts(keyword: string, maxResults: number = 3): Promise<string[]> {
    const cachePath = path.join(this.outputDir, "search-cache.json");
    let cache: Record<string, string[]> = {};

    // 1. キャッシュの読み込み
    if (fs.existsSync(cachePath)) {
      try {
        cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
        if (cache[keyword] && cache[keyword].length > 0) {
          console.log(`[Cache Hit] Found ${cache[keyword].length} cached URLs for keyword: ${keyword}`);
          return cache[keyword];
        }
      } catch (e) {
        console.error("Cache read error:", e);
      }
    }

    console.log(`Searching for viral shorts with keyword: ${keyword} (This may take a while...)`);
    try {
      // 検索（重い処理）
      const output = await ytdlp(`ytsearch${maxResults * 2}:${keyword}`, {
        dumpSingleJson: true,
      });

      const urls: string[] = [];
      const data = output as any;
      if (data && data.entries && Array.isArray(data.entries)) {
        for (const entry of data.entries) {
          if (entry.webpage_url) {
            urls.push(entry.webpage_url);
            if (urls.length >= maxResults) break;
          }
        }
      } else if (data && data.webpage_url) {
        urls.push(data.webpage_url);
      }

      // 2. キャッシュに保存
      if (urls.length > 0) {
        cache[keyword] = urls;
        fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
        console.log(`[Cache Saved] Saved ${urls.length} URLs for keyword: ${keyword}`);
      }

      return urls;
    } catch (error) {
      console.error("Error searching videos:", error);
      return [];
    }
  }

  /**
   * 指定したURLの動画をダウンロードし、メタデータを取得する
   */
  async downloadVideo(url: string): Promise<ScrapedVideoInfo | null> {
    console.log(`Downloading video from URL: ${url}`);
    try {
      // 情報を取得
      const info = await ytdlp(url, { dumpJson: true });
      const videoInfo = typeof info === 'string' ? JSON.parse(info) : info;
      
      const videoId = videoInfo.id;
      const outputPath = path.join(this.outputDir, `${videoId}.mp4`);

      // 既にダウンロード済みの場合はスキップ
      if (!fs.existsSync(outputPath)) {
        await ytdlp(url, {
          output: outputPath,
          format: "bestvideo[ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/best[ext=mp4][vcodec^=avc1]/best",
          mergeOutputFormat: "mp4",
          jsRuntimes: "node",
          ffmpegLocation: ffmpegPath.path,
        } as any);
      }

      return {
        id: videoId,
        url: videoInfo.webpage_url,
        title: videoInfo.title,
        description: videoInfo.description || "",
        viewCount: videoInfo.view_count || 0,
        duration: videoInfo.duration || 0,
        videoFilePath: outputPath,
      };
    } catch (error) {
      console.error(`Error downloading video ${url}:`, error);
      return null;
    }
  }
}
