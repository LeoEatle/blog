---
title: WebAssembly，接近汇编层次的javascript？
date: 2017-03-10 15:26:39
subtitle: "WebAssembly是如何给web语言来次大提速的"
tags:
    - V8
    - JIT
    - Javascript
    - Compiler
---
今天翻我的邮箱，发现MDN给我推了篇文章"What makes WebAssembly so darn fast?"
其实这个标题我最感兴趣的是Assembly这个词，即汇编，我的想法是，什么？难道javascript已经需要编译成汇编语言了？所以可以通过编译器来次大提速吗？

看完了这个文章（其实里面还有五个链接），我算是明白了WebAssembly是怎么回事，跟我想的有相似却也有不同。这个作者对在web世界里推广这种类汇编语言，也确实有独特的看法。

## 先从Javascript通过JIT提速的历史进程开始说起
我们先说说javascript是怎么在浏览器里运行的。

大家都知道，javascript一开始被创造出来，作为脚本语言，用解释器去"翻译"成机器语言运行，是比较慢的。
解释器的缺点就是不能像编译器那样，能够花时间去分析代码，去优化代码，因此最后产生的机器代码就会效率很低。
但是如果用编译器，又比较麻烦，你得先编译出机器代码才能跑。
后来，JIT出现了，JIT即Just-In-Time Compiler，就是实时的编译器，这个本来在Java中出现的东西，浏览器也开始加入JIT来解释javascript，它可以分析一些常见的优化点

比如在js中有个循环，它就会先识别这个循环，然后把这个循环块的代码编译后的机器代码存起来，每一行称为一个"stub"。
如果这个循环的代码会运行很多很多次，它还会做进一步的优化，比如假设这个循环里面每个变量的值都不会变，但其实一般情况下总是会变的，所以它还得不停地判断，这样折腾下来，最后反而优化的效率几乎是没有的。

一个典型的例子是类型识别
```

function arraySum(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
}
```
在这个例子中，这个操作看起来很简单，但在js引擎眼中，它必须判断每个变量的类型是什么，它知道sum是个数字，i是个数字，arr是个数组，但它不知道这个数组里装的是什么类型
毕竟，数字的`+`和字符串的`+`操作在机器语言层面是完全不一样的。

## Assembly的好处
编译型语言最大的好处就是增加了一层汇编语言，这不仅仅是能够有对代码进行优化的余地，而且是对高级语言和底层不同架构命令的一个兼容
不管你是C++, C, Rust都可以编译成一种汇编语言，然后不同的x86架构或者ARM都可以把汇编语言转换成不同的机器代码执行。

编译这个过程需要一个"前端"和一个"后端"，这个和web开发的前端后端不一样，而是指将高级语言通过前端翻译成一种IR(Intermidate Representation)语言，然后再通过后端翻译成不同架构的指令，这一整条称为“编译工具链”。
![](langs.png)
clang就是著名的类C语言编译器，LLVM是著名的中间层，可以做大量的优化

## 如何写一个WebAssembly模块
那么WebAssembly在这其中的哪一层呢，就是在后端这加了一层。
![](toolchain.png)
假设你要用C写一个WebAssembly模块，就可以使用clang作为前端，使用LLVM优化，然后我们需要一个后端，你可以用LLVM项目中的wasm，也可以用一个叫做Emscripten
最终会产生一个.wasm文件。

有了这个文件，我们就可以在js中引入它了，现在的引入还有点麻烦，是这样子的：
```
function fetchAndInstantiate(url, importObject) {
  return fetch(url).then(response =>
    response.arrayBuffer()
  ).then(bytes =>
    WebAssembly.instantiate(bytes, importObject)
  ).then(results =>
    results.instance
  );
}
```
作者说之后还会考虑在webpack等打包工具里集成这种引入。

使用WebAssembly模块和普通的js模块有很大不同，WebAssembly如果要传数字做参数或者返回数字还好，如果要处理字符串，必须要手动管理内存，和C语言是一样的。
WebAssembly还有个特点是不需要指明内存地址，它通过一个栈来存放临时的变量并立即执行计算操作。

## 道理都懂，为什么WebAssembly就是快

1. WebAssembly体积小
2. 解码WebAssembly比解析js更快
3. 几乎不需要V8去优化了
4. 不需要去二次优化（这个二次优化主要是因为类型识别，而WebAssembly里自带类型）
5. 不需要GC（WebAssembly根本没有提供GC功能，都是手动管理内存）

原文链接： [https://hacks.mozilla.org/2017/02/what-makes-webassembly-fast/](https://hacks.mozilla.org/2017/02/what-makes-webassembly-fast/)
官网链接： [webassembly.org](webassembly.org)