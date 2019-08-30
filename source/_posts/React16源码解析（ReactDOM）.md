---
title: React16源码解析（ReactDOM）
date: 2018-08-05 02:38:33
tags:
    - React
---

# 前言

上篇文章中看完了React库的`react`部分，这次我们来看React是如何将React框架渲染成DOM的。

# ReactDOM.js

ReactDOM.js是`react-dom`这个库的入口，我们最关心的当然是`reactDOM.render`这个方法的实现，在这个文件里面搜索`render`，我们很快发现其实调用的是一个`legacyRenderSubtreeIntoContainer`方法，之所以带上了`legacy`，想必是16版本的更新使得这个方法是暂时的做法，很有可能之后会废除。但是在16之前的确是这么调用的，除了名字发生了改变。

这个方法带上了`forceHydrate`参数，如果是服务端渲染出来的，就可以用`hydrate`方式来将React相关功能插入到服务端渲染的页面中，`hydrate`和`render`方法cons唯一的区别就是`forceHydrate = true`。

在第一次渲染根组件的时候调用的方法比较特殊，是`legacyCreateRootFromDOMContainer`方法，而这里面是`DOMRenderer.createContainer(container, isAsync, hydrate)`，想必`ReactRoot`这个class是我们要仔细研究的对象。
container就是我们要挂载的根节点。一路找下去，我们会发现这个`DOMRenderer`引用了`react-reconciler`这个库，这就开始涉及到Fiber的部分了。同时也说明，只要实现相关的接口，这个`DOMRenderer`也可以是其他库，这就保证了使用的渲染器和具体平台的渲染实现保持独立性，我可以用`ReactDOM`+`Fiber`，也可以`React Native`+`Fiber`，也可以`ReactDOM`+`Transaction(React15的事务机制)`

Fiber相关的我放在另外一篇，这里我们只要知道ReactDOM只是通过Fiber提供的接口，完成最后要去渲染到真实DOM的一系列事情，以及对于浏览器事件的统一处理就够了。而虚拟DOM的更新机制、differ算法这些，都是依靠Fiber来实现的。



