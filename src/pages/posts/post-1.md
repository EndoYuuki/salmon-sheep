---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Astroの導入とブログの構築'
pubDate: 2023-08-02
description: 'Astroを使ったブログ構築について、最初の投稿としてまとめておきたいと思います。'
image:
    url: 'https://docs.astro.build/assets/full-logo-dark.png'
    alt: 'Astroのロゴ。'
tags: ["astro", "GitHub Actions"]
---
## 参考
https://docs.astro.build/ja/tutorial/0-introduction/

## 概要
自分のウェブサイトを作りたいな～と考えて調べてみると、どうやらAstroというものが流行りらしい。
私はウェブサイト作成に関する知識は少ないので、Astroのチュートリアルを進めつつ、ブログなどを運営する枠組みを作ってしまおうと思います。

ゴールとしては次のような流れで開発できる枠組みを考えています。

1. ローカルでソースコードを編集して、localhost上で動作確認を行う
1. GitHubへ作業ブランチをpushする
1. 作業ブランチをmainブランチにマージする
1. GitHub Actionsを通して、Astroがビルドされ、さくらレンタルサーバーに変更が反映される


本ページではメモのために次のことをまとめておきます。

- Astroとは
- さくらレンタルサーバーの環境構築
- Astroの導入
- Github Actionsの設定

ローカルの環境は、WSL2 (Ubuntu 20.04 LTS.) で動作確認しています。

## Astroとは
Astroは静的なHTML生成を行うフレームワークで、ビルド時にJavaScriptの動作からHTMLとCSSを生成することを可能にします。
これによって、レスポンスの早いウェブサイトを簡単に作ることができるようです。

公式サイト↓

https://astro.build/

もう一つ導入の大きな利点として、Markdownが簡単にHTMLに変換される仕組みを持っていることが挙げられます。
なので、ブログなどを書く際にはとてもいい選択だと思います。

## さくらレンタルサーバーの環境構築
ウェブサイトを動作させるためのサーバーをレンタルします。

レンタルサーバーにはいくつかの候補があると思いますが、私はさくらレンタルサーバーのスタンダードプランを契約しています。

https://www.sakura.ad.jp/

以下で、契約後にやった初期設定をまとめていきたいと思います。


### さくらレンタルサーバーへのSSHアクセス
さくらレンタルサーバーでは初期設定でFTPによるアクセスが可能です。

まずは、サーバーコントロールパネルにアクセスします。

https://secure.sakura.ad.jp/rs/cp/


`サーバー情報 > サーバー情報`を開くと、「FTP設定情報」を見ることができます。

ここで、FTPサーバーのURLとアカウント名、パスワードを確認します。
（初期パスワードは契約時にメールで送られたものになっています）

これで適当なFTPクライアントから、さくらレンタルサーバー上のFTPサーバーにアクセスできるようになりました。

(on host)
```bash
lftp FTP_SERVER_URL
...
```

しかし、FTPよりもSSHアクセスできた方が、後々の開発には便利な気がしたのでSSHの設定を行っていきます。

まずは、公開鍵と秘密鍵のペアを作ります。
すでに用意してある場合はこのステップは飛ばしてもかまいません。
（暗号方式は好きなものを選んでください）

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

保存先やパスフレーズの設定を聞かれるので、適当に対応して鍵を生成します。

それでは、出来上がった公開鍵をサーバーに置きに行きましょう。

lftpなどの適当なFTPクライアントからFTPサーバーへアクセスします。

(on host)
```bash
lftp FTP_SERVER_URL
```

次にリモート上でSSHの公開鍵を設定します。

(on remote)
```bash
mkdir ~/.ssh && chmod 700
echo HOST_PUBKEY >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

実際に接続できるかを確認します。

(on host)
```bash
ssh USERNAME@FTP_SERVER_URL
```

これで、さくらレンタルサーバーにsshアクセスができるようになりました～


## Astroの導入
まずは、デバッグ用でローカル環境にAstroを導入していきます。
Astroの動作には **Node.js** と **npm** が必要です。まずはそいつらを導入していきましょう。
  
<br>

しかし、apt で Node.js と npm をインストールすると、古いバージョンがインストールされてしまいます。Astroは割と新しいバージョンのNode.jsを必要とするので、バージョンアップが必要になります。

とはいえ、バージョンアップをする **n** というソフトも Node.js を必要とするので、一旦古いバージョンの Node.js と npm をインストールしてから n を使って新しいバージョンお Node.js、npm をインストールして古いものを削除する方針にします。

```bash
 sudo apt install npm nodejs
 node -V                    
 npm -V
 sudo npm install -g n
 sudo n stable				
 sudo apt purge nodejs npm && sudo apt autoremove
```

ここで、コマンドラインから一度ログアウトして、新しい端末を開きます。そして、以下でバージョンが変わっていることを確認します。

```bash
 node -v
 npm -v
```

これで、Astroを導入する準備はできました。
以下のコマンドで、Astroを導入します。

```bash
npm create astro@latest
```

プロジェクトの名前とか色々聞かれます。
適当に答えると、プロジェクトに必要なファイルが生成されます。

次のコマンドでプロジェクトをビルドします。
```bash
npm run dev
```

この状態で、適当なブラウザでhttp://localhost:3000 を見に行くと、Astroが生成したウェブサイトを見ることができます。

<br>

既存のAstroプロジェクトがあるときは、次のようにして依存関係のインストールとビルドを実行します。
```bash
npm install
npm run dev
```


## GitHub Actionsの設定
ローカルで、Astroウェブサイトの動作を確認したのち、GitHubへpushしたものを自動的にさくらレンタルサーバーにデプロイするGitHub Actionsを設定します。

早速ですが、出来上がったワークフローはこちらになります。

まず、npm の依存関係のインストール、ビルドをして、htmlやcssを生成します。
次に、出来上がったものをさくらレンタルサーバーへアップロードしています。

```yaml
 # Sample workflow for building and deploying an Astro site to GitHub Pages
 #
 # To get started with Astro see: https://docs.astro.build/en/getting-started/
 #
 name: Deploy Astro site to Pages
 
 on:
   # Runs on pushes targeting the default branch
   push:
     branches: ["main"]
 
 jobs:
   build:
     name: Build
     runs-on: ubuntu-latest
     steps:
       - name: Checkout
         uses: actions/checkout@v3
       - name: Use Node.js 18
         uses: actions/setup-node@v2
         with:
           node-version: '18'
       - name: Build Project
         run: |
           npm install
           npm run build
       - name: Sync files
         uses: SamKirkland/FTP-Deploy-Action@4.0.0
         with:
           server: ${{ secrets.FTP_SERVER }}
           username: ${{ secrets.FTP_ACCOUNT }}
           password: ${{ secrets.FTP_PASSWORD }}
           local-dir: ./dist/
           server-dir: /home/${{ secrets.FTP_ACCOUNT }}/www/
```

これを *.github/workflows/astro.yml* という場所に保存します。

<br>

各ステップについて軽く説明します。

<br>

#### Checkout
mainブランチの最新版へチェックアウトします。

```yaml
- name: Checkout
  uses: actions/checkout@v3
```

#### Node.jsのインストール
Astroが動く、Node.js の 18 をセットアップします。
```yaml
- name: Use Node.js 18
  uses: actions/setup-node@v2
  with:
    node-version: '18'
```

#### Astroのデプロイ
ローカルでもやった、依存関係のインストールとAstroのビルドを行います。

```yaml
- name: Build Project
  run: |
    npm install
    npm run build
```

#### FTPサーバーへアップロード
FTPサーバー（さくらレンタルサーバー）へ成果物であるHTMLやCSSをアップロードします。


```yaml
- name: Sync files
  uses: SamKirkland/FTP-Deploy-Action@4.0.0
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_ACCOUNT }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./dist/
    server-dir: /home/${{ secrets.FTP_ACCOUNT }}/www/
```

このワークフローでは、FTPサーバーのURLやユーザ名、パスワードはActions secretsを参照しています。
これは、GitHubに機密情報を安全に登録しておき、Actionsがそれを必要に応じて参照する仕組みです。

設定方法は、リポジトリのSettingsを開き、Securityの *Secrets and variables* から *Actions* を開き、
*New repository secret* を押して各変数を登録します。

<br>

今回の場合は、
- FTP_SERVER
- FTP_ACCOUNT
- FTP_PASSWORD

を登録します。
これで、FTPサーバーに各変数の値を使ってログインし、生成物をアップロードしてくれます。


## そのあと
公式のチュートリアルを参考にします。

今後の開発はこれをもとにいろいろ改変していくことになるのかなと思います。

https://docs.astro.build/ja/tutorial/0-introduction/

<br>

このウェブサイトを作る際のノウハウはもう少しありますが、それはまた別のページでまとめようと思います。
**Tailwind CSS** とか。
