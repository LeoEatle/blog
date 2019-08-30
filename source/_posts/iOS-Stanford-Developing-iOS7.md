---
title: '[iOS]Stanford Developing iOS Open Class(1)'
date: 2016-12-26 20:41:53
subtitle: "只是为了学习ObjC的语法"
tags:
    - iOS
    - Object-C
---
之前由于还是觉得那个iOS Apprentice不过瘾，我听说斯坦福的这门公开课特别出名，就找来看。

教程用的是Obj-C，我反而很兴奋，我对各种语言的语法都十分感兴趣，在js里python系代表是Coffeecript，强类型代表是Typescript，但是据说Obj-C比Java要松，又是针对C实现了OO，所以一直对这门语言感兴趣。

而且iOS的Cocoa出现了已经近30年，这门语言不可能没有它独特的精华，我想把它找出来。

# Section 1
不愧是Stanford，上来先讲了一通MVC，我觉得如果是刚入门的甚至如果不是对前端感兴趣的coder可能都会听得一头雾水吧，还好我之前对MVC以及各种变种还是了解颇深的，某种意义上来说这是开发客户端比设计模式还要重要的东西。
然后教授就开始讲Obj-C了，这里有几个我的感触要记录一下。

1. Obj-C实现了内存回收，但不像JVM那么复杂，JVM是区分了新生代和旧生代，前者用Coping算法，后者用的是标记－清除，[详情在这](http://www.cnblogs.com/laoyangHJ/articles/java_gc.html)，js原来IE6,7时代用的是引用计数，现在也是标记-清除方案，见[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
Obj-C据教授讲只是用了引用计数，效率也很高，一直觉得Java的做法虽然减少碎片，但是垃圾回收时实在效率太低，挤压到最后可能新生代几乎没有空间，这说不定就是Android相比iOS一直让人有卡卡的印象的原因。

2. Obj-C应对内存回收有个`strong/weak`类型的声明，这个声明在头文件中，如果是strong的一旦没有引用计数就会被立刻清除，如果是weak的就会指向一个`nil`，相当于空指针但是可以和这个指针通信。

3. Obj-C应对多线程有个`nonatomic`的声明，这个声明在m文件中会有对应的`synthesis`，代表它不是线程安全的，所以Obj-C会处理这个变量不让多个线程同时访问。所以我们就不用在m文件中写各种lock了。

4. 对于头文件每个声明，obj-c都会在m文件中生成对应的`getter`和`setter`，不过这些信息都是隐藏的，自动的

5. obj-c定义一个method长这样：

```
- (void)setContents:(NSString *)contents
{
    _contents = contents;
}
```
 其中`-`代表这是个`method`，`(void)`返回空，`NSString *`是参数类型，**然后参数`contents`竟然不放在括号里！！！**

6. obj-C中有个概念叫`message`，通常用`[]`表示，这个概念还要之后讲的更清楚，还有个概念叫`protocal`，这就好像Java里的接口`interface`。

7. obj-c比较字符串用的是`isEqualToString`，和Java的`.equal`差不多，也是为了强调不能用`==`，`==`比较的是指针是否指向一样，而不是比较内容，这点用多了js的人就经常忘了C的本。

8. obc-c的`.`操作符调用的就是instance的`getter`方法，`=`赋值用的就是`setter`方法。

9. 支持`for x in NSArray`, Horraay~

10. obj-c所有的对象的终极父对象叫`NSObject`

