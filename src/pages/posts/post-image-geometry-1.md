---
layout: ../../layouts/MarkdownPostLayout.astro
title: '情報幾何学の勉強'
pubDate: 2023-08-03
description: '自分の言葉で情報幾何学の勉強内容をまとめていく日記みたいなものです。'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'Astroのロゴ。'
tags: ["情報幾何学", "ブログ"]
---

# 情報幾何学とはなにか
この章については、情報幾何学についての勉強が一段落した時点で修正しようと思っていますが、とりあえず今のイメージを残しておきます。

情報幾何学は *確率分布の幾何学* と呼ばれています。
では確率分布の幾何学、とは何を指しているんでしょうか。

まず、確率分布とは確率変数がとりうる各値に確率を与えている関数を指します。
一次元の場合、横軸に確率変数が取る値を並べて、縦軸に確率をプロットするとその形状を確認することができます。

確率分布の形状は、式とハイパーパラメータ（ベクトル）で決まります。
多変量正規分布だと、正規分布の式、平均ベクトル $\bm{\mu}$ と共分散行列 $\mathbf{\Sigma}$ によって形状が完全に決定されます。

$p(\bm{x}) = (2\pi^k |\mathbf{\Sigma}|)^{-1/2} \exp\left(-1/2(\bm{x} - \bm{\mu})^\top \mathbf{\Sigma}^{-1} (\bm{x} - \bm{\mu})\right)$

ここで、確率分布を空間に配置することを考えます。
空間に配置することで、確率分布間でAとBのほうが、AとCより近い、みたいな幾何的な構造を直感的にとらえることができます。
そのためには、確率分布間の距離を考える必要がありそうです。

単純な考えとして、確率分布を決定しているハイパーパラメータをユークリッド空間に配置するという方法があります。
しかし、各々の分布でパラメータの次元は違っているだろうし、式が異なればパラメータの近さは分布の近さと合致しないので、この案は良くないとわかります。

一方、各確率値（測度）の比率を対数取って積分するKullback–Leibler (KL) ダイバージェンスが、確率分布間の差異を測る指標として有名です。
KLダイバージェンスは確率分布の幾何学を論ずるための道具として有力候補ですが、厳密には距離ではない（距離の三公理、三角不等式を満たさない）ので、局所性などいろいろ考える必要がありそうです。

情報幾何学では、多様体の理論と双対アファイン接続という道具を使うことで、確率分布の幾何学をきれいに定式化します。

情報幾何学は、統計学、 情報理論、物理学など幅広い分野で応用されていて、確率分布を扱う分野ならまず役に立つと思います。


# 参考書
以下の三冊。

甘利先生の書かれた参考書は、直感的な説明が多く全体像を知る上では役に立つのですが、若干の知識がいるためほかの参考書で鳴らしてから読んでいこうと思います。

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4320114515&linkId=4445427f50f39ebc25718750937cb1e6"></iframe>

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4781914632&linkId=9a2d6f3eeb4df5c7c8ce684866d0e367"></iframe>

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4320114450&linkId=5be78b5f1d662d75a897509ea526788f"></iframe>

# 事前準備
情報幾何学の話に入る前に、いろいろな基礎知識が必要になります。
そんなに詳しくはやらないつもりでざっくりと。

でも多様体の知識は必要になってくるかと思います。

## 双対空間
まずは、双対空間について、これは後で双対アファイン接続を論ずるときに使います。


$V$ を $\mathbb{R}$ 上の有限次元線形空間とします（基底が有限個）。

このとき、$V$ から $\mathbb{R}$ への線形写像を、$V$ 上の線形汎関数といいます。
つまり、$f: V \rightarrow \mathbb{R}$ ということ。
その全体集合を $V^\star$ と書きます。

$f, g \in V^\star$ と $a, b \in \mathbb{R}$ に対して、和とスカラー積を以下のように定義します。

$$
(af + bg)(\bm{x}) := af(\bm{x}) + bg(\bm{x}) \in \mathbb{R},\quad \bm{x} \in V
$$

そうすると、前半の $af + bg$ は $\bm{x}$ から $\mathbb{R}$ への線形写像ととらえることができるので、この線形関数は和とスカラー積について閉じていることになり、 $V^\star$ もまた線形空間としてとらえることができます。

この $V^\star$ を $V$ に対する *双対空間* といいます。  

<br>

次に、$V^\star$ の基底を見つける方法を見ていきます。

$f^i, i=1,\dots,n$を、$V$ の基底ベクトルの第$i$成分を取り出す写像であると定義します。
つまり、$V$ は$n$次元で基底の一つを $\{\bm{e}_1, \dots, \bm{e}_n\}$ とし、各$i=1,\dots,n$ に対して

$$
f^i(\bm{e}_j)=\delta_j^i, \quad (\forall j=1,\dots,n)
$$

のように $f^i$ を定めます。ここで $\delta_j^i$ はクロネッカーのデルタで、$i$ と $j$ が一致したときに1、それ以外で0を取る関数です。

このように定義された $f^i$ は一般のベクトル $\bm{x} \in V$ について適用しても、その第 $i$ 成分を取り出すように機能します。
実際、

TODO: $f^i$ が線形写像であることの説明。

$$
\begin{align}
f^i(\bm{x}) &= f^i\left(\sum_{j=1}^n x_j \bm{e}_j\right) \nonumber \\
&= x_i \sum_{j=1}^n f^i(\bm{e}_j) = x_i \nonumber
\end{align}
$$

