---
title: Node中的C++与Javascript如何连接
date: 2019-11-05 20:24:23
tags:
    - node
    - C++
---

本文翻译自Medium文章，[原文地址](https://medium.com/front-end-weekly/internals-of-node-advance-node-%EF%B8%8F-8612f6a957d7)

但是我不会完全按照原意翻译，如果想了解原文是怎么详细解释的，请直接点击原文查看。

# 前言
众所周知，Node是依赖一堆C++的代码去做系统底层的操作，但是具体怎么做的，很多人并不了解。这篇文章会简单介绍Node是怎样利用到C++写的代码的。
另外要提的一点是，不要害怕C++代码，这不过是一种语言而已，如果你是科班出身，至少是从C语言开始学习编程的。即使到了今天，C++依然是众多语言中最重要的那个，因为很多系统底层和历史代码，依然是由C++写的，python、Lua、Node，都是有调用C++代码的方式，并且作为语言重要的特性之一。总之学C++永远不亏。

# V8 和 Libuv
Node基于两个重要的项目：V8 和 Libuv。

V8 是谷歌开发的JS引擎，用于解释JS代码并执行，它不仅可以用与浏览器环境，也可以用于其他环境。

Libuv 可能就没那么出名了，它也是个独立的开源项目，而且是100%用C++写的，这个项目的主要目的在于提供底层操作系统的接口给Node，包括文件系统、网络模块以及相当一部分的并行能力。

那么有人就要问了，我们为什么不直接用V8和Libuv，而要用Node呢？

首先我们必须要明白，Node的这些依赖并不是全用Javascript写的，可以用这张图来解释：

![](https://miro.medium.com/max/2048/1*hPMc2c3oCEsD8Okv3h5nmA.png)


V8引擎有大概70%的代码是C++写的，而Libuv更是100%的C++代码。

问题来了，我们并不想写C++代码，我们只想写Javascript，这就是为什么需要Node。

NodeJs提供了友好的接口，使我们能够用js来调用背后真正运行在机器上的C++代码。

NodeJs还有一个重要的工作，那就是提供稳定、一致的接口，屏蔽掉依赖变化过程中不一致、不稳定的部分。比如像`fs`、`path`、`crypto`这些原生模块就是活生生的例子。它们都有统一、一致的API接口。

这样包裹之后的模块，你就不需要接触到Libuv的接口了，只需要用js去`require`这些模块就可以了。

# 模块实现

让我们用一些实际例子来解释Node是怎样完成javascript和C++的连接的。

1. `git clone` [Node](https://github.com/nodejs/node)项目，选择其中的一个模块。
2. 找到在源代码中实现它的位置。
3. 查看它是怎样利用V8和Libuv实现

那我们选择哪个模块呢？

`Crypto`这个模块是不错的选择，这个模块一般是用来hash密码然后存储到db。然后来具体看下`Crypto`中暴露的`scrypt`这个函数是怎么实现的。

看Node项目主要就看两大目录：
1. `Lib` 这个目录包含了所有的JS模块定义，就是我们平时`require`的部分，这就是Node项目中JS的那一面。
2. `Src` 这个目录包含了所有的C++实现，这就是Node真正用到Libuv和V8的地方。

首先我们找下`script.js`定义的位置，它在`node/lib/internal/crypto/script.js`

可以看到这个文件跟我们平时写的js没啥两样。不过这里有个重要的函数`internalBinding()`，之前它也被写成`Process.binding()`，现在它被改成了`internalBinding()`并且不能被用户端所使用，目前它只能被用于`NativeModule.require()`的模块。

**NativeModule**: 原生模块可以在`lib/**/*.js`和`deps/**/*.js`中找到，这些核心模块通过`js2c.py`生成`node_javascript.cc`，然后又编译成二进制，这样就能大大减少I/O带来的性能损耗。

这使得核心模块可以引用`lib/internal/*`、`dep/internal/*`下面的模块，也可以使用`internalBinding()`这样的方法，所以即使被引用的文件不是CommonJS style的，也可以通过这种方式引用这些文件。

> Process.binding/InternalBinding 就是 JS 和 C++ 之间的桥梁

![](https://miro.medium.com/max/1958/1*cDfyUWZfdkcGp-U4AUUucw.png)

# Process.binding()/internalBinding() 是怎样生效的

既然这是JS和C++的桥梁，那就是Node的关键部分了，现在我们来看下`src`目录中的C++部分。

`node/src/Node_crypto.cc`

**Node_crypto.cc**这个文件有5000+行代码，这就是crypto模块真正的部分，以C++形式存在于Node中。

我们先拖到代码的最底下，你会找到C++的export: `SetMethod()`。这一行就是`internalBinding() / process.binding()`真正引用的部分。

![](https://miro.medium.com/max/1802/1*AzFvacTeSz9spd9YWTflxw.png)

> 这就是C++暴露接口给JS的地方

没错，100%的C++实现，现在你应该知道当NodeJS在运行时它是怎样依赖C++代码的了。

![](https://miro.medium.com/max/1920/1*kr7EBmfHysFFrekaeTmPjQ.png)

现在你可能很好奇Node是怎样把V8和Libuv玩到一起的，让我们看一下这个代码文件顶部

拖到顶部你会看到：

![](https://miro.medium.com/max/1842/1*R5x1-0Z65MjFbzJXd9b_8g.png)

看到类似`v8::Array`的代码了吗，所以其实V8在Node中主要作为一个中介，把Js相关的变量类型转换成C++相关的变量类型。

> 比如C++是如何理解JS中的false的，或者C++是如何理解JS中的Integer、Null、string等等

另一方面`Libuv`也被同样用于代码中，只是比较难搜到，你可以试试搜索`uv`

你会发现`Libuv`经常被用于线程操作。毕竟根据维基百科的解释，它提供对基于事件循环的异步I/O的支持。

![](https://miro.medium.com/max/2212/1*BRmTvdgbCJnxMth9pVDv2A.png)
