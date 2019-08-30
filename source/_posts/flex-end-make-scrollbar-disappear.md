---
title: flex-end make scrollbar disappear
date: 2018-06-26 19:45:49
tags:
    - css
---

又遇到一个神奇的问题

目前在做一个消息列表，新信息必须在div的底部首先出现，然后一直向上堆积，并且要可以滑动来查看之前的信息

问题在于，如何让新的信息div能首先出现在底部

搜了一下，果然已经有前人遇到了类似的[问题](https://stackoverflow.com/questions/6401869/stacking-divs-from-bottom-to-top)，第一个解决方案如下：
```css
.parent {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}

.child {
  /* whatever */
}
```
这看起来很modern，很优雅，我用了一下，果然新信息乖乖地靠在底部出现，并且后续信息都能按照从bottom到top排列，仿佛很完美

但是我很快发现，这样做的话滚动条就消失了

尝试了多种操作，就算是设置父元素为`overflow: scroll`，滚动条也是灰色的，并不能滚动

又搜了`flex-end not scrollable`，果然又有前人遇到了这个[问题](https://stackoverflow.com/questions/36130760/use-justify-content-flex-end-and-to-have-vertical-scrollbar)

第一个解决方案是这样的
```css
display: flex;
flex-direction: column-reverse; /* 'column' for start, 'column-reverse' for end */
overflow-y: scroll; /* or overflow-y: auto ... */
```
事实上这样的话并不符合我们的需求，因为它只是解决了顺序的问题，而没有解决从底部开始排列的问题，就算是顺序，事实上我们的新信息本来就在数组尾部，所以并不需要倒过来排序。

第二个解决方案如下
```css
#container {
    overflow-y: auto;
    display: flex;
    flex-flow: column nowrap;
    /* justify-content: flex-end; DO NOT USE: breaks scrolling */
}
#container > :first-child {
    margin-top: auto !important;
    /* use !important to prevent breakage from child margin settings */
}
```
利用了`margin-top`来撑开前几个元素，试了一下，还不错

然而问题又出现了，我希望这每条聊天内容的div都能根据内容自适应宽度，但似乎是因为`flex-direction: column`的关系，每个div都扩展到了父元素的宽度

其实只需要一条css就可以解决这个[问题](https://stackoverflow.com/questions/40141163/make-flex-items-take-content-width-not-width-of-parent-container)

> Use align-items: flex-start on the container, or align-self: flex-start on the flex items.
> No need for display: inline-flex.


顺便，这个需求同时还要求div顶部要渐变消失，这里我利用了新的遮罩css和渐变实现了这个效果
```css
-webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0)), color-stop(0.2, rgba(0,0,0,1)), to(rgba(0,0,0,1)));
```
**博大精深CSS ...**