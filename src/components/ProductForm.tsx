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
    if (!name.trim()) { setError("Name required"); return; }
    setSaving(true);
    setError("");
    try {
      const images = imageUrls.map((u) => u.trim()).filter(Boolean);
      const data = { name: name.trim(), price: price !== "" ? Number(price) : null, priceLabel: priceLabel.trim(), category, comment, amazonUrl: amazonUrl.trim(), rakutenUrl: rakutenUrl.trim(), images, collectionIds };
      if (isEdit) { await updateProduct(productId, data); } else { await createProduct(data); }
      router.push("/admin/products");
    } catch (e) {
      setError("Failed: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-1 block">Image URL</label>
        <div className="space-y-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input value={url} onChange={(e) => updateImageUrl(idx, e.target.value)} className={`${inputCls} flex-1`} placeholder="https://..." type="url" />
              {url.trim() && (<img src={url.trim()} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-brand-gray" />)}
              <button onClick={() => removeImageUrl(idx)} className="text-brand-gray-dark text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center">x</button>
            </div>
          ))}
        </div>
        <button onClick={addImageUrl} className="mt-2 text-xs text-brand-blue">+ Add image URL</button>
      </div>
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Name *</label><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="product name" /></div>
        <div className="flex gap-2">
          <div className="flex-1"><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Price</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="2475" /></div>
          <div className="flex-1"><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Price note</label><input value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} className={inputCls} placeholder="~" /></div>
        </div>
        <div><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">Select</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-2 block">Comment (Markdown)</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={8} className={`${inputCls} resize-none font-mono text-xs`} placeholder="comment here..." />
      </div>
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Amazon URL</label><input value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} className={inputCls} placeholder="https://amzn.to/..." type="url" /></div>
        <div><label className="text-xs font-medium text-brand-gray-dark mb-1 block">Rakuten URL</label><input value={rakutenUrl} onChange={(e) => setRakutenUrl(e.target.value)} className={inputCls} placeholder="https://item.rakuten.co.jp/..." type="url" /></div>
      </div>
      {collections.length > 0 && (
        <div className="bg-white rounded-xl p-4">
          <label className="text-xs font-medium text-brand-gray-dark mb-3 block">Collections</label>
          <div className="space-y-2">
            {collections.map((col) => (
              <label key={col.id} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={collectionIds.includes(col.id)} onChange={() => toggleCollection(col.id)} className="w-4 h-4 rounded accent-blue-500" />
                <span className="text-sm text-brand-text">{col.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
      <button onClick={handleSave} disabled={saving} className="w-full bg-brand-blue text-white rounded-xl py-4 text-sm font-semibold disabled:opacity-60">
        {saving ? "Saving..." : isEdit ? "Save" : "Add product"}
      </button>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><label className="text-xs font-medium text-brand-gray-dark mb-1 block">{label}</label>{children}</div>;
}

const inputCls = "w-full border border-brand-gray-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-blue transition-colors bg-white";
