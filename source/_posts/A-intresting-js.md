---
title: A intresting jquery code
date: 2016-08-08 19:35:40
tags: 
    - jquery
    - codepen
---
## 今天在codepen看到了一个短小精悍的js特效


```js
jQuery(document).ready(function(){
   $('h1').mousemove(function(e){
     var rXP = (e.pageX - this.offsetLeft-$(this).width()/2);
     var rYP = (e.pageY - this.offsetTop-$(this).height()/2);
     $('h1').css('text-shadow', +rYP/10+'px '+rXP/80+'px rgba(227,6,19,.8), '+rYP/8+'px '+rXP/60+'px rgba(255,237,0,1), '+rXP/70+'px '+rYP/12+'px rgba(0,159,227,.7)');
   });
});
```
猜猜看这个会有什么效果？

![codepen](1.png)

随着鼠标移动，文字会呈现出迷幻特效