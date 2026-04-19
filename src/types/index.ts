// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number | null;
  priceLabel?: string; // e.g. "〜" suffix
  category: string;
  images: string[];      // array of download URLs
  comment: string;       // Markdown
  amazonUrl: string;
  rakutenUrl: string;
  collectionIds: string[];
  createdAt: { seconds: number };
  updatedAt?: { seconds: number };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  productIds: string[];
  createdAt: { seconds: number };
}

export const CATEGORIES = [
  "すべて",
  "洗浄剤",
  "フロス",
  "歯ブラシ",
  "歯磨き粉",
  "マウスウォッシュ",
  "ケース",
  "その他",
];
