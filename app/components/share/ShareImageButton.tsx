"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { trackSaveImage, type ShareContentType } from "@/lib/analytics";
import { Button, type ButtonVariant } from "@/app/components/ui/Button";
import { Notice } from "@/app/components/ui/Notice";

/**
 * 生成画像を保存するボタン（仕様書 4-3「保存の流れ」、4-5 でも共用）
 *   1. 画像を取得して File にする。取れなければ、そこで案内を出して終わる
 *   2. navigator.canShare({ files }) が真なら、共有シートを開く
 *   3. 共有シートが使えず、パソコンのブラウザ（マウスなどの細かいポインター）なら、a[download] でダウンロードする
 *   4. どれも失敗したら、画像を全画面で出して「長押しで保存」と案内する
 * ブラウザ名の文字列では判定せず、機能の有無と例外で分岐する（アプリ内ブラウザは独自に制限していることがある）。
 * 各分岐の終わりで GA4 の save_image を送る。取得に失敗した回は送らない（保存の試みとして数えないため）。
 *   imageUrl …… サイト内の画像の URL（例：/ja/result/INTJ/share-image/61-33-78-50）
 *   fileName …… 保存するファイル名（例：cognitivelens-INTJ.png）
 */
interface ShareImageButtonProps {
  imageUrl: string;
  fileName: string;
  contentType: ShareContentType;
  itemId: TypeCode;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}

async function fetchImageFile(imageUrl: string, fileName: string): Promise<File> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`画像を取得できなかった（${res.status}）`);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

/** マウスなどでホバーでき、ダウンロード属性を扱えるブラウザ（パソコン） */
function canDownloadHere(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches && "download" in HTMLAnchorElement.prototype;
}

export function ShareImageButton({
  imageUrl,
  fileName,
  contentType,
  itemId,
  label = "結果画像を保存",
  variant = "primary",
  className,
}: ShareImageButtonProps) {
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState(false);
  // 長押しの案内に出す画像。取得済みの File をそのまま見せる（同じ URL をもう一度読みにいかない）
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // 共有シートは、押した操作から時間が空くと開けないことがある。押す直前（触れた・フォーカスした時点）から取得を始めておく
  const filePromise = useRef<Promise<File> | null>(null);

  const warmUp = () => {
    if (!filePromise.current) {
      filePromise.current = fetchImageFile(imageUrl, fileName);
      // 失敗したら、次に押したときに取り直す
      filePromise.current.catch(() => {
        filePromise.current = null;
      });
    }
    return filePromise.current;
  };

  useEffect(() => {
    filePromise.current = null;
    setFailed(false);
  }, [imageUrl, fileName]);

  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(previewFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewFile]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (previewUrl && dialog && !dialog.open) dialog.showModal();
  }, [previewUrl]);

  async function save() {
    if (working) return;
    setWorking(true);
    setFailed(false);
    try {
      // 1. 取得
      const file = await warmUp().catch(() => null);

      // 取れていないときに長押しの案内を出しても、同じ URL をもう一度読むだけで中身のない画面になる。
      // GA4 も送らず、やり直せることだけ伝える
      if (!file) {
        setFailed(true);
        return;
      }

      // 2. 共有シート
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          trackSaveImage("share_sheet", contentType, itemId);
          return;
        } catch (error) {
          // 利用者が共有シートを閉じただけなら、ほかの方法に進まない
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      // 3. パソコンのダウンロード
      if (canDownloadHere()) {
        const objectUrl = URL.createObjectURL(file);
        try {
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = fileName;
          document.body.append(a);
          a.click();
          a.remove();
          trackSaveImage("download", contentType, itemId);
          return;
        } catch {
          // 長押しの案内に進む
        } finally {
          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        }
      }

      // 4. 長押しの案内
      setPreviewFile(file);
      trackSaveImage("long_press", contentType, itemId);
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <Button
        variant={variant}
        className={className}
        // disabled にするとフォーカスが外れるので、aria-disabled にして save() の中で二重の実行を防ぐ
        aria-busy={working}
        aria-disabled={working}
        onPointerEnter={warmUp}
        onPointerDown={warmUp}
        onFocus={warmUp}
        onClick={save}
      >
        {working ? "画像を用意しています…" : label}
      </Button>

      {failed && (
        <Notice className="col-span-full" title="画像を用意できませんでした">
          通信を確かめて、もう一度お試しください。
        </Notice>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setPreviewFile(null)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-4 text-fg backdrop:bg-black/80"
      >
        {previewUrl && (
          <div className="mx-auto flex h-full max-w-prose flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p id={titleId} className="font-bold">
                画像を長押しして保存してください
              </p>
              <Button variant="secondary" className="shrink-0" onClick={() => dialogRef.current?.close()}>
                閉じる
              </Button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center">
              {/* 長押しで端末に保存できるよう、取得済みの PNG をそのまま出す（最適化を通さない） */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="保存する画像" className="max-h-full w-auto max-w-full rounded-panel object-contain" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
