---
title: React16源码解析(React篇))
date: 2018-08-04 19:58:06
tags:
    - React
---

# 前言

虽然分析React源码的文章已经很多了，但大部分都是以自己的理解将React划分成每个模块来说的，对于一个不知道如何开始阅读源码的人，几乎没有什么帮助。再加上最近React 16版本的发布，相比之下以前一些分析文章已经过时了，所以这里我写一篇按照源码阅读顺序来分析React源码的文章，建议可以参考这篇文章看React源码，可以作为阅读React源码的地图使用。

# 入口

`git clone`了React项目之后，首先看`package.json`，我的习惯是寻找`main`字段，但是这里没有`main`只有`workspace`，什么是`workspace`呢？这其实是yarn提供的功能（毕竟是自家的），用于管理`Muti-library`，可以参考[这个文档](https://yarnpkg.com/lang/zh-hans/docs/workspaces/)，如果有接触过`lerna`应该会比较清楚。

React的`workspaces`指向`packages`目录，因此我们就可以直奔`packages`，这里我们就能看到熟悉的`react`、`react-dom`等各种库了，我们首先从最熟悉的`react`看起。每个库也有自己的`package.json`，这里的`package.json`就有`main`字段了，比如react库的`main`指向`React.js`，这样我们就能直奔每个库的入口文件了。

# ReactBaseClasses

首先可以看到很多熟悉的React提供的对象和方法，比如最熟悉不过的`React.Component`，我们就从这开始吧。`React.Component`是由`ReactBaseClasses`定义的，里面定义了`props`、 `refs`等属性和方法，尤其需要注意的是`this.updater`这个属性虽然在构建函数中作为参数，但是我们平时基本不会用到，一般只会传入`props`和`context`，其实这个是在`ReactNoopUpdateQueue.js`中定义了`setState`和`forceUpdate`的行为，但是真正render的时候是由`renderer`注入的`updater`，如果用默认的就会发出警告。

`React.PureComponent`相比普通的Component，仅仅是在原型上添加了一个`isPureReactComponent = true`的标示，之后应该会在render方法里面做特殊处理。

# ReactElement

众所周知，`jsx`语法糖的本质就是`React.createElement`，这个方法的定义在`ReactElement.js`中，针对开发模式和生产模式用的是不同的方法，建议可以先看生产模式，因为开发模式加了很多验证和提示，而这并不属于核心逻辑。

值得注意的是在createElement中定义了Symbol`$$typeof`作为是否是`ReactElement`的标示，如果浏览器不支持Symbol这里会定义成一个数字，为什么要这样做呢？可以参考[这篇文章](http://tech.colla.me/zh/show/why_react_tags_element_with_$$typeof)说的非常详细。

# ReactChildren

`ReactChildren.js`中定义了各种遍历`props.children`的方法。其中定义了一个`traverseContext`池，大小是10，在不断地遍历中这个池中的context会不断重复利用。

# ReactContext

React 16相比15，`context`相关的[API](https://reactjs.org/docs/context.html#reactcreatecontext)发生了很大改变，在这个`ReactContext.js`中定义了`Provider`和`Consumer`的行为。
虽然个人觉得，这种使用方式十分繁琐，而且感觉重复干了`Redux`的事情，虽然在React内部context的传递和props完全是不同的，只要看完这个文件就能明白这套机制的实现。

# __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

我发现React中有个奇怪的属性叫做`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`，越不想让我用越想一看究竟，这个属性引用得是`ReactSharedInternals`，其中包括了`ReactCurrentOwner`和`ReactDebugCurrentFrame`（仅dev），ReactCurrentOwner是fiber算法用到的，这样是把`renderer`完全独立，所以以后即使换个render算法也没有问题，ReactDebugCurrentFrame则是用来调试render过程的，

# 总结

其实最后我们发现，嗯？说好的differ算法呢？说好的生命周期呢？怎么都没有，其实`React`并没有做什么事情，只是定义了`ReactElement`的形状和各种属性，具体实现都交给具体的renderer，这也就保证了就算不是用`ReactDOM`渲染成DOM对象，也可以是给`ReactNative`渲染成Native对象，甚至是其他东西，只要遵循这个React对象的规范就可以。