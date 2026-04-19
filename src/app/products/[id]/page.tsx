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
      {/* Back */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-brand-gray-mid px-4 h-12 flex items-center">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-brand-text">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div>
          <div className="relative aspect-square bg-brand-gray">
            <Image
              src={images[imgIdx]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === imgIdx ? "border-brand-blue" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-4">
        {/* Category badge */}
        {product.category && (
          <span className="inline-block bg-brand-blue-light text-brand-blue text-xs px-2 py-0.5 rounded-full mb-2">
            {product.category}
          </span>
        )}

        {/* Name */}
        <h1 className="text-base font-semibold text-brand-text leading-snug">{product.name}</h1>

        {/* Price */}
        {product.price != null && (
          <p className="text-xl font-bold text-brand-text mt-2">
            ¥{product.price.toLocaleString()}
            {product.priceLabel && <span className="text-sm font-normal text-brand-gray-dark ml-1">{product.priceLabel}</span>}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-brand-gray-mid my-4" />

        {/* Comment */}
        {product.comment && (
          <div className="prose prose-sm max-w-none text-brand-text-soft">
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
      </div>

      {/* Fixed CTA buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gray-mid p-4 flex flex-col gap-2">
        {product.amazonUrl && (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amazon text-white rounded-xl py-3.5 text-sm font-semibold text-center active:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M13.23 10.56v-.18c-.93.01-1.91.2-1.91 1.29 0 .55.29.93.77.93.36 0 .68-.22.88-.58.24-.44.26-.85.26-1.46zm2.17 3.36c-.11.1-.28.11-.41.04-.58-.48-.68-.7-1-1.15-1 1.01-1.7 1.31-2.99 1.31-1.52 0-2.71-.94-2.71-2.82 0-1.47.8-2.47 1.93-2.96 1-.43 2.38-.51 3.43-.63v-.24c0-.43.03-.94-.22-1.31-.22-.33-.63-.47-1-.47-.68 0-1.29.35-1.44.107-.07.29-.27.9-.93.9-.37 0-.73-.26-.74-.77 0-.84.92-1.47 2.22-1.47 1 0 2.3.27 3.09 1.02.1.1.2.21.29.32.09-.09.19-.18.32-.32.28-.25.48-.47.48-.47.18.19.37.38.56.57l-1.13 1.13c.27.36.38.78.38 1.24v4.23c0 .41.17.59.33.71l-1.46 1.18zm5.13 2.26C18.31 18.04 15.31 19 12.44 19c-4.08 0-7.75-1.51-10.53-4.02-.22-.2-.02-.46.24-.31C5.01 16.35 8.16 17.3 11.42 17.3c2.64 0 5.54-.55 8.2-1.68.4-.17.74.26.91.5zM21.46 15.42c-.29-.38-1.95-.18-2.7-.09-.23.03-.26-.17-.06-.32 1.32-.93 3.49-.66 3.74-.35.26.32-.07 2.48-1.31 3.51-.19.16-.37.07-.29-.14.28-.71.91-2.23.62-2.61z"/>
            </svg>
            Amazonで探す
          </a>
        )}
        {product.rakutenUrl && (
          <a
            href={product.rakutenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-rakuten text-white rounded-xl py-3.5 text-sm font-semibold text-center active:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-5h2v5zm0-7h-2V7h2v2z"/>
            </svg>
            楽天市場で探す
          </a>
        )}
      </div>
    </div>
  );
}
