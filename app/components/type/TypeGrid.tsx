"use client";

import { useState } from "react";
import { TYPE_CODES, type TypeCode } from "@/lib/type-codes";
import { TypeCard } from "@/app/components/type/TypeCard";
import { INITIAL_TYPE_FILTER, TypeFilter, matchesTypeFilter } from "@/app/components/type/TypeFilter";

/**
 * 16タイプのカードの並び（仕様書 4-4）。アルファベット順、スマートフォン2列・パソコン4列。
 * 16枚すべてを HTML に出し、絞り込みはクライアントで hidden を切り替える（URL は変えない）。
 * 一覧とビンゴのハブで共用する。リンク先は hrefPattern、一行説明は descriptions で差し替える。
 * サーバーコンポーネントから関数は渡せないので、リンク先は文字列の型で受け取る。
 */
interface TypeGridProps {
  /** カードのリンク先。{TYPE} が型コードに置き換わる（例："/ja/result/{TYPE}"） */
  hrefPattern: string;
  /** 16タイプの一行説明（例：lib/type-content の TYPE_TAGLINES） */
  descriptions: Readonly<Record<TypeCode, string>>;
  /** 絞り込みを出すか。既定は出す */
  filter?: boolean;
  /** 先に読み込む画像の枚数。最初の画面に見える枚数（既定4） */
  eagerCount?: number;
  className?: string;
}

export function TypeGrid({ hrefPattern, descriptions, filter = true, eagerCount = 4, className = "" }: TypeGridProps) {
  const [value, setValue] = useState(INITIAL_TYPE_FILTER);
  const visibleCount = TYPE_CODES.filter((type) => matchesTypeFilter(type, value)).length;

  return (
    <div className={className}>
      {filter && (
        <>
          <TypeFilter value={value} onChange={setValue} />
          <p aria-live="polite" className="sr-only">
            {visibleCount}タイプを表示しています
          </p>
        </>
      )}
      <ul className={`grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6 ${filter ? "mt-5" : ""}`}>
        {TYPE_CODES.map((type, i) => (
          <li key={type} hidden={!matchesTypeFilter(type, value)}>
            <TypeCard
              type={type}
              href={hrefPattern.replace("{TYPE}", type)}
              description={descriptions[type]}
              imageLoading={i < eagerCount ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
