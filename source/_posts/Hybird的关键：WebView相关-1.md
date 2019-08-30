---
title: Hybird的关键：WebView相关(1)
date: 2017-06-22 12:34:57
tags:
    - Hybird
    - Webview
---
混杂开发的app现在越来越多，虽然我并不太喜欢这种方式（我是认为真正的web都是在Browser上才能发挥威力的），但是不可否认的是，至少在国内越来越多的app使用混杂开发来提高开发速度和迭代效率，包括很多大厂，也包括了我现在正在做的移动端web开发。

要能够充分磨合好移动端原生代码和现在越来越复杂和强大的js代码，必须得了解清楚js运行的平台，也就是各平台的Webview。关于此类文章已经很多，我不会详细介绍Webview的知识，毕竟看官方文档才是全面了解Webview最好的途径，我只是记录看这些API中想到的一些点。

先说[iOS平台](https://developer.apple.com/documentation/uikit/uiwebview)，iOS平台在iOS8后已经使用WKWebview来替代之前的UIWebview，但两者还是很大程度是相似的。

可以使用 `loadHTMLString(_:baseURL:)`来加载本地的html文件，这是一个优化点，完全可以采用离线包的形式加快webview的启动，避免出现混杂应用经常出现的菊花加载问题，提高用户体验。唯一问题是现在前端框架基本是选择在客户端渲染HTML，但这一点如果能够使用node.js中间层去做服务端渲染，问题就能迎刃而解。js文件和html文件本地化，也符合Google一直提倡的PWA发展趋势。

可以用`goBack()`, `goForward()`, `canGoBack`等方法和属性控制前进后退，我不清楚为什么微信内置的浏览器等大多浏览器在iOS上都是右滑直接删除一个Webview，如果iOS上能够原生支持webview中的前进后退的话，我现在这个项目也没必要采用蛋疼的多页面开发还使用React甚至Redux这种模式了。也许看之后的文档这个问题得以解决。


