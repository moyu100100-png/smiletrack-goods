"use client";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/types";

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform flex"
    >
      {/* Cover image */}
      <div className="relative w-28 flex-shrink-0 bg-brand-gray">
        {collection.coverImage ? (
          <Image
            src={collection.coverImage}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-blue-light flex items-center justify-center">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col justify-center">
        <p className="text-sm font-semibold text-brand-text">{collection.name}</p>
        {collection.description && (
          <p className="text-xs text-brand-gray-dark mt-1 line-clamp-2">{collection.description}</p>
        )}
        <p className="text-xs text-brand-blue mt-2">
          商品 {collection.productIds?.length ?? 0}
        </p>
      </div>

      <div className="ml-auto pr-3 flex items-center">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
