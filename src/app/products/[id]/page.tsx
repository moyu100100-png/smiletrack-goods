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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0EA" }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #C4B9AB", borderTopColor: "#8B7355" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F5F0EA" }}>
        <p style={{ color: "#9B8E80" }}>商品が見つかりません</p>
        <button onClick={() => router.back()} className="text-sm" style={{ color: "#8B7355" }}>← 戻る</button>
      </div>
    );
  }

  const images = product.images ?? [];

  return (
    <div className="min-h-screen pb-32" style={{ background: "#F5F0EA" }}>
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 px-4 h-12 flex items-center" style={{ background: "rgba(245,240,234,0.92)", backdropFilter: "blur(8px)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm" style={{ color: "#4A4440" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
      </div>

      {/* 画像 */}
      {images.length > 0 && (
        <div>
          <div className="relative aspect-square" style={{ background: "#EDE8E0" }}>
            <Image src={images[imgIdx]} alt={product.name} fill className="object-contain" sizes="100vw" priority />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto" style={{ background: "#F5F0EA" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-colors"
                  style={{ border: i === imgIdx ? "2px solid #8B7355" : "2px solid transparent" }}>
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 商品情報 */}
      <div className="px-4 py-4 mx-4 mt-4 rounded-xl" style={{ background: "#FDFBF8", border: "0.5px solid rgba(0,0,0,0.07)" }}>
        {product.category && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-2" style={{ background: "#EDE8E0", color: "#8B7355" }}>{product.category}</span>
        )}
        <h1 className="text-base font-medium leading-snug" style={{ color: "#2C2C2A" }}>{product.name}</h1>

        <div className="my-4" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }} />

        {product.comment && (
          <div className="mb-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: "#4A4440" }}>{children}</p>,
                strong: ({ children }) => <strong className="font-semibold" style={{ color: "#2C2C2A" }}>{children}</strong>,
                ul: ({ children }) => <ul className="space-y-1 mb-3">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm" style={{ color: "#4A4440" }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "#8B7355" }}>✓</span>
                    <span>{children}</span>
                  </li>
                ),
              }}
            >
              {product.comment}
            </ReactMarkdown>
          </div>
        )}

        {product.price != null && (
          <div className="pt-4" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
            <p className="text-2xl font-medium" style={{ color: "#2C2C2A" }}>
              ¥{product.price.toLocaleString()}
              {product.priceLabel && <span className="text-sm font-normal ml-1" style={{ color: "#9B8E80" }}>{product.priceLabel}</span>}
            </p>
          </div>
        )}
      </div>

      {/* 購入ボタン（F案） */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex flex-col gap-2" style={{ background: "#F5F0EA", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
        {product.amazonUrl && (
          <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer"
            className="w-full rounded-xl py-4 text-sm font-medium text-center active:opacity-80 transition-opacity"
            style={{ background: "#8B7355", color: "#FDFBF8" }}>
            Amazonで探す
          </a>
        )}
        {product.rakutenUrl && (
          <a href={product.rakutenUrl} target="_blank" rel="noopener noreferrer"
            className="w-full rounded-xl py-4 text-sm font-medium text-center active:opacity-80 transition-opacity"
            style={{ background: "#EDE8E0", color: "#8B7355" }}>
            楽天市場で探す
          </a>
        )}
      </div>
    </div>
  );
}
