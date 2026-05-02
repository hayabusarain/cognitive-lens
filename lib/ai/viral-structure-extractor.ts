import OpenAI from "openai";

export interface ViralStructure {
  theme: string;
  hook: string;
  body: string[];
  punchline: string;
}

export class ViralStructureExtractor {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 文字起こしとOCRテキストから動画の「バズ構造」をリバースエンジニアリングする
   */
  async extractStructure(transcript: string, ocrTexts: string[]): Promise<ViralStructure | null> {
    console.log("Extracting viral structure...");
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert viral video analyst. Your job is to reverse-engineer a viral MBTI/Psychology short video based on its audio transcript and on-screen text.
Extract the core narrative structure:
1. Theme (What is this video about? e.g. "INFP when someone cancels plans")
2. Hook (The first 3 seconds that grab attention)
3. Body (The main points or progression of the joke/scenario)
4. Punchline (The twist, joke, or relatable ending)

Output strictly in JSON format matching this schema:
{
  "theme": "string",
  "hook": "string",
  "body": ["string", "string", ...],
  "punchline": "string"
}`
          },
          {
            role: "user",
            content: `Audio Transcript:\n${transcript}\n\nOn-Screen Text:\n${ocrTexts.join('\n')}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(content) as ViralStructure;
      
      return parsed;
    } catch (error) {
      console.error("Error extracting viral structure:", error);
      return null;
    }
  }
}
