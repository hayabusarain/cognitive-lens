import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // scripts/ は Node で動かす検査・生成スクリプトで、ブラウザには配信しない。
    // CommonJS に変換したコードを評価するため module 変数を作るが、これは Next.js が
    // 禁じているバンドル時の module 代入とは別物なので、この規則は当てない。
    files: ["scripts/**/*.mjs"],
    rules: { "@next/next/no-assign-module-variable": "off" },
  },
]);

export default eslintConfig;
