"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCollection, getProduct } from "@/lib/firebase";
import { Collection, Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const col = await getCollection(id);
      if (!col) { setLoading(false); return; }
      setCollection(col as Collection);
      const prods = await Promise.all(
        (col as Collection).productIds.map((pid: string) => getProduct(pid))
      );
      setProducts(prods.filter(Boolean) as Product[]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0EA" }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #C4B9AB", borderTopColor: "#8B7355" }} />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F5F0EA" }}>
        <p style={{ color: "#9B8E80" }}>コレクションが見つかりません</p>
        <button onClick={() => router.back()} className="text-sm" style={{ color: "#8B7355" }}>← 戻る</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: "#F5F0EA" }}>
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 px-4 h-12 flex items-center" style={{ background: "rgba(245,240,234,0.92)", backdropFilter: "blur(8px)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm" style={{ color: "#4A4440" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      {/* コレクション情報 */}
      <div className="px-4 py-5 mb-4 mx-4 mt-4 rounded-xl" style={{ background: "#FDFBF8", border: "0.5px solid rgba(0,0,0,0.07)" }}>
        <h1 className="text-base font-medium" style={{ color: "#2C2C2A" }}>{collection.name}</h1>
        {collection.description && (
          <p className="text-sm mt-1" style={{ color: "#9B8E80" }}>{collection.description}</p>
        )}
        <p className="text-xs mt-2" style={{ color: "#C4B9AB" }}>商品 {products.length}件</p>
      </div>

      {/* 商品グリッド */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
