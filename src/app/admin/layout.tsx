"use client";
import { useState, useEffect } from "react";
import { getCategories, saveCategories } from "@/lib/firebase";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  function addCategory() {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setNewCat("");
  }

  function removeCategory(cat: string) {
    setCategories((prev) => prev.filter((c) => c !== cat));
  }

  async function handleSave() {
    setSaving(true);
    await saveCategories(categories);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-base font-semibold text-brand-text mb-4">カテゴリー管理</h2>

      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="flex gap-2 mb-4">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            className="flex-1 border border-brand-gray-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
            placeholder="新しいカテゴリー名"
          />
          <button
            onClick={addCategory}
            className="bg-brand-blue text-white px-4 rounded-xl text-sm font-medium"
          >
            追加
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-xs text-brand-gray-dark">カテゴリーがありません</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between py-2 border-b border-brand-gray-mid last:border-0">
                <span className="text-sm text-brand-text">{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-lg"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-brand-blue text-white rounded-xl py-4 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
      </button>
    </div>
  );
}
