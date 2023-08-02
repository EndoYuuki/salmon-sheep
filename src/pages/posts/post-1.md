---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Astroの導入とブログの構築'
pubDate: 2023-08-02
description: 'Astroを使ったブログ構築について、最初の投稿としてまとめておきたいと思います。'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'Astroのロゴ。'
tags: ["astro", "ブログ"]
---
## 参考
https://docs.astro.build/ja/tutorial/0-introduction/

## まとめ

1. **Astroのインストール**: 新しいAstroプロジェクトを作成しました。

2. **ページの作成**: 新しい`.astro`ファイルを作成し、Markdown形式でブログを投稿できるようにしました。

## Astroの導入
```bash
npm create astro@latest
```
プロジェクトの名前とか色々聞かれます。

デプロイします。
```bash
npm run dev
```

既存のAstroプロジェクトがあるときは、次のようにします。
```bash
npm install
npm run dev
```

## そのあと
以下を見ておけば間違いないので、これ以上の説明は必要なさそうだと思います。

https://docs.astro.build/ja/tutorial/0-introduction/

とりあえず、最初の投稿をしたかったので内容が薄いです。

今後Astroのtipsとかも追加していくかもしれないです。

