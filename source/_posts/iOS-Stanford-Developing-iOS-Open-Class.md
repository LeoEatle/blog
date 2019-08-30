---
title: '[iOS]Stanford Developing iOS Open Class(2)'
date: 2016-12-27 11:27:30
tags:
    - iOS
    - Objective-C
---
# 回顾
上一篇我们说到Obj-C的一些特性，在公开课的第二集教授开始用deck.m和deck.h作为实例进行讲解。

# Tips
1. 之前我知道了在OC中函数的调用是通过`message`这种富有特色的形式，这一集我还知道了message可以嵌套，像这样`[[NSMutableArray alloc] init]`，这就好像函数的链式调用一样
2. deck.m中随机取出card的代码中有这么一句`self.card[index]`，其实这也是一个消息调用，其实用的是`self.cards objectAtIndex: index`
3. **Important**`+`修饰一个method的时候，意味着这是个class method而不是instance method，它收到的信息将发送给类，嗯，这就像Java的静态方法。一般用于返回常数，或者作为工具方法。
4. `[xxx alloc] init`是objc创建实例最常见的形式，千万记得先alloc再init
5. 每次重写init都需要返回实例，而不是最原先的NSObject

# View
终于到View层啦，教授再次向我们展现了Xcode强大的按住`ctrl`连接界面和代码的强大功能，另外介绍了`sender`这个概念，其实有点像js里的`event.target`不过oc里都封装好啦。

这里有个小窍门，通过设置一个`@property`，然后通过重写它的`setter`来使得UI和数据能够保持同步。

# `@`在oc中的作用
`@`是为了让一个普通的字符串变成一个字符串对象，在oc中没有`char*`这种说法，必须都转化成字符串对象

# `synthesis`在oc中的作用
其实这是为了返回一个声明类型的一个实例，也就是`_object`，这本来是在幕后完成的，如果需要在init中做一些初始化工作，就要小心地处理这个带`_`的变量
