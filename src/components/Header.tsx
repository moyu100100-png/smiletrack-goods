// src/components/Header.tsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-brand-gray-mid px-4 h-12 flex items-center">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon.png" alt="SmileTrack" width={28} height={28} className="rounded-lg" />
        <span className="text-sm font-semibold text-brand-text tracking-tight">SmileTrack</span>
      </Link>
    </header>
  );
}
