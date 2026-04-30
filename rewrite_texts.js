const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rewriteInstructions = `
あなたはZ世代向けのMBTI診断アプリの天才ライターです。
以下のテキストは、MBTIの診断結果としてユーザーに提示されるアドバイスや指摘です。
現在、一人称を「お前」から「あなた」に変更しただけの状態になっており、語尾が「〜しろ」「〜だぞ」「〜やめろ」など命令形のままで、人格がブレていて非常に不自然（サイコパス風）です。

これを、**「全てを見透かしているような、少し冷たいけど的確でエモいトーン（あたってる？みたいなスタンス）」**に書き直してください。

【ルール】
- ユーザーに対する二人称は必ず「あなた」を使うこと（省略しても自然な場合は省略してOK）。「君」「お前」などは禁止。
- 語尾は「〜じゃない？」「〜した方がいいかもね」「〜してるでしょ？」「〜するの、やめなよ」といった、**「達観した親友」や「占い師」のように見透かしているような口調**（カジュアル敬語やタメ口のミックス）にすること。
- 「〜しろ」「〜だぞ」「〜やめろ」といった強い命令形・威圧的なトーンは絶対に使わない。
- 各テキストの意味や指摘の鋭さ（図星を突くエモさ）はそのまま残すこと。
- 余計な挨拶や説明は一切含めず、純粋にテキストの配列/オブジェクトの中身だけを修正して返すこと。

フォーマットは、渡されたJSONをそのままの構造で、テキスト部分だけを書き換えて返してください。
Markdownのコードブロック（\`\`\`json ... \`\`\`）のみを出力してください。
`;

async function processProtocols() {
  console.log("Processing protocols-ja.ts...");
  const protocolsPath = path.join(__dirname, 'lib', 'protocols-ja.ts');
  const { PROTOCOLS_JA } = require('./lib/protocols-ja.ts');
  
  // We'll process it type by type to avoid context limits
  const newProtocols = {};
  for (const [mbti, categories] of Object.entries(PROTOCOLS_JA)) {
    console.log(`Rewriting ${mbti}...`);
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: rewriteInstructions },
        { role: 'user', content: JSON.stringify(categories, null, 2) }
      ],
      temperature: 0.7,
    });
    
    let result = res.choices[0].message.content;
    result = result.replace(/^```json\n/, '').replace(/\n```$/, '').trim();
    
    try {
      newProtocols[mbti] = JSON.parse(result);
    } catch (e) {
      console.error(`Failed to parse JSON for ${mbti}`, result);
      newProtocols[mbti] = categories;
    }
  }
  
  const fileContent = `export const PROTOCOLS_JA: Record<string, Record<string, string[]>> = ${JSON.stringify(newProtocols, null, 2)};\n`;
  fs.writeFileSync(protocolsPath, fileContent, 'utf8');
  console.log("protocols-ja.ts has been rewritten.");
}

async function processCareers() {
  console.log("Processing career-data.ts...");
  const careersPath = path.join(__dirname, 'lib', 'career-data.ts');
  const { CAREER_DATA } = require('./lib/career-data.ts');
  
  const newCareers = {};
  for (const [mbti, data] of Object.entries(CAREER_DATA)) {
    console.log(`Rewriting career for ${mbti}...`);
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: rewriteInstructions },
        { role: 'user', content: JSON.stringify(data, null, 2) }
      ],
      temperature: 0.7,
    });
    
    let result = res.choices[0].message.content;
    result = result.replace(/^```json\n/, '').replace(/\n```$/, '').trim();
    
    try {
      newCareers[mbti] = JSON.parse(result);
    } catch (e) {
      console.error(`Failed to parse JSON for ${mbti}`, result);
      newCareers[mbti] = data;
    }
  }
  
  const fileContent = `export interface CareerData {
  hellJob: string;
  hellReason: string;
  survivalRoute: string;
  survivalReason: string;
  cheatCode: string;
}

export const CAREER_DATA: Record<string, CareerData> = ${JSON.stringify(newCareers, null, 2)};\n`;
  fs.writeFileSync(careersPath, fileContent, 'utf8');
  console.log("career-data.ts has been rewritten.");
}

async function main() {
  // We need to compile the TS files to JS or use require with ts-node
  // Wait, requiring TS directly in pure Node doesn't work.
  // I will write a small ts-node wrapper or just parse the JS.
}
main();
