import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import util from "util";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

const execFileAsync = util.promisify(execFile);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URLが必要です" }, { status: 400 });
    }

    const outDir = path.resolve(process.cwd(), "public", "downloads");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const ytDlpPath = path.resolve(process.cwd(), "yt-dlp.exe");
    if (!fs.existsSync(ytDlpPath)) {
      return NextResponse.json({ error: "yt-dlp.exeが見つかりません。サーバー管理者に連絡してください。" }, { status: 500 });
    }

    // Get info first to create a safe filename
    const { stdout: infoJson } = await execFileAsync(ytDlpPath, [
      url,
      "--dump-json",
      "--no-warnings"
    ]);

    const info = JSON.parse(infoJson);
    const safeTitle = (info.title || `video_${Date.now()}`).replace(/[\\/:*?"<>|]/g, "_");
    const filename = `${safeTitle}.mp4`;
    const outPath = path.join(outDir, filename);

    // Download the video
    await execFileAsync(ytDlpPath, [
      url,
      "-o", outPath,
      "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      "--ffmpeg-location", ffmpegPath.path,
      "--no-warnings"
    ]);

    return NextResponse.json({ 
      success: true, 
      downloadUrl: `/downloads/${encodeURIComponent(filename)}`,
      filename,
      message: `${safeTitle} の保存が完了しました`
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
