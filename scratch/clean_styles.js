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

const files = walk('app');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Remove `style={{ color: "...", letterSpacing: "..." }}` completely if it's purely stylistic and hardcoded
  content = content.replace(/style=\{\{\s*color:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*color:\s*['"][^'"]+['"],\s*letterSpacing:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*letterSpacing:\s*['"][^'"]+['"]\s*\}\}/g, '');
  
  // Remove complex background/border styles
  content = content.replace(/style=\{\{\s*background:\s*['"][^'"]+['"]\s*,\s*borderColor:\s*['"][^'"]+['"]\s*,\s*color:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*border:\s*['"][^'"]+['"]\s*,\s*background:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*borderTop:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*color:\s*['"][^'"]+['"]\s*\}\}/g, '');

  content = content.replace(/style=\{\{\s*backgroundColor:\s*'#030305',\s*color:\s*'#1e293b'\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*backgroundColor:\s*['"]#[0-9a-fA-F]+['"]\s*\}\}/g, '');

  // For AnalyzingLoader, where fadingOut state is embedded in style:
  // Instead of completely dropping the style, we keep opacity & transition, just drop backgroundColor:
  content = content.replace(/backgroundColor:\s*['"]#030305['"],\n?\s*/g, '');
  content = content.replace(/backgroundColor:\s*['"]#FAFBFD['"],\n?\s*/g, '');
  // Same for other stragglers
  
  fs.writeFileSync(f, content, 'utf8');
});

console.log('done stripping styles');
