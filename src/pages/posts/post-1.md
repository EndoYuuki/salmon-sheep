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

## まとめ
やりたいことを説明します。

1. ローカルでAstroソースコードを編集して、localhost上で動作確認などを行う
1. GitHubへ作業ブランチをpushする
1. 良ければ作業ブランチをmainブランチにマージする
1. GitHub Actionsを使って、mainの変更をさくらレンタルサーバーに反映する


このために行ったことをまとめていきます。

- Astroとは
- さくらレンタルサーバーの環境構築
- Astroの導入
- Github Actionsの設定


## Astroとは
Astroは静的なHTML生成を行うフレームワークで、ビルド時にJavaScriptを排除し、HTMLとCSSを生成することができます。

これによって、レスポンスの早いウェブサイトを簡単に作ることができるようになっています。

https://astro.build/

あと、個人的にはCUIがかわいかったり、チュートリアルが豊富である、といった利点があると感じました。

## さくらレンタルサーバーの環境構築
レンタルサーバーにはいくつかの候補があると思いますが、私はさくらレンタルサーバーのスタンダードプランを契約しています。

https://www.sakura.ad.jp/

以下で、契約後にやった初期設定をまとめていきたいと思います。


ローカルの環境は、WSL2 (Ubuntu 20.04 LTS.) で動作確認しています。

### さくらレンタルサーバーへのSSHアクセス
さくらレンタルサーバーでは初期設定でFTPによるアクセスが可能です。

まずは、サーバーコントロールパネルにアクセスします。

https://secure.sakura.ad.jp/rs/cp/


サーバー情報 > サーバー情報を開くと、「FTP設定情報」を見ることができます。

ここで、FTPサーバーのURLとアカウント名、パスワードを確認します。
（パスワードは契約時にメールで送られたものになっているはず）


FTPで毎回アクセスするよりも後々のためにSSHでアクセスできるように設定しておきます。


まずは、公開鍵と秘密鍵のペアを作ります。
すでに用意してある場合はこのステップは飛ばしてもかまいません。

```bash
 ssh-keygen -t ed25519 -C "your_email@example.com"
```

保存先やパスフレーズの設定を聞かれるので、適当に対応して鍵を生成します。


それでは、出来上がった公開鍵をサーバーに置きに行きましょう。

適当なFTPクライアントを使って、FTPサーバーにアクセスします。

(on host)
```bash
 lftp FTP_SERVER_URL
```

そしてリモート上でSSHの設定を行います。

(on remote)
```bash
 mkdir ~/.ssh && chmod 700
 echo HOST_PUBKEY >> ~/.ssh/authorized_keys
 chmod 600 ~/.ssh/authorized_keys
```

これで、さくらレンタルサーバーにsshアクセスができるようになりました～


## Astroの導入
ローカルの環境に、Astroを導入していきます。

Astroには、Node.jsとnpmが必要です。
まずはそいつらを導入していきましょう。

aptでNode.jsとnpmをインストールすると、古いバージョンがインストールされてしまいます。Astroは割と新しいバージョンのNode.jsを必要とするので、バージョンアップが必要になります。

とはいえ、バージョンアップをするnというソフトもNode.jsを必要とするので、一旦古いバージョンのNode.jsとnpmをインストールしてからnを使って新しいバージョンを再インストールする形になります。

```bash
 sudo apt install npm nodejs # anyway install npm and nodejs, but they are old for Astro
 node -V                    # confirm the version
 npm -V
 sudo npm install -g n		# n is a package management application for npm
 sudo n stable				# update npm and nodejs to stable version
 sudo apt purge nodejs npm && sudo apt autoremove	# purge older versions
```

ここで、コマンドラインから一度ログアウトして、新しい端末を開きます。

そして、以下でバージョンが変わっていることを確認します。

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

デプロイします。
```bash
npm run dev
```

この状態で、適当なブラウザでhttp://localhost:3000 を見に行くと、Astroが生成したウェブサイトを見ることができます。

既存のAstroプロジェクトがあるときは、次のようにします。
```bash
npm install
npm run dev
```


## GitHub Actionsの設定
ローカルで、Astroウェブサイトの動作を確認したのち、GitHubへpushしたものを自動的にさくらレンタルサーバーにデプロイするGitHub Actionsを設定しようと思います。

早速ですが、出来上がったワークフローはこちらになります。

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

これを `/.github/workflows/astro.yml` という場所に保存します。

このワークフローでは、FTPサーバーのURLやユーザ名、パスワードはActions secretsを参照しています。
これは、GitHubに機密情報を安全に登録しておき、Actionsがそれを必要に応じて参照する仕組みです。

設定方法は、リポジトリのSettingsを開き、Securityの **Secrets and variables** から **Actions** を開きます。

**New repository secret** を押したら、各変数を登録することができます。

今回の場合は、

- FTP_SERVER
- FTP_ACCOUNT
- FTP_PASSWORD

を登録します。


これで、ワークフローが動いたときに、プロジェクトをビルドしてFTPサーバーにアップロードするCIが完成しました。


## そのあと
公式のチュートリアルを参考にします。

今後の開発はこれをもとにいろいろ改変していくことになるのかなと思います。

https://docs.astro.build/ja/tutorial/0-introduction/
