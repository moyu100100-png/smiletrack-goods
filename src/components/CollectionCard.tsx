"use client";
import Link from "next/link";
import Image from "next/image";
import { Collection, Product } from "@/types";

interface Props {
  collection: Collection;
  productMap: Record<string, Product>;
}

export default function CollectionCard({ collection, productMap }: Props) {
  const imgs = (collection.productIds ?? [])
    .slice(0, 4)
    .map((id) => productMap[id]?.images?.[0])
    .filter(Boolean) as string[];

  return (
    <Link href={`/collections/${collection.id}`} className="block active:scale-[0.99] transition-transform">
      <div className="rounded-xl overflow-hidden" style={{ background: "#FDFBF8", border: "0.5px solid rgba(0,0,0,0.07)" }}>
        {/* 2×2 画像グリッド */}
        <div className="grid grid-cols-2" style={{ gap: "1px", background: "#EDE8E0" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative aspect-square" style={{ background: "#EDE8E0" }}>
              {imgs[i] ? (
                <Image src={imgs[i]} alt="" fill className="object-cover" sizes="150px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C4B9AB">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3">
          <p className="text-sm font-medium" style={{ color: "#2C2C2A" }}>{collection.name}</p>
          {collection.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: "#9B8E80" }}>{collection.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
