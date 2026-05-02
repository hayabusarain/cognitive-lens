import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface ExtractedMedia {
  audioPath: string | null;
  framePaths: string[];
}

export class MediaExtractor {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), ".tmp", "extracted");
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 動画ファイルから音声(MP3)を抽出する
   */
  async extractAudio(videoPath: string, videoId: string): Promise<string | null> {
    const audioPath = path.join(this.outputDir, `${videoId}.mp3`);
    
    // 既に存在する場合は再利用
    if (fs.existsSync(audioPath)) {
      return audioPath;
    }

    return new Promise((resolve, reject) => {
      console.log(`Extracting audio from ${videoPath}...`);
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("libmp3lame")
        .audioChannels(1)
        .audioBitrate(128)
        .save(audioPath)
        .on("end", () => {
          console.log(`Audio extracted: ${audioPath}`);
          resolve(audioPath);
        })
        .on("error", (err) => {
          console.error("Error extracting audio:", err);
          resolve(null); // 音声がない動画の可能性もある
        });
    });
  }

  /**
   * 動画ファイルから定期的にフレーム(JPEG)を抽出する
   * デフォルト: 2秒に1枚
   */
  async extractFrames(videoPath: string, videoId: string, fps: string = "1/2"): Promise<string[]> {
    const frameDir = path.join(this.outputDir, videoId);
    
    if (!fs.existsSync(frameDir)) {
      fs.mkdirSync(frameDir, { recursive: true });
    }

    // 既に抽出済みの場合はファイルリストを返す
    const existingFiles = fs.readdirSync(frameDir).filter(f => f.endsWith(".jpg"));
    if (existingFiles.length > 0) {
      return existingFiles.map(f => path.join(frameDir, f)).sort();
    }

    return new Promise((resolve, reject) => {
      console.log(`Extracting frames from ${videoPath}...`);
      ffmpeg(videoPath)
        .outputOptions([`-vf fps=${fps}`])
        .save(path.join(frameDir, "frame-%03d.jpg"))
        .on("end", () => {
          const files = fs.readdirSync(frameDir)
            .filter(f => f.endsWith(".jpg"))
            .map(f => path.join(frameDir, f))
            .sort();
          console.log(`Extracted ${files.length} frames.`);
          resolve(files);
        })
        .on("error", (err) => {
          console.error("Error extracting frames:", err);
          resolve([]);
        });
    });
  }

  /**
   * 音声と画像を一括抽出
   */
  async extractAll(videoPath: string, videoId: string): Promise<ExtractedMedia> {
    const [audioPath, framePaths] = await Promise.all([
      this.extractAudio(videoPath, videoId),
      this.extractFrames(videoPath, videoId)
    ]);

    return { audioPath, framePaths };
  }
}
