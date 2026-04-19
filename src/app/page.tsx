"use client";
import { useState, useEffect } from "react";
import { getProducts, getCollections } from "@/lib/firebase";
import { Product, Collection, CATEGORIES } from "@/types";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import Header from "@/components/Header";

export default function HomePage() {
  const [tab, setTab] = useState<"products" | "collections">("products");
  const [category, setCategory] = useState("すべて");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (tab === "products") {
        const data = await getProducts(category !== "すべて" ? category : undefined);
        setProducts(data as Product[]);
      } else {
        const data = await getCollections();
        setCollections(data as Collection[]);
      }
      setLoading(false);
    }
    load();
  }, [tab, category]);

  return (
    <div className="min-h-screen bg-brand-gray">
      <Header />

      {/* Hero */}
      <div className="bg-white border-b border-brand-gray-mid px-4 pt-5 pb-4">
        <p className="text-xs text-brand-gray-dark tracking-wide uppercase mb-1">SmileTrack Developer Picks</p>
        <h1 className="text-lg font-semibold text-brand-text leading-tight">
          矯正中に本当に使ってよかったグッズ
        </h1>
        <p className="text-xs text-brand-gray-dark mt-1">
          アプリ開発者・Sara が毎日使うケアグッズを紹介します
        </p>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-brand-gray-mid sticky top-0 z-10">
        <div className="flex">
          {(["products", "collections"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-brand-gray-dark"
              }`}
            >
              {t === "products" ? "商品" : "コレクション"}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter (products only) */}
      {tab === "products" && (
        <div className="bg-white border-b border-brand-gray-mid px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-brand-blue text-white"
                    : "bg-brand-gray text-brand-gray-dark border border-brand-gray-mid"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="px-3 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : tab === "products" ? (
          products.length === 0 ? (
            <p className="text-center text-brand-gray-dark text-sm py-16">
              商品がまだありません
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )
        ) : (
          collections.length === 0 ? (
            <p className="text-center text-brand-gray-dark text-sm py-16">
              コレクションがまだありません
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {collections.map((c) => (
                <CollectionCard key={c.id} collection={c} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
