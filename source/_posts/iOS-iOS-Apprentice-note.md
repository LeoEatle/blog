---
title: '[iOS]iOS Apprentice note'
date: 2016-12-25 16:16:19
subtitle: "虽然是全英文，但是我全英教学的四年可不是白学的"
tags:
    - iOS
    - Swift
---
最近一直想找机会学一下iOS，也是为了研究一下native app和hybrid app到底前景孰优孰劣，总之，学新的东西总是让人感到兴奋嘛。

本来就随便在jd上搜了排名第一的iOS开发的书，厚厚一本iOS开发指南，上网搜了一下，都说那本书写的不怎么样，还是应该看国外的书，有很多人都推荐新手入门学习[iOS Apprentice](https://www.raywenderlich.com/store/ios-apprentice)，我还在知乎上看到方舟在叶孤城底下评论也推荐这本书-.-

相比目前还在一片混沌的前端技术，iOS开发的体验堪称天堂。完善的苹果官方文档，较为封闭的环境和很好的封装让开发者少操了不少心，至少应该不至于写代码写着写着就到node modules里找是谁写的垃圾代码。
Swift or Obj-C都不是事，js可以模拟出Python(CoffeeScript)和C#(Typescript)的开发体验，我还有啥语法好怕的。

所以直接上Swift先吧，反正也是玩玩。

# Part 1
> 虽然是全英文，但是我全英教学的四年可不是白学的，看的还蛮顺畅的，作者写的也很简明，我一边看一边后悔怎么没早点学，都怪当初大一买了个Lumia手机，整整两年没接触过最新的各种app，只能捣鼓web编程了，sign，如果当初咬咬牙买个iphone，说不定我也成了一个iOS开发呢。

第一部分是教你做几个组件出来，有Slider和Button什么的，直接调用就行了。
纪录几个Keys:

1. Each screen in your app gets its own view controller
2. Connection is a very interesting function. To connect V layer with Control Layer.![connection.png]()
3. An app is essentially made up of objects that can send messages to each other. **On iOS, apps are event-driven** ![UIkit.png]()
4. Developers work in points, designers work in pixels.

然后我很遗憾的发现，这个教程还真是给新手准备的，花了大量篇幅讲述了数据结构啊、函数相关的基本知识，对如何能快速实现一个iOS或者Swift语法都很少提到...而且Xcode真是用的我一头雾水，不明白很多东西都是干什么的。

于是我中途又开始学斯坦福的iOS课程，这个课程是用Object-C教学的，但是大家都说很经典，如果你感兴趣的话，我还有一篇博客会讲讲这个课程。

