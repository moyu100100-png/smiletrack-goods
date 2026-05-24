"use client";
import { useState, useEffect } from "react";
import { getProducts, getCollections } from "@/lib/firebase";
import { Product, Collection } from "@/types";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import Header from "@/components/Header";

export default function HomePage() {
  const [tab, setTab] = useState<"products" | "collections">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prods, cols] = await Promise.all([getProducts(), getCollections()]);
      const p = prods as Product[];
      const c = cols as Collection[];
      setProducts(p);
      setCollections(c);
      const map: Record<string, Product> = {};
      p.forEach((prod) => { map[prod.id] = prod; });
      setProductMap(map);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0EA" }}>
      <Header />

      <div className="px-4 pt-10 pb-8 text-center">
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 400, color: "#2C2C2A", letterSpacing: "0.12em" }}>
          SmileTrack Developer Picks
        </h1>
      </div>

      <div className="flex justify-center mx-8" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
        {(["products", "collections"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-8 py-3 text-sm transition-colors"
            style={{
              color: tab === t ? "#2C2C2A" : "#9B8E80",
              borderBottom: tab === t ? "1.5px solid #2C2C2A" : "1.5px solid transparent",
              letterSpacing: "0.05em",
            }}
          >
            {t === "products" ? "商品" : "コレクション"}
          </button>
        ))}
      </div>

      <main className="px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl aspect-square animate-pulse" style={{ background: "#EDE8E0" }} />
            ))}
          </div>
        ) : tab === "products" ? (
          products.length === 0 ? (
            <p className="text-center text-sm py-16" style={{ color: "#9B8E80" }}>商品がまだありません</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        ) : (
          collections.length === 0 ? (
            <p className="text-center text-sm py-16" style={{ color: "#9B8E80" }}>コレクションがまだありません</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {collections.map((c) => (
                <CollectionCard key={c.id} collection={c} productMap={productMap} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
