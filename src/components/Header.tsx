// src/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-brand-gray-mid px-4 h-12 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-blue rounded-md flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 1.5.82 2.81 2.04 3.5L4.5 11h5l-.54-2.5C10.18 7.81 11 6.5 11 5c0-2.21-1.79-4-4-4z" fill="white"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-brand-text tracking-tight">SmileTrack Goods</span>
      </Link>
      <span className="text-xs text-brand-gray-dark">by Sara</span>
    </header>
  );
}
