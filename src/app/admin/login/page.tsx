"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/products");
    } catch {
      setError("メールアドレスまたはパスワードが間違っています");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C9.24 2 7 4.24 7 7c0 2.07 1.18 3.87 2.9 4.79L9 17h6l-.9-5.21C15.82 10.87 17 9.07 17 7c0-2.76-2.24-5-5-5z"/>
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-brand-text mb-1">管理者ログイン</h1>
        <p className="text-xs text-brand-gray-dark mb-6">SmileTrack Goods 管理画面</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-brand-gray-dark mb-1 block">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-gray-mid rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-blue transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-dark mb-1 block">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-brand-gray-mid rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-blue transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-brand-blue text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60 transition-opacity"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}
