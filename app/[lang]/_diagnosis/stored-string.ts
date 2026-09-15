import { useCallback, useSyncExternalStore } from "react";

/**
 * sessionStorage の1つのキーを、React から読み書きする（途中経過の保存。仕様書 2-1）
 *
 * サーバーと最初の描画では null（1問目）を返し、ハイドレーションのあとで保存した値に切り替わる。
 * sessionStorage が使えない環境（プライベートブラウズの一部など）でも進められるよう、値はメモリにも持つ。
 */
const memory = new Map<string, string | null>();
const listeners = new Map<string, Set<() => void>>();

function read(key: string): string | null {
  if (!memory.has(key)) {
    let raw: string | null = null;
    try {
      raw = window.sessionStorage.getItem(key);
    } catch {
      // 読めなければ保存なしとして始める
    }
    memory.set(key, raw);
  }
  return memory.get(key) ?? null;
}

function write(key: string, raw: string | null): void {
  memory.set(key, raw);
  try {
    if (raw === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, raw);
  } catch {
    // 保存できなくても、このページを開いている間はメモリの値で進める
  }
  listeners.get(key)?.forEach((listener) => listener());
}

export function useStoredString(key: string): [string | null, (raw: string | null) => void] {
  const subscribe = useCallback(
    (listener: () => void) => {
      const set = listeners.get(key) ?? new Set();
      set.add(listener);
      listeners.set(key, set);
      return () => {
        set.delete(listener);
      };
    },
    [key],
  );
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const update = useCallback((next: string | null) => write(key, next), [key]);
  return [raw, update];
}
