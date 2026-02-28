# Noir CSS Framework

ユーティリティファーストのダークテーマCSSフレームワーク。
レッド/オレンジのアクセントカラーを持つクールなデザインシステムです。

## 特徴

- ユーティリティファースト設計
- ダーク / ライトテーマ切り替え対応
- 5段階レスポンシブ対応 (`xs` / `sm` / `md` / `lg` / `xl`)
- モジュール分割構成（必要なモジュールだけ読み込み可能）
- JavaScript不要（純粋なCSS）

## インストール

```bash
git clone https://github.com/kakuteki/Noir.git
```

HTMLファイルからCSSを読み込みます。

```html
<!-- 全モジュール一括 -->
<link rel="stylesheet" href="css/noir.css">

<!-- 必要なモジュールだけ個別に読み込む場合 -->
<link rel="stylesheet" href="css/modules/base.css">
<link rel="stylesheet" href="css/modules/layout.css">
```

## 基本的な使い方

### テーマ切り替え

```html
<!-- ダークテーマ（デフォルト） -->
<html data-theme="dark">

<!-- ライトテーマ -->
<html data-theme="light">

<!-- OS設定に自動追従 -->
<html>
```

### レイアウト

```html
<!-- コンテナ -->
<div class="container">...</div>

<!-- グリッド（レスポンシブ） -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- フレックス -->
<div class="flex justify-between items-center gap-4">
  <span>Left</span>
  <span>Right</span>
</div>
```

### ボタン

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-warm">Warm</button>
<button class="btn btn-danger">Danger</button>

<!-- サイズ -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### カード

```html
<div class="card card-hover">
  <div class="card-header">Header</div>
  <div class="card-body">
    <p class="text-secondary">Content goes here.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>
```

### フォーム

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="input" placeholder="you@example.com">
  <span class="form-hint">Hint text</span>
</div>

<label class="checkbox"><input type="checkbox"> Option</label>
<label class="toggle"><input type="checkbox"> Toggle</label>
```

### アラート・バッジ

```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-error">Error message</div>

<span class="badge badge-accent">Label</span>
<span class="badge badge-success">Active</span>
```

### ユーティリティクラス

```html
<!-- スペーシング -->
<div class="p-4 m-2 mt-8 px-6">...</div>

<!-- テキスト -->
<p class="text-lg font-bold text-accent">Styled text</p>
<p class="text-sm text-muted truncate">Truncated text...</p>

<!-- 背景・ボーダー・シャドウ -->
<div class="bg-secondary border rounded-lg shadow-lg">...</div>

<!-- レスポンシブ -->
<div class="hidden md:flex lg:grid-cols-4">...</div>
```

## モジュール一覧

| ファイル | 内容 |
|---|---|
| `base.css` | CSS変数、リセット、テーマシステム |
| `typography.css` | フォント、テキストユーティリティ |
| `layout.css` | グリッド、フレックス、スペーシング、レスポンシブ |
| `forms.css` | 入力、セレクト、チェックボックス、トグル |
| `components.css` | ボタン、カード、バッジ、アラート、モーダル |
| `navigation.css` | ナビバー、サイドバー、タブ、パンくずリスト |

## デモ

`index.html` をブラウザで開くと全コンポーネントを確認できます。

## ライセンス

[Apache License 2.0](LICENSE)
