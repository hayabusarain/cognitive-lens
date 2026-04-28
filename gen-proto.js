const fs = require('fs');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { console.error('No API key'); process.exit(1); }

async function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.choices && parsed.choices[0]) {
            resolve(JSON.parse(parsed.choices[0].message.content));
          } else {
            console.error(parsed);
            resolve(null);
          }
        } catch (e) {
          console.error(e);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

const promptJa = `Generate a JSON object containing psychological protocols for all 16 MBTI types.
The target audience is Gen-Z (Z世代). The tone should be brutally honest, slightly toxic, internet-savvy, and highly insightful.
Structure:
{
  "INTJ": {
    "短期": ["string", "string", "string"], // ガチで今すぐ試すべきこと (Immediate actionable advice to fix their toxic traits)
    "長期": ["string", "string", "string"], // 死ぬまで役立つ生存ルート (Long-term life strategy to survive society)
    "教育": ["string", "string", "string"]  // メンタル＆才能のチート技 (Mental hacks to utilize their specific cognitive functions)
  },
  // ... all 16 types (INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP)
}
Ensure exactly 3 strings per category. Text should be in Japanese.`;

const promptEn = `Generate a JSON object containing psychological protocols for all 16 MBTI types.
The target audience is Gen-Z. The tone should be brutally honest, slightly toxic, internet-savvy, and highly insightful (similar to TikTok/Twitter roast astrology but for MBTI).
Structure:
{
  "INTJ": {
    "短期": ["string", "string", "string"], // Protocols to Try Immediately (Immediate actionable advice to fix their toxic traits)
    "長期": ["string", "string", "string"], // Lifelong Survival Route (Long-term life strategy to survive society)
    "教育": ["string", "string", "string"]  // Mental & Talent Cheat Codes (Mental hacks to utilize their specific cognitive functions)
  },
  // ... all 16 types (INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP)
}
Ensure exactly 3 strings per category. Text should be in English.`;

(async () => {
  console.log('Generating JA...');
  const ja = await callOpenAI(promptJa);
  console.log('Generating EN...');
  const en = await callOpenAI(promptEn);
  
  if (ja) {
    fs.writeFileSync('lib/protocols-ja.ts', 'export const PROTOCOLS_JA: Record<string, Record<string, string[]>> = ' + JSON.stringify(ja, null, 2) + ';');
  }
  if (en) {
    fs.writeFileSync('lib/protocols-en.ts', 'export const PROTOCOLS_EN: Record<string, Record<string, string[]>> = ' + JSON.stringify(en, null, 2) + ';');
  }
  console.log('Done!');
})();
