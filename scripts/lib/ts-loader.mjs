// データだけの TypeScript ファイルを、検査スクリプトから読み込むための小さな読み込み器。
// typescript パッケージで CommonJS に変換して評価する。"@/..." はリポジトリの直下として解決する。
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const cache = new Map();

function resolveFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export function loadTs(root, file) {
  const full = path.resolve(root, file);
  if (cache.has(full)) return cache.get(full);
  const source = fs.readFileSync(full, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: full,
  });
  const module = { exports: {} };
  cache.set(full, module.exports);
  const nodeRequire = createRequire(full);
  const localRequire = (spec) => {
    let target = null;
    if (spec.startsWith("@/")) target = resolveFile(path.join(root, spec.slice(2)));
    else if (spec.startsWith(".")) target = resolveFile(path.resolve(path.dirname(full), spec));
    if (target) return loadTs(root, target);
    return nodeRequire(spec);
  };
  new Function("module", "exports", "require", outputText)(module, module.exports, localRequire);
  cache.set(full, module.exports);
  return module.exports;
}
