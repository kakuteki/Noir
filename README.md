# Noir

A utility-first dark theme CSS framework with bold accent colors.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-brightgreen.svg)](https://kakuteki.github.io/Noir/)
![CSS Size](https://img.shields.io/badge/size-~67KB-orange.svg)

## Features

- **Utility-first design** — compose layouts and styles with low-level utility classes
- **Dark / Light theme** — switch themes via `data-theme` attribute or auto-follow OS preference
- **5 responsive breakpoints** — `xs` / `sm` / `md` / `lg` / `xl`
- **Modular architecture** — load only the modules you need
- **No JavaScript required** — pure CSS, zero runtime dependencies
- **Lightweight (~67KB)** — full framework unminified
- **`prefers-reduced-motion` support** — respects user accessibility settings

## Why Noir?

| | Noir | Tailwind CSS | Bootstrap |
|---|---|---|---|
| Philosophy | Utility-first | Utility-first | Component-first |
| Default theme | Dark | Light | Light |
| JavaScript | None | None (core) | Required |
| File size | ~67KB | ~300KB+ | ~200KB+ |
| Build step | Not required | Required (PostCSS) | Optional |
| Dark mode | Built-in (`data-theme`) | Class-based (`dark:`) | `data-bs-theme` (v5.3+) |
| Learning curve | Low | Medium | Medium |
| Customization | CSS variables | tailwind.config.js | Sass variables |

**Noir is ideal when you want:**
- A dark-first design without extra configuration
- A lightweight framework with no build tools or JS dependencies
- Quick prototyping with utility classes and ready-made components

## Quick Start

```bash
git clone https://github.com/kakuteki/Noir.git
```

```html
<!-- Load the full framework -->
<link rel="stylesheet" href="css/noir.css">

<!-- Or load individual modules -->
<link rel="stylesheet" href="css/modules/base.css">
<link rel="stylesheet" href="css/modules/layout.css">
```

## Usage

### Theme Switching

```html
<!-- Dark theme (default) -->
<html data-theme="dark">

<!-- Light theme -->
<html data-theme="light">

<!-- Auto-follow OS preference -->
<html>
```

### Layout / Grid

```html
<!-- Container -->
<div class="container">...</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Flexbox -->
<div class="flex justify-between items-center gap-4">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-warm">Warm</button>
<button class="btn btn-danger">Danger</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards

```html
<div class="card card-hover">
  <div class="card-header">Header</div>
  <div class="card-body">
    <p class="text-secondary">Content goes here.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>
```

### Forms

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="input" placeholder="you@example.com">
  <span class="form-hint">Hint text</span>
</div>

<label class="checkbox"><input type="checkbox"> Option</label>
<label class="toggle"><input type="checkbox"> Toggle</label>
```

## Documentation

- [Demo](https://kakuteki.github.io/Noir/) — Live preview of all components
- [Class Reference](https://kakuteki.github.io/Noir/reference.html) — Complete list of all utility classes

## Modules

| File | Description |
|---|---|
| `base.css` | CSS variables, reset, dark/light theme system |
| `typography.css` | Font sizes, weights, alignment, text utilities |
| `layout.css` | Grid, flexbox, spacing, responsive breakpoints (xs/sm/md/lg/xl) |
| `forms.css` | Input, select, checkbox, radio, toggle, range |
| `components.css` | Buttons, cards, badges, alerts, modal, tooltip, table, spinner, toast, accordion, skeleton |
| `navigation.css` | Navbar, sidebar, tabs, breadcrumb, pagination, dropdown |
| `utilities.css` | Transform utilities |
| `animations.css` | Fade, slide, pulse, spin, bounce, ping animations |

## Browser Support

| Browser | Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |

## License

[Apache License 2.0](LICENSE)

---

## 日本語

Noir はユーティリティファーストのダークテーマ CSS フレームワークです。
ダーク／ライトテーマの切り替え、5段階のレスポンシブ対応、モジュール分割構成を備えており、JavaScript 不要で動作します。
詳しい使い方は上記の英語セクションをご覧ください。デモは [GitHub Pages](https://kakuteki.github.io/Noir/) で確認できます。
