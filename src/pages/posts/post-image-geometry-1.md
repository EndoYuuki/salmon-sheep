---
layout: ../../layouts/MarkdownPostLayout.astro
title: '情報幾何学の勉強 1'
pubDate: 2023-08-03
description: '自分の言葉で情報幾何学の勉強内容をまとめていく日記みたいなものです。'
image:
    url: ''
    alt: ''
tags: ["情報幾何学", "ブログ"]
---

## 情報幾何学とはなにか
この章は情報幾何学についての勉強が一段落した時点で修正しようと思っていますが、とりあえず今のイメージを残します。

<br>

情報幾何学は <u>確率分布の幾何学</u> と呼ばれています。
確率分布の幾何学、とは何を指しているんでしょうか？

まず確率分布とは、確率変数がとりうる値に確率を与えている関数を指します。
確率分布の形状は、確率分布を表す式とハイパーパラメータ（ベクトル）で決まります。
例えば多変量正規分布だと、正規分布の式、平均ベクトル $\bm{\mu}$ と共分散行列 $\mathbf{\Sigma}$ によって形状が決定されます。
<br>
<br>
$$
p(\bm{x}) = (2\pi^k |\mathbf{\Sigma}|)^{-1/2} \exp\left(-1/2(\bm{x} - \bm{\mu})^\top \mathbf{\Sigma}^{-1} (\bm{x} - \bm{\mu})\right)
$$
<br>
情報幾何学は、さまざまな確率分布の関係性をある空間上の配置から考えたい学問です。
このためには、確率分布間の距離を考える必要があります。
<br><br>
単純な考えとして、ハイパーパラメータをユークリッド空間に配置するという方法があります。
しかし、各々の分布でパラメータの次元は違っているだろうし、式が異なればパラメータの近さは分布の近さと合致しないので、この案は良くないとわかります。
一方で、Kullback–Leibler (KL) ダイバージェンスが確率分布間の差異を測る指標として有名です。KLダイバージェンスは確率分布の幾何学を議論できそうですが、厳密には距離ではなかったりと、いろいろ考える必要がありそうです。
<br><br><br>
情報幾何学では、多様体の理論と双対アファイン接続という道具を使うことで、確率分布の幾何学をきれいに定式化します。
情報幾何学は、統計学、 情報理論、物理学など幅広い分野で応用されていて、確率分布を扱う分野ならまず役に立つと思います。


## 参考書
以下の三冊を読んでいこうと思っています。

甘利先生の書かれた参考書は、直感的な説明が多く全体像を知る上では役に立つのですが、背景知識を必要とするため、ほかの参考書で鳴らしてから読んでいきます。

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4320114515&linkId=4445427f50f39ebc25718750937cb1e6"></iframe>

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4781914632&linkId=9a2d6f3eeb4df5c7c8ce684866d0e367"></iframe>

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=salmonsheep-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4320114450&linkId=5be78b5f1d662d75a897509ea526788f"></iframe>

## 事前準備
情報幾何学の話に入る前に、いろいろな基礎知識が必要になります。
そんなに詳しくはやらないつもりですが、ざっくりと。
必要があれば、章を分けてまとめていこうと思います。

このページでは、双対空間とテンソルについて、必要な知識だけまとめようと思います。
内容的には、藤原先生の「情報幾何学の基礎」を基礎に、いくつかのテンソルの解説本を参考にしていきます。

## 双対空間
まずは双対空間について。後で双対アファイン接続を論ずるときに使います。

    双対空間は、ある線形 空間に関して

### 定義
$V$ を $\mathbb{R}$ 上の有限次元線形空間とします（基底が有限個）。
このとき、$V$ から $\mathbb{R}$ への線形写像を、$V$ 上の線形汎関数といいます。
そして、$V$ から実数 $\mathbb{R}$ への線形写像全体の集合を $V^\star$ で表すとします。

$f, g \in V^\star$ と $a, b \in \mathbb{R}$ に対して、和とスカラー積を以下のように定義します。

$$
(af + bg)(\bm{x}) := af(\bm{x}) + bg(\bm{x}) \in \mathbb{R},\quad \bm{x} \in V
$$

すると、前半の $h = af + bg$ は $\bm{x}$ から $\mathbb{R}$ への線形写像ととらえることができます。つまり、任意の線形関数 $\in V^\star$ は和とスカラー積について閉じているといえるため、 $V^\star$ は線形空間といえます。
つまり、関数 $f: V \rightarrow \mathbb{R}$ もベクトルのひとつだといえるということです。

この $V^\star$ を、<u>双対空間</u>と呼びます。
<br><br>

### 双対空間の基底
では、双対空間の基底を見つけていきましょう。

$f^i, (i=1,\dots,n)$ を、ある $V$ の基底ベクトルに対して、第 $i$ 成分を取り出す線形写像と定義します。
つまり、$V$ は$n$次元で基底の一つを $\{\bm{e}_1, \dots, \bm{e}_n\}$ とし、各$i=1,\dots,n$ に対して

$$
f^i(\bm{e}_j)=\delta_j^i, \quad (\forall j=1,\dots,n)
$$

のように $f^i$ を定めます。ここで $\delta_j^i$ はクロネッカーのデルタで、$i$ と $j$ が一致したときに1、それ以外で0を取る関数です。

このように定義された $f^i$ は一般のベクトル $\bm{x} \in V$ について適用しても、その第 $i$ 成分を取り出すように機能します。
実際、

$$
\begin{align}
f^i(\bm{x}) &= f^i\left(\sum_{j=1}^n x_j \bm{e}_j\right) \nonumber \\
&= x_i \sum_{j=1}^n f^i(\bm{e}_j) = x_i \nonumber
\end{align}
$$

となります。一行目から二行目への変換で $f^i$ の線形性を使いました。
この $f^i$ は双対基底と呼ばれ、双対空間 $V^\star$ の基底の一つになります。

<div class="box">
<p>定理 0.2.1.</p>

$\{f^1,\dots,f^n\}$ は $V^\star$ の1つの基底である。
</div>

*証明*

基底であることの証明では、1次独立性と $\{f^1,\dots,f^n\}$ が $V^\star$ を張ることを示します。

#### 1次独立性
$\sum_i a_i f^i = 0 \Rightarrow a_i = 0, \forall i$ であることを示す。

$\sum_i a_i f^i$ も線形汎関数であるので、$\sum_i a_i f^i = 0$ は任意の $\bm{x} \in V$ について、$\left(\sum_i a_i f^i\right)(\bm{x}) = 0$ ということです。
特に、$\bm{x} = \bm{e}_jj$ とすると、

$$
0 = \left(\sum_i a_i f^i\right)(\bm{e}_j) = \sum_i a_i \delta^i_j = a_j
$$

$j$ は任意なので、$a_j = 0,\forall j$。


#### $V^\star$ を張ること
任意の$V^\star$ の元 $f$ が $\{f^i\}^n_{i=1}$ の１次結合で表せることを示します。


