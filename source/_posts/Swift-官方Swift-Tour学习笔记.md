---
title: '[Swift]官方Swift Tour学习笔记'
date: 2017-01-03 11:51:22
tags:
    - Swift
---
学了点OC之后也算是接触了一点点经典的iOS和Mac OS应用开发，但是我的好奇心还远远不止于此，我接下来的计划是学Swift和Mac OS Debian的内核，甚至买了一本《深入理解MacOS和iOS系统》

学习Swift有很多方案，可以看视频，但是我在网上找到了苹果[官方的教程](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/GuidedTour.html#//apple_ref/doc/uid/TP40014097-CH2)，那自然是看这一个。

这里简要做一个记录：

1. 基本感觉是javascript和python结合体，`let`指明常量，`var`指明变量
2. 用`nil`表示`null`
3. 支持`for ... in ...`
4. 函数需要指明返回类型，和传入类型，也就是说有类型验证
5. 类似python`list`的`[]`表示，但是dic也是用方括号，用key value赋值
6. option value赋值
7. 像js，函数可以作为参数，可以嵌套，可以返回，传函数时也要指明传入类型和返回类型，感觉以后这样会嵌套越来越多

Swift的闭包是这样样子的：
```
numbers.map({
    (number: Int) -> Int in
    let result = 3 * number
    return result
})
```
简直神奇，匿名函数也要指明传入参数和传出参数，似乎是不是跟Typescript比较像？
而且引用参数的时候可以`by number`无需`by name`，比如这样`let sortedNumbers = numbers.sorted { $0 > $1 }`

## 面向对象
在面向对象方面，实现了`init`和`deinit`

继承方面用`:`，重写方法的时候需要注明`override`

另外实现了OC中的`protocal`

***
未完待续



