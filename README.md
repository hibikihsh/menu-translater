# Menu Translater

海外のメニューを日本語に翻訳することがでるサービス。

![CleanShot 2025-07-06 at 16 49 45@2x](https://github.com/user-attachments/assets/098994e3-1f00-494c-aa91-398007c5db9b)

## 技術スタック

- **フロントエンド**: Next.js (React + TypeScript)
- **デザインシステム**: shadcn/ui
- **画像解析**: OpenAI GPT-4 Vision
- **ホスティング**: Cloudflare Pages

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI API キーは [OpenAI Platform](https://platform.openai.com/) から取得できます。

### 3. 開発サーバーの起動

```bash
pnpm dev
```

## Cloudflare Pages へのデプロイ

### 1. GitHub リポジトリの準備

コードを GitHub リポジトリにプッシュします。

### 2. Cloudflare Pages での設定

1. Cloudflare Dashboard にログイン
2. Pages > Create a project > Connect to Git
3. リポジトリを選択
4. ビルド設定：
   - Framework preset: Next.js
   - Build command: `pnpm run pages:build`
   - Build output directory: `.next`
   - Node.js version: `18` または `20`

### 3. 環境変数の設定

Cloudflare Pages の設定で以下の環境変数を追加：

- `OPENAI_API_KEY`: OpenAI API キー

## 使用方法

### 基本的な流れ

1. **画像アップロード**: メニューの画像（JPG、PNG など）をアップロード
2. **AI 解析**: 「メニューを解析・翻訳」ボタンをクリックして AI による解析を実行
3. **内容確認**: 解析されたメニュー項目を確認・編集

### 対応言語

- **入力**: 英語、中国語、韓国語、フランス語、イタリア語、スペイン語など多言語対応
- **出力**: 日本語（料理説明付き）

### 解析可能なメニュー形式

- レストランメニュー
- カフェメニュー
- 手書きメニュー
- デジタルメニュー
- 多段組レイアウト
