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
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-brand-gray-dark">コレクションが見つかりません</p>
        <button onClick={() => router.back()} className="text-brand-blue text-sm">← 戻る</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray pb-8">
      <div className="sticky top-0 z-10 bg-white border-b border-brand-gray-mid px-4 h-12 flex items-center">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      <div className="bg-white px-4 py-5 mb-3">
        <h1 className="text-lg font-semibold text-brand-text">{collection.name}</h1>
        {collection.description && (
          <p className="text-sm text-brand-gray-dark mt-1">{collection.description}</p>
        )}
        <p className="text-xs text-brand-blue mt-2">商品 {products.length}</p>
      </div>

      <div className="px-3">
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
