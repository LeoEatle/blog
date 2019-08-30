---
title: CSS的新属性：clip-path和mask
date: 2017-06-21 10:42:46
tags:
    - CSS
---
> 本文为原文[CSS Shapes, clipping and masking – and how to use them](https://hacks.mozilla.org/2017/06/css-shapes-clipping-and-masking/)翻译

Firefox 54版本的release引入了一个新特性，那就是支持了CSS属性：`clip-path`。

`clip-path`是一个允许我们剪切元素的部分内容的一个属性，现在在Firefox还只能使用SVG去剪裁一个元素。

但是如果是使用Firefox54版本的话，你就能使用各种CSS shapes了，那是哪些呢？就是insets, circles, ellipses 还有 polygons. （这些算是术语(term)就不翻译了）

> 注意：如果想查看原文的codepen demos，就点击原文去看吧

# 基本使用

非常值得注意的是`clip-path`不能接受"img"作为一个输入，必须将它转为一个`<clipPath>`元素
```html
<img src="https://hacks.mozilla.org/files/2017/06/omega.jpg" alt="Omega nebula" height="200">

<svg width="0" height="0">
   <defs>
    <clipPath id="mask">
  <path d="M 40 0 L 0 40, 60 100, 0 160, 40 200, 100 140, 160 200, 200 160, 140 100, 200 40, 160 0, 100 60">
    </clipPath>
  </defs>
</svg>
```
```css
img {
  -webkit-clip-path: url(#mask);
  clip-path: url(#mask);
  
  height: 200px;
}

body {
  padding: 0;
  margin: 0;
}
```

有个很酷的事情是我们可以在`<clipPath>`中包含一个SVG动画

```html
<img src="https://hacks.mozilla.org/files/2017/06/omega_large.jpg">

<svg version="1.2" width="0" height="0" viewBox="0 0 740 600">
  <defs>
    <clipPath id="mask">
      <rect x="0" y="0" width="200" height="600">
        <animate attributeType="XML" attributeName="x" from="-200" to="740"
            dur="10s" repeatCount="indefinite"/>
      </rect>
    </clipPath>
  </defs>
</svg>
```

```css
body {
  padding: 0;
  margin: 0;
}

img {
  height: 600px;
  display: block;  
  -webkit-clip-path: url(#mask);
  clip-path: url(#mask);
}
```

还有，在即将发布的Firefox中，我们还会有[CSS shape funcitons](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape)。这让我们可以用CSS定义图形而不需要SVG，shape functions包含circle , ellipse, inset 和 polygon. 你可以看下面这个例子：

```html
<img src="https://hacks.mozilla.org/files/2017/06/omega.jpg" class="circle">
<img src="https://hacks.mozilla.org/files/2017/06/omega.jpg" class="inset">
<img src="https://hacks.mozilla.org/files/2017/06/omega.jpg" class="poly">
<img src="https://hacks.mozilla.org/files/2017/06/omega.jpg" class="ellipse">
```
```css
.circle {
  -webkit-clip-path: circle(100% at 100% 100%);
  clip-path: circle(100% at 100% 100%);
}

.inset {
  -webkit-clip-path: inset(50px 0px);
  clip-path: inset(50px 0px);
}

.poly {
  -webkit-clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
  clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
}

.ellipse {
  -webkit-clip-path: ellipse(50% 50%);
  clip-path: ellipse(50% 50%);
}

img {
  width: 300px;
  margin: 1em;
}
```
不止与此，我们还可以用CSS让它动起来，唯一的限制是我们不能改变function的类型（比如从一个`circle`变为`inset`），并且当给一个多边形增加动画的时候，一个多边形必须在动画中保留相同数量的顶点。

这是一个简单的运用`circle`的动画效果
![gif](clip-path.gif)

这是另一个利用`polygon`的效果，注意：尽管我们受限于多边形顶点不能发生变化，我们仍然可以通过重复的定位值合并它们，这样就能够创建一个能够变化边数的多边形了。

另外，`clip-path`也同样开启了一个新的**智能布局模式**。下面的demo使用了剪裁效果来使一个图片插入文章并产生一个有趣的特效
![img_in_text](img_in_text.png)

# 用JavaScript去play

剪裁效果让我们有了各种新的可能，`clip-path`可以用来分离界面的不同元素。可以使用JavaScript来获取元素并且计算元素和容器的距离，然后使用距离来更新inset姓张的参数。

我们同样可以根据用户的输入来动态改变剪裁效果，比如下面这个由鼠标控制的潜望镜效果：
![move_mouse](move_mouse.gif)

#`clip-path`或者`mask`？
还有个相似的CSS属性叫做`mask`，但它和`clip-path`不太相同，根据你使用方式的不同，你应该选择其中一种，同样你也要考虑浏览器兼容性。目前Firefox是惟一一个完全支持mask特性的，所以下面的demo你需要运行Firefox54来运行。（**译注：目前Chrome可以通过添加webkit前缀去运行**）

蒙版可以在SVG中使用一个图像或者`<mask>`元素。`clip-path`则是使用一个SVG路径或者CSS图形。

蒙版改变一个元素的外观，比如给一个图片添加一个线性渐变的圆形蒙版。

记住你还可以使用`mask-mode`用bitmap图像作为，尽管他们没有alpha通道（即透明度）。
![](font.png)

蒙版的一个重要概念是它会改变图像的像素的值，在一些点上会让它完全透明。

另一个重要的不同是，剪裁会切下一块元素，包括相交的那一部分，看下面这个demo图就知道了，蒙版会让整个矩形都会发生事件，但是使用剪裁只有可见的部分会发生事件。
![](firefox-mask-vs-clip)
![](firefox-mask-vs-clip2)

所以要根据使用的实际情况不同来考虑使用哪种属性。