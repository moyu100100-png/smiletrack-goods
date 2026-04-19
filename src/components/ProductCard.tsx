"use client";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-square bg-brand-gray">
        {img ? (
          <Image src={img} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-gray-mid">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="white">
            <path d="M4 5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6-2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM0 5C0 2.24 2.24 0 5 0c1.5 0 2.84.66 3.76 1.7A4.97 4.97 0 0 1 11 0c2.76 0 5 2.24 5 5s-2.24 5-5 5c-1.5 0-2.84-.66-3.76-1.7A4.97 4.97 0 0 1 5 10C2.24 10 0 7.76 0 5z"/>
          </svg>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs text-brand-text font-medium line-clamp-2 leading-relaxed">{product.name}</p>
        {product.price != null && (
          <p className="text-sm font-bold text-brand-text mt-1">
            ¥{product.price.toLocaleString()}
            {product.priceLabel && <span className="text-xs font-normal text-brand-gray-dark ml-0.5">{product.priceLabel}</span>}
          </p>
        )}
      </div>
    </Link>
  );
}
