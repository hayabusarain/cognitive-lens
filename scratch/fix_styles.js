const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('dark') && !file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

// Map the old white opacities to new dark slate hex or rgba equivalents
const files = walk('app');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Replace text/border colors mapped from white
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.(8|9)\d*\)/g, '#1e293b'); // text-slate-800
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.(6|7)\d*\)/g, '#475569'); // text-slate-600
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.(3|4|5)\d*\)/g, '#64748b'); // text-slate-500
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.(1|2)\d*\)/g, '#94a3b8'); // text-slate-400
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.0\d*\)/g, 'rgba(0,0,0,0.06)'); // subtle borders/bg

  // Replace solid whites or off-whites used for text
  content = content.replace(/#f0f4ff/gi, '#1e293b');
  content = content.replace(/#ffffff/gi, '#1e293b');

  // Replace specific dark backgrounds where hardcoded
  content = content.replace(/background:\s*"(#030305|#050505|black)"/gi, 'background: "#fafbfd"');

  // ResultContent specifically
  content = content.replace(/grid:\s*"rgba\(255,255,255,0\.08\)"/g, 'grid: "rgba(0,0,0,0.08)"');
  
  fs.writeFileSync(f, content, 'utf8');
});

console.log('done replacing colors');
