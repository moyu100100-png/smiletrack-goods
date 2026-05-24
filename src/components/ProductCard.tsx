"use client";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link href={`/products/${product.id}`} className="block active:scale-[0.98] transition-transform">
      <div className="rounded-xl overflow-hidden" style={{ background: "#FDFBF8", border: "0.5px solid rgba(0,0,0,0.07)" }}>
        <div className="relative aspect-square" style={{ background: "#EDE8E0" }}>
          {img ? (
            <Image src={img} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#C4B9AB">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#4A4440" }}>{product.name}</p>
          {product.price != null && (
            <p className="text-sm mt-1" style={{ color: "#8B7355" }}>
              ¥{product.price.toLocaleString()}
              {product.priceLabel && <span className="text-xs ml-1" style={{ color: "#9B8E80" }}>{product.priceLabel}</span>}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
