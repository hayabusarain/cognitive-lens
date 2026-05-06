const fs = require('fs');
const txt = fs.readFileSync('lib/combo-data-en.ts', 'utf8');
const res = txt.replace(/mbti1:\s*"([^"]+)",\s*mbti2:\s*"([^"]+)",\s*text1:\s*"([^"]+)",\s*text2:\s*"([^"]+)",\s*matchLevel:\s*\d+/g, 
  'typeA: "$1", typeB: "$2", dialogue: [{speaker: "$1", text: "$3"}, {speaker: "$2", text: "$4"}]');
fs.writeFileSync('lib/combo-data-en.ts', res);
