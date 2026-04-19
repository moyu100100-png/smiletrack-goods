"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  getCollections,
} from "@/lib/firebase";
import { Product, Collection, CATEGORIES } from "@/types";

interface Props {
  initial?: Partial<Product>;
  productId?: string;
}

export default function ProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;

  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [priceLabel, setPriceLabel] = useState(initial?.priceLabel ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[1]);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [amazonUrl, setAmazonUrl] = useState(initial?.amazonUrl ?? "");
  const [rakutenUrl, setRakutenUrl] = useState(initial?.rakutenUrl ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.images ?? [""]);
  const [collectionIds, setCollectionIds] = useState<string[]>(initial?.collectionIds ?? []);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCollections().then((c) => setCollections(c as Collection[]));
  }, []);

  function toggleCollection(id: string) {
    setCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function updateImageUrl(idx: number, val: string) {
    setImageUrls((prev) => prev.map((u, i) => i === idx ? val : u));
  }
  function addImageUrl() { setImageUrls((prev) => [...prev, ""]); }
  function removeImageUrl(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!name.trim()) { setError("商品名は必須です"); return; }
    setSaving(true);
    setError("");
    try {
      const images = imageUrls.map((u) => u.trim()).filter(Boolean);
      const data = {
        name: name.trim(),
        price: price !== "" ? Number(price) : null,
        priceLabel: priceLabel.trim(),
        category,
        comment,
        amazonUrl: amazonUrl.trim(),
        rakutenUrl: rakutenUrl.trim(),
        images,
        collectionIds,
      };
      if (isEdit) {
        await updateProduct(productId, data);
      } else {
        await createProduct(data);
      }
      router.push("/admin/products");
    } catch (e) {
      setError("保存に失敗しました: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Image URLs */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-1 block">商品画像URL</label>
        <p className="text-[10px] text-brand-gray-dark mb-3">
          AmazonやGoogleで商品画像を開き、画像を長押し→「画像アドレスをコピー」して貼ってください
        </p>
        <div className="space-y-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={url}
                onChange={(e) => updateImageUrl(idx, e.target.value)}
                className={`${inputCls} flex-1`}
                placeholder="https://..."
                type="url"
              />
              {/* Preview */}
              {url.trim() && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url.trim()} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-brand-gray" />
              )}
              <button
                onClick={() => removeImageUrl(idx)}
                className="text-brand-gray-dark text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addImageUrl}
          className="mt-2 text-xs text-brand-blue flex items-center gap-1"
        >
          ＋ 画像URLを追加
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <Field label="商品名 *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="クリニカ Y字フロス"
          />
        </Field>
        <div className="flex gap-2">
          <Field label="参考価格（円）" className="flex-1">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputCls}
              placeholder="2475"
            />
          </Field>
          <Field label="価格備考" className="flex-1">
            <input
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              className={inputCls}
              placeholder="〜 など"
            />
          </Field>
        </div>
        <Field label="カテゴリー">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            {CATEGORIES.filter((c) => c !== "すべて").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Comment */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-2 block">
          開発者コメント（Markdown対応）
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={8}
          className={`${inputCls} resize-none font-mono text-xs`}
          placeholder={"マウスピースをはめる前のフロス、面倒ですよね…\n\n## おすすめポイント\n- 奥歯まで届くY字型\n- **高強度フロス**"}
        />
        <p className="text-[10px] text-brand-gray-dark mt-1">
          Markdown記法が使えます。**太字** / - リスト
        </p>
      </div>

      {/* Affiliate URLs */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <Field label="Amazon アフィリエイトURL">
          <input
            value={amazonUrl}
            onChange={(e) => setAmazonUrl(e.target.value)}
            className={inputCls}
            placeholder="https://amzn.to/..."
            type="url"
          />
        </Field>
        <Field label="楽天市場 アフィリエイトURL">
          <input
            value={rakutenUrl}
            onChange={(e) => setRakutenUrl(e.target.value)}
            className={inputCls}
            placeholder="https://item.rakuten.co.jp/..."
            type="url"
          />
        </Field>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div className="bg-white rounded-xl p-4">
          <label className="text-xs font-medium text-brand-gray-dark mb-3 block">コレクション</label>
          <div className="space-y-2">
            {collections.map((col) => (
              <label key={col.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectionIds.includes(col.id)}
                  onChange={() => toggleCollection(col.id)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-sm text-brand-text">{col.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-brand-blue text-white rounded-xl py-4 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "保存中..." : isEdit ? "変更を保存" : "商品を追加"}
      </button>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-brand-gray-dark mb-1 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-brand-gray-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-blue transition-colors bg-white";
