---
title: '[一个小坑]如何更改base64编码的svg图片颜色？'
date: 2017-03-27 16:00:00
tags:
    - svg
    - base64
---
最近用vue做东西，vue-cli自带的webpack配置的`url-loader`是自动把10000以下的图片给base64编码了的，然后我在使用微信svg图标icon的时候，它编码成base64了，这都没啥问题。

问题是，我发现用来更改svg图片颜色的`fill: currentColor`这个css属性就不起作用了，可能是webkit在解码base64之前就先把css给重绘了，导致css属性没应用上，怎么办？

万能的stackoverflow告诉我，你可以解码再重绘啊！

```javascript
// Strip 
var encoded = img.src.substring(64);
// Decode
var decoded = atob(encoded);
// Create an svg element
var wrapper = document.createElement("div");
wrapper.innerHTML = decoded;
var newSvg = wrapper.firstChild;

// get Path
var innerPath = newSvg.getElementsByTagName("path")[0];
innerPath.setAttribute("fill", "#FF0000");
```
