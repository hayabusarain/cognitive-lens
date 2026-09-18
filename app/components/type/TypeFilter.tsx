"use client";

import { useId, type Dispatch, type SetStateAction } from "react";
import type { TypeCode } from "@/lib/type-codes";

/**
 * 16タイプの絞り込み（仕様書 4-4）。「すべて・外向（E）・内向（I）」と「すべて・判断（J）・知覚（P）」。
 * 状態は持たず、TypeGrid の useState の value と更新関数（onChange）で管理する。URL のクエリは変えない
 */
export interface TypeFilterValue {
  ei: "all" | "E" | "I";
  jp: "all" | "J" | "P";
}

export const INITIAL_TYPE_FILTER: TypeFilterValue = { ei: "all", jp: "all" };

/** 型コードが絞り込みの条件に合うか */
export function matchesTypeFilter(type: TypeCode, value: TypeFilterValue): boolean {
  return (value.ei === "all" || type[0] === value.ei) && (value.jp === "all" || type[3] === value.jp);
}

const GROUPS = [
  {
    key: "ei",
    label: "外向・内向",
    options: [
      { value: "all", label: "すべて" },
      { value: "E", label: "外向（E）" },
      { value: "I", label: "内向（I）" },
    ],
  },
  {
    key: "jp",
    label: "判断・知覚",
    options: [
      { value: "all", label: "すべて" },
      { value: "J", label: "判断（J）" },
      { value: "P", label: "知覚（P）" },
    ],
  },
] as const;

interface TypeFilterProps {
  value: TypeFilterValue;
  /** useState の更新関数。続けて押されても前の選択を消さないよう、関数の形で更新する */
  onChange: Dispatch<SetStateAction<TypeFilterValue>>;
  className?: string;
}

export function TypeFilter({ value, onChange, className = "" }: TypeFilterProps) {
  const id = useId();
  return (
    <div className={`grid gap-3 md:grid-cols-2 ${className}`}>
      {GROUPS.map((group) => {
        const labelId = `${id}-${group.key}`;
        return (
          <div key={group.key}>
            <span id={labelId} className="mb-1 block text-label font-bold text-muted">
              {group.label}
            </span>
            <div role="group" aria-labelledby={labelId} className="grid grid-cols-3 gap-1 rounded-panel bg-surface p-1">
              {group.options.map((option) => {
                const pressed = value[group.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => onChange((prev) => ({ ...prev, [group.key]: option.value }))}
                    className={`min-h-11 cursor-pointer rounded-lg px-1 font-bold ${
                      pressed ? "bg-fg text-ink" : "text-muted hover:text-fg"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
