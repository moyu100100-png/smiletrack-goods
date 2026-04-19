"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createCollection,
  updateCollection,
  getProducts,
} from "@/lib/firebase";
import { Collection, Product } from "@/types";

interface Props {
  initial?: Partial<Collection>;
  collectionId?: string;
}

export default function CollectionForm({ initial, collectionId }: Props) {
  const router = useRouter();
  const isEdit = !!collectionId;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverImage ?? "");
  const [productIds, setProductIds] = useState<string[]>(initial?.productIds ?? []);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts().then((p) => setAllProducts(p as Product[]));
  }, []);

  function toggleProduct(id: string) {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (!name.trim()) { setError("繧ｳ繝ｬ繧ｯ繧ｷ繝ｧ繝ｳ蜷阪・蠢・医〒縺・); return; }
    setSaving(true);
    setError("");
    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
        coverImage: coverUrl.trim(),
        productIds,
      };

      if (isEdit) {
        await updateCollection(collectionId, data);
      } else {
        await createCollection(data);
      }
      router.push("/admin/collections");
    } catch (e) {
      setError("菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Basic info */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">繧ｳ繝ｬ繧ｯ繧ｷ繝ｧ繝ｳ蜷・*</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="遏ｯ豁｣蠢・医い繧､繝・Β"
            maxLength={50}
          />
          <p className="text-[10px] text-brand-gray-dark mt-1 text-right">{name.length}/50</p>
        </div>
        <div>
          <label className="text-xs font-medium text-brand-gray-dark mb-1 block">邏ｹ莉区枚</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="縺薙・繧ｳ繝ｬ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫ縺､縺・※邏ｹ莉九＠縺ｾ縺励ｇ縺・・
            maxLength={500}
          />
          <p className="text-[10px] text-brand-gray-dark mt-1 text-right">{description.length}/500</p>
        </div>
      </div>

      {/* Cover image URL */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-1 block">繧ｫ繝舌・逕ｻ蜒酋RL</label>
        <p className="text-[10px] text-brand-gray-dark mb-2">
          逕ｻ蜒上ｒ髟ｷ謚ｼ縺冷・縲檎判蜒上い繝峨Ξ繧ｹ繧偵さ繝斐・縲阪＠縺ｦ雋ｼ縺｣縺ｦ縺上□縺輔＞
        </p>
        <div className="flex gap-2 items-center">
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className={`${inputCls} flex-1`}
            placeholder="https://..."
            type="url"
          />
          {coverUrl.trim() && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl.trim()} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-brand-gray" />
          )}
        </div>
      </div>

      {/* Product selection */}
      <div className="bg-white rounded-xl p-4">
        <label className="text-xs font-medium text-brand-gray-dark mb-3 block">
          蝠・刀繧帝∈謚・({productIds.length}莉ｶ驕ｸ謚樔ｸｭ)
        </label>
        {allProducts.length === 0 ? (
          <p className="text-xs text-brand-gray-dark">蝠・刀縺後∪縺逋ｻ骭ｲ縺輔ｌ縺ｦ縺・∪縺帙ｓ</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allProducts.map((p) => (
              <label key={p.id} className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={productIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="w-4 h-4 rounded accent-blue-500 flex-shrink-0"
                />
                {p.images?.[0] && (
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={p.images[0]} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                )}
                <span className="text-sm text-brand-text line-clamp-1">{p.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-brand-blue text-white rounded-xl py-4 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "菫晏ｭ倅ｸｭ..." : isEdit ? "螟画峩繧剃ｿ晏ｭ・ : "繧ｳ繝ｬ繧ｯ繧ｷ繝ｧ繝ｳ繧剃ｽ懈・"}
      </button>
    </div>
  );
}

const inputCls =
  "w-full border border-brand-gray-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-blue transition-colors bg-white";

