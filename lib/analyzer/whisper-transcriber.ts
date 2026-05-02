import fs from "fs";
import OpenAI from "openai";

export class WhisperTranscriber {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * MP3ファイルから音声を文字起こしする
   */
  async transcribe(audioPath: string): Promise<string> {
    if (!fs.existsSync(audioPath)) {
      console.warn(`Audio file not found: ${audioPath}`);
      return "";
    }

    try {
      console.log(`Transcribing audio: ${audioPath}...`);
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-1",
        // The language will be auto-detected, but usually it's english for global viral shorts
      });

      return response.text;
    } catch (error) {
      console.error("Error in transcription:", error);
      return "";
    }
  }
}
