"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCollections, deleteCollection } from "@/lib/firebase";
import { Collection } from "@/types";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getCollections();
    setCollections(data as Collection[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await deleteCollection(id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-text">コレクション ({collections.length})</h2>
        <Link
          href="/admin/collections/new"
          className="bg-brand-blue text-white text-xs font-medium px-4 py-2 rounded-xl"
        >
          ＋ 作成
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-brand-gray-dark text-sm">
          コレクションがありません。作成してください。
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((col) => (
            <div key={col.id} className="bg-white rounded-xl p-3 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-gray flex-shrink-0">
                {col.coverImage ? (
                  <Image src={col.coverImage} alt={col.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="absolute inset-0 bg-brand-blue-light flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text truncate">{col.name}</p>
                <p className="text-xs text-brand-gray-dark mt-0.5">商品 {col.productIds?.length ?? 0}</p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/collections/${col.id}`}
                  className="text-xs bg-brand-gray text-brand-text-soft px-3 py-1.5 rounded-lg"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(col.id, col.name)}
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
