"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProduct } from "@/lib/firebase";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id).then((p) => {
      setProduct(p as Product | null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center gap-4">
        <p className="text-brand-gray-dark">商品が見つかりません</p>
        <button onClick={() => router.back()} className="text-brand-blue text-sm">← 戻る</button>
      </div>
    );
  }

  const images = product.images ?? [];

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-brand-gray-mid px-4 h-12 flex items-center">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-brand-text">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      {images.length > 0 && (
        <div>
          <div className="relative aspect-square bg-brand-gray">
            <Image src={images[imgIdx]} alt={product.name} fill className="object-contain" sizes="100vw" priority />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === imgIdx ? "border-brand-blue" : "border-transparent"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-4">
        {product.category && (
          <span className="inline-block bg-brand-blue-light text-brand-blue text-xs px-2 py-0.5 rounded-full mb-2">{product.category}</span>
        )}
        <h1 className="text-base font-semibold text-brand-text leading-snug">{product.name}</h1>

        <div className="border-t border-brand-gray-mid my-4" />

        {/* Comment */}
        {product.comment && (
          <div className="prose prose-sm max-w-none text-brand-text-soft mb-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-brand-text">{children}</strong>,
                ul: ({ children }) => <ul className="space-y-1 mb-3">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-brand-blue mt-0.5 flex-shrink-0">✓</span>
                    <span>{children}</span>
                  </li>
                ),
              }}
            >
              {product.comment}
            </ReactMarkdown>
          </div>
        )}

        {/* Price - after comment */}
        {product.price != null && (
          <div className="border-t border-brand-gray-mid pt-4">
            <p className="text-2xl font-bold text-brand-text">
              ¥{product.price.toLocaleString()}
              {product.priceLabel && <span className="text-sm font-normal text-brand-gray-dark ml-1">{product.priceLabel}</span>}
            </p>
          </div>
        )}
      </div>

      {/* Fixed CTA buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gray-mid p-4 flex flex-col gap-2">
        {product.amazonUrl && (
          <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer"
            className="w-full bg-amazon text-white rounded-xl py-3.5 text-sm font-semibold text-center active:opacity-80 transition-opacity flex items-center justify-center gap-2">
            Amazonで探す
          </a>
        )}
        {product.rakutenUrl && (
          <a href={product.rakutenUrl} target="_blank" rel="noopener noreferrer"
            className="w-full bg-rakuten text-white rounded-xl py-3.5 text-sm font-semibold text-center active:opacity-80 transition-opacity flex items-center justify-center gap-2">
            楽天市場で探す
          </a>
        )}
      </div>
    </div>
  );
}
