"use client";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-brand-gray-dark">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-brand-text">商品を追加</h2>
      </div>
      <ProductForm />
    </div>
  );
}
