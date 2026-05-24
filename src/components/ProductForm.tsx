"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, getCollections, getCategories } from "@/lib/firebase";
import { Product, Collection } from "@/types";

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
  const [category, setCategory] = useState(initial?.category ?? "");
  const [categories, setCategories] = useState<string[]>([]);
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
    getCategories().then((cats) => setCategories(cats));
  }, []);

  function toggleCollection(id: string) {
    setCollectionIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  function updateImageUrl(idx: number, val: string) {
    setImageUrls((prev) => prev.map((u, i) => i === idx ? val : u));
  }
  function addImageUrl() { setImageUrls((prev) => [...prev, ""]); }
  function removeImageUrl(idx: number) { setImageUrls((prev) => prev.filter((_, i) => i !== idx)); }

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
      if (isEdit) { await updateProduct(productId, data); } else { await createProduct(data); }
      router.push("/admin/products");
    } catch (e) {
      setError("保存に失敗しました: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">

      {/* 画像URL */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-1 block">画像URL</label>
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
              {url.trim() && (
                <img src={url.trim()} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-brand-gray" />
              )}
              <button onClick={() => removeImageUrl(idx)} className="text-brand-gray-dark text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
        <button onClick={addImageUrl} className="mt-2 text-xs text-brand-blue">＋ 画像URLを追加</button>
      </div>

      {/* 基本情報 */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">商品名 *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="商品名を入力" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-brand-gray-dark mb-1 block">価格</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="2475" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-brand-gray-dark mb-1 block">価格補足</label>
            <input value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} className={inputCls} placeholder="〜" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">カテゴリ</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">選択してください</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* コメント */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-2 block">コメント（Markdown対応）</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={8}
          className={`${inputCls} resize-none font-mono text-xs`}
          placeholder="商品のコメントを入力..."
        />
      </div>

      {/* 購入リンク */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">Amazon URL</label>
          <input value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} className={inputCls} placeholder="https://amzn.to/..." type="url" />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">楽天 URL</label>
          <input value={rakutenUrl} onChange={(e) => setRakutenUrl(e.target.value)} className={inputCls} placeholder="https://item.rakuten.co.jp/..." type="url" />
        </div>
      </div>

      {/* コレクション */}
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

const inputCls = "w-full border border-brand-gray-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-blue transition-colors bg-white";
