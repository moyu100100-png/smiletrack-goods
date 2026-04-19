"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Admin header */}
      <header className="bg-white border-b border-brand-gray-mid px-4 h-12 flex items-center justify-between sticky top-0 z-20">
        <span className="text-sm font-semibold text-brand-text">管理画面</span>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-brand-blue">サイトを見る</Link>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-brand-gray-dark"
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* Admin nav */}
      <nav className="bg-white border-b border-brand-gray-mid px-4 flex gap-6">
        {[
          { href: "/admin/products", label: "商品" },
          { href: "/admin/collections", label: "コレクション" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`py-3 text-sm border-b-2 transition-colors ${
              pathname.startsWith(item.href)
                ? "border-brand-blue text-brand-blue font-medium"
                : "border-transparent text-brand-gray-dark"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
