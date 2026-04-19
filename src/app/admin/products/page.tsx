"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, deleteProduct } from "@/lib/firebase";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data as Product[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await deleteProduct(id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-text">商品一覧 ({products.length})</h2>
        <Link
          href="/admin/products/new"
          className="bg-brand-blue text-white text-xs font-medium px-4 py-2 rounded-xl"
        >
          ＋ 追加
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-brand-gray-dark text-sm">
          商品がありません。追加してください。
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-3 flex items-center gap-3">
              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-gray flex-shrink-0">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-brand-gray-mid text-xs">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text truncate">{p.name}</p>
                <p className="text-xs text-brand-gray-dark mt-0.5">
                  {p.category} {p.price != null ? `・¥${p.price.toLocaleString()}` : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="text-xs bg-brand-gray text-brand-text-soft px-3 py-1.5 rounded-lg"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
