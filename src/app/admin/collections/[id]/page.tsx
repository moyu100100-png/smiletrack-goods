"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCollection } from "@/lib/firebase";
import { Collection } from "@/types";
import CollectionForm from "@/components/CollectionForm";

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollection(id).then((c) => {
      setCollection(c as Collection | null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return <p className="text-center text-brand-gray-dark py-16">コレクションが見つかりません</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-brand-gray-dark">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-brand-text">コレクションを編集</h2>
      </div>
      <CollectionForm initial={collection} collectionId={id} />
    </div>
  );
}
