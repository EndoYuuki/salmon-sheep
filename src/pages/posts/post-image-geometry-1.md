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

## 目次
本章では次のことをまとめています。

- 情報幾何学とはなにか
- 参考書の紹介
- 双対空間
- テンソル空間

## 情報幾何学とはなにか
この章は情報幾何学についての勉強が一段落した時点で修正しようと思っていますが、とりあえず今のイメージを残します。

<br>

情報幾何学は <u class="highlight">確率分布の幾何学</u> と呼ばれています。
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

### 定義
$V$ を $\mathbb{R}$ 上の有限次元の線形空間とします（基底が有限個）。
このとき、$V$ から $\mathbb{R}$ への線形写像を、$V$ 上の線形汎関数と呼びます。
そして線形汎関数全体の集合を $V^\star$ で表すとします。

さて、線形汎関数全体の集合 $V^\star$ に和とスカラー積を定めると、実は線形空間となります。

まずは、$f, g \in V^\star$ と $a \in \mathbb{R}$ に対して、和とスカラー積を以下のように定義します。

$$
\begin{aligned}
&(f + g)(\bm{x}) := f(\bm{x}) + g(\bm{x}) \\
&(af)(\bm{x}) := af(\bm{x})
\end{aligned}
$$

ここで和 $f+g$ と スカラー積 $af$ は $V$ から $\mathbb{R}$ への写像になっています。
あとは、この結果の写像が線形性を持つことを示せれば、$V^\star$ が和とスカラー積について閉じていることになるため、$V^\star$ が線形空間であるといえます。

$\bm{x} = \sum_i x_i \bm{e}_i$ とすると、

$$
\begin{aligned}
(f+g)(\sum_i x_i \bm{e}_i) &= f\left(\sum_i x_i \bm{e}_i\right) + g\left(\sum_i x_i \bm{e}_i\right) \\
&= \sum_i x_i \left(f(\bm{e}_i) + g(\bm{e}_i)\right) \\
&= \sum_i x_i (f + g)\left(\bm{e}_i\right) \\
(af)\left(\sum_i x_i \bm{e}_i\right) &= af\left(\sum_i x_i \bm{e}_i\right) \\
&= a\sum_i x_i f(\bm{e}_i) \\
&= \sum_i x_i (af)\left(\bm{e}_i\right) \\
\end{aligned}
$$

となって、$f+g$、$af$ ともに線形写像であることを示せました。

つまり、任意の線形関数 $\in V^\star$ は和とスカラー積について閉じているといえるため、 $V^\star$ は線形空間といえます。
つまり、関数 $f: V \rightarrow \mathbb{R}$ もベクトルのひとつだといえるということです。

そして $V^\star$ を、<u class="highlight">双対空間</u>と呼びます。
<br><br>

### 双対空間の基底
では、双対空間の基底を見つけていきましょう。

$f^i, (i=1,\dots,n)$ を、ある $V$ の基底ベクトルに対して、対応するインデックスならば1を、それ以外なら0を取る線形関数と定義します。
つまり、$V$ は$n$次元で基底の一つを $\{\bm{e}_1, \dots, \bm{e}_n\}$ とし、各$i=1,\dots,n$ に対して

$$
f^i(\bm{e}_j)=\delta_j^i, \quad (\forall j=1,\dots,n)
$$

のように $f^i$ を定めます。ここで $\delta_j^i$ はクロネッカーのデルタで、$i$ と $j$ が一致したときに1、それ以外で0を取る関数です。

ここで少し疑問なのが、基底ベクトルに対する値だけを決めて、ほかの定義域に値を割り当てないこの定義は、定義として十分なんでしょうか？
実は *線形写像* である場合は、基底ベクトルに対する値の定義のみで、定義域全体に写像を定義したになります。

実際、任意のベクトル $\bm{x} = \sum_i x_i \bm{e}_i \in V$ に対し

$$
f^i(\bm{x}) = \sum_i x_i f^i(\bm{e}_i)
$$

となり、任意のベクトルに関しても、そのベクトルを分解したときの和とスカラー積を線形性によって外に出すことができるので、値を定義できるということですね。


このように定義された $f^i$ は一般のベクトル $\bm{x} \in V$ に対し、その第 $i$ 成分を取り出します。

$$
\begin{align}
f^i(\bm{x}) &= f^i\left(\sum_{j=1}^n x_j \bm{e}_j\right) \nonumber \\
&= x_i \sum_{j=1}^n f^i(\bm{e}_j) = x_i \nonumber
\end{align}
$$

となります。一行目から二行目への変換で $f^i$ の線形性を使いました。
この $f^i$ は双対基底と呼ばれ、双対空間 $V^\star$ の基底の一つになります。

<div class="box">
<p class="theorem">定理 0.2.1.</p>

$\{f^1,\dots,f^n\}$ は $V^\star$ の1つの基底である。
</div>

<div class="proof">
<u>証明</u>

基底であることの証明では、1次独立性 (i) と $\{f^1,\dots,f^n\}$ が $V^\star$ を張ること (ii) を示します。

<hr>

#### (i) 1次独立性
$\sum_i a_i f^i = 0 \Rightarrow a_i = 0, \forall i$ であることを示す。

$\sum_i a_i f^i$ も線形汎関数であるので、$\sum_i a_i f^i = 0$ は任意の $\bm{x} \in V$ について、$\left(\sum_i a_i f^i\right)(\bm{x}) = 0$ を意味します。
特に、$\bm{x} = \bm{e}_j$ を代入すると

$$
0 = \left(\sum_i a_i f^i\right)(\bm{e}_j) = \sum_i a_i \delta^i_j = a_j
$$

これがすべての $j$ について成り立つので、$a_i = 0, \forall i$　　　　$\square$

<hr>

#### (ii) $V^\star$ を張ること
任意の $V^\star$ の元 $f$ が $\{f^i\}^n_{i=1}$ の１次結合で表せることを示します。

このことをいうためには、線形写像 $f$ の定義域 $V$ の各点において、$f$ が $\{f^i\}^n_{i=1}$ の１次結合で書けることを示す必要があります。

まずは、基底ベクトル $\bm{e}_j \in V$ ($j$は任意) においてこのことを示します。

天下り的だが、$a_i = f(\bm{e}_i)$ とすると、

$$
\left(\sum_i a_i f^i\right)(\bm{e}_j) = \sum_i a_i f^i(\bm{e}_j) = a_j = f(\bm{e}_j)
$$

と成り立ちます。

次に、任意の $\bm{x} \in V$ について。
$\bm{x} = \sum_j x_j \bm{e}_j$ と書けるので、

$$
\begin{aligned}
\left(\sum_i a_i f^i\right)(\bm{x}) &= \sum_i a_i f^i\left(\sum_j x_j \bm{e}_j\right) \\
&= \sum_i a_i \sum_j x_j \delta_i^j \\
&= \sum_i a_i x_i \\
&= \sum_i x_i f(\bm{e}_i) \\
&= f\left(\sum_i x_i \bm{e}_i \right) \\
&= f(\bm{x})\quad \quad \quad \square
\end{aligned}
$$
　　　　
</div>

まとめると、

双対空間の基底の一つは、元の線形空間のベクトルの第$i$番目の要素を取り出す線形写像である

ということです。

### 双対空間の双対空間
双対空間 $V^\star$ は線形空間であったので、双対空間に対する双対空間を考えることもできそうです
（関数を引数に実数を返すような線形写像の空間）。

大変ややこしいことになっていますが、実はこれは $V$ と同一視できることが示せます。

具体的には、各 $\bm{x} \in V$ に対して、線形汎関数 $\tilde{\bm{x}}$ を

$$
\tilde{\bm{x}}(f) := f(\bm{x})
$$

と定めると、これは線形同型写像となり、 $V$ と $(V^\star)^\star$ は線形同型になります。
線形同型ということは、それぞれの空間を同一視できる、ということです。

この辺の詳しい話は忘れてしまったので、いずれか書き足したいところですが、このページが詳しく解説してくれそうです。

https://tsujimotter.hatenablog.com/entry/dual-space

いずれにしても、$V$ と $(V^\star)^\star$ が同一視できるということは今後重要になってきます。


## テンソル
$n$ 次元実線形空間 $V$ とその双対空間 $V^\star$ について
各変数に対して線形である関数

$$
F: \underbrace{V^\star \times \cdots \times V^\star}_r \times \underbrace{V \times \cdots \times V}_s \rightarrow \mathbb{R}
$$

の集合を <u class="highlight"> $(r, s)$ 型テンソル </u> といいます。

$(r, s)$ 型テンソル全体の集合を $V^{(r,s)}$ と書きます。

<u>例</u>

$$
V^{(1, 0)} = (V^\star)^\star \simeq V, \quad V^{(0, 1)} = V^\star
$$


<div class="supplement">
以前にテンソルをテンソル積と係数の和として勉強した人もいるかもしれません。
物理などの分野ではそのように定義するようですね。

ここで定義しているテンソルは、その定義における係数を計算する関数として定義されています。
どちらの定義でも指しているものは違えど、できることは同じだと理解しています。この辺りはまた別の機会にまとめたいと思います。
</div>

### テンソルの演算
テンソルについて、和とスカラー積を次のように定義します。
ここで、$\omega_1, \dots, \omega_r \in V^\star$、$v_1, \dots, v_s \in V$とします。

$$
\begin{aligned}
&(aF)(\omega_1, \dots, \omega_r, v_1, \dots, v_s) := a\left(F(\omega_1, \dots, \omega_r, v_1, \dots, v_s)\right) \\
&(F+G)(\omega_1, \dots, \omega_r, v_1, \dots, v_s) := F(\omega_1, \dots, \omega_r, v_1, \dots, v_s) + G(\omega_1, \dots, \omega_r, v_1, \dots, v_s)
\end{aligned}
$$

この定義によって、$V^{(r, s)}$ は実線形空間となります。

双対空間でやった時と同様に、引数となっている $\omega_1, \dots, \omega_r \in V^\star$、$v_1, \dots, v_s \in V$ を基底ベクトルの和で表すと、各変数に対する線形性によって、和とスカラー積について閉じていることが示せ、$V^{(r, s)}$ が実線形空間であることを示せます。


### テンソル積
$F \in V^{(r, s)}$ と $G \in V^{(r^\prime, s^\prime)}$ について、<u class="highlight">テンソル積</u> $F \otimes G \in V^{(r+r^\prime, s+s^\prime)}$ を定義します。

$$
\begin{aligned}
&F \otimes G: \underbrace{V^\star \times \cdots \times V^\star}_r \times \underbrace{V^\star \times \cdots \times V^\star}_{r^\prime} \\
&\quad \quad \quad \quad \quad \underbrace{V \times \cdots \times V}_s \times \underbrace{V \times \cdots \times V}_{s^\prime} \rightarrow \mathbb{R}
\end{aligned}
$$
