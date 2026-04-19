# SmileTrack Goods サイト

マウスピース矯正アプリ「SmileTrack」ユーザー向けアフィリエイトサイトです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + Tailwind CSS
- **バックエンド/CMS**: Firebase (Firestore + Storage + Auth)
- **デプロイ**: Vercel

---

## セットアップ手順

### ① Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. 「プロジェクトを追加」→ 任意の名前（例: `smiletrack-goods`）
3. Google Analytics は任意（不要ならOFF）

### ② Firebase サービスを有効化

**Authentication**
1. コンソール左メニュー「Authentication」→「始める」
2. 「Sign-in method」タブ → 「メール/パスワード」を有効化
3. 「Users」タブ → 「ユーザーを追加」→ 自分のメールアドレスとパスワードを登録

**Firestore Database**
1. コンソール左メニュー「Firestore Database」→「データベースの作成」
2. 「本番環境モード」で作成（後でルールを設定）
3. リージョン: `asia-northeast1`（東京）を推奨
4. 「ルール」タブを開き、`firestore.rules` の内容をコピー＆保存

**Storage**
1. コンソール左メニュー「Storage」→「始める」
2. 「本番環境モード」で作成
3. 「ルール」タブを開き、`storage.rules` の内容をコピー＆保存

### ③ Firebaseアプリ登録 & 設定値取得

1. コンソール「プロジェクトの設定」（歯車アイコン）
2. 「アプリを追加」→「ウェブ」アイコン
3. アプリのニックネームを入力（例: `smiletrack-goods-web`）
4. 「Firebase Hosting」のチェックは**不要**（Vercelを使うため）
5. 表示される `firebaseConfig` の値を控える

### ④ 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` を開き、③で取得した値を入力:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smiletrack-goods.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smiletrack-goods
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smiletrack-goods.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### ⑤ ローカル起動

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

---

## Vercelデプロイ手順

### 1. GitHubにプッシュ

```bash
git init
git add .
git commit -m "initial commit"
# GitHubで新リポジトリを作成してプッシュ
git remote add origin https://github.com/あなたのユーザー名/smiletrack-goods.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. [vercel.com](https://vercel.com) にGitHubアカウントでサインイン
2. 「New Project」→ 先ほどのリポジトリをインポート
3. Framework Preset: `Next.js`（自動検出）
4. 「Environment Variables」に `.env.local` の内容をすべて追加
5. 「Deploy」をクリック

数分でデプロイ完了。URLが発行される。

---

## Firebaseで認証メールを制限（重要）

セキュリティのため、Firebase AuthのユーザーはコンソールのUsersタブから自分だけを追加し、
新規登録（サインアップ）は無効のままにしてください。
このコードは「ログイン」のみ実装しており、新規登録フォームはありません。

---

## ディレクトリ構造

```
src/
├── app/
│   ├── page.tsx                    # トップ（商品一覧・コレクション）
│   ├── products/[id]/page.tsx      # 商品詳細
│   ├── collections/[id]/page.tsx   # コレクション詳細
│   └── admin/
│       ├── layout.tsx              # 管理画面レイアウト（認証ガード）
│       ├── login/page.tsx          # ログイン
│       ├── products/               # 商品管理
│       └── collections/            # コレクション管理
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── CollectionCard.tsx
│   ├── ProductForm.tsx             # 商品追加・編集フォーム
│   └── CollectionForm.tsx          # コレクション作成・編集フォーム
├── lib/
│   ├── firebase.ts                 # Firebase初期化・CRUD関数
│   └── auth-context.tsx            # 認証Context
└── types/
    └── index.ts                    # 型定義・カテゴリ定数
```

---

## データ構造（Firestore）

### `products` コレクション

| フィールド | 型 | 説明 |
|---|---|---|
| name | string | 商品名 |
| price | number \| null | 参考価格 |
| priceLabel | string | 価格備考（"〜"など） |
| category | string | カテゴリー |
| images | string[] | 画像のダウンロードURL配列 |
| comment | string | Markdown形式のコメント |
| amazonUrl | string | AmazonアフィリエイトURL |
| rakutenUrl | string | 楽天アフィリエイトURL |
| collectionIds | string[] | 所属コレクションのID配列 |
| createdAt | Timestamp | 作成日時 |

### `collections` コレクション

| フィールド | 型 | 説明 |
|---|---|---|
| name | string | コレクション名 |
| description | string | 紹介文 |
| coverImage | string | カバー画像URL |
| productIds | string[] | 含まれる商品IDの配列 |
| createdAt | Timestamp | 作成日時 |

---

## カテゴリーの追加

`src/types/index.ts` の `CATEGORIES` 配列を編集してください。

```typescript
export const CATEGORIES = [
  "すべて",
  "洗浄剤",
  "フロス",
  // ← ここに追加
];
```

---

## SmileTrackアプリからの遷移URL

アプリ内でWebViewを開くか、SafariViewControllerを使って以下のURLに遷移させてください:

```
https://あなたのドメイン.vercel.app/
```

Amazon/楽天のボタンは `target="_blank"` で開くため、
アプリインストール済みの場合はOSがユニバーサルリンクとして処理し、
各アプリが直接起動します（追加実装不要）。
