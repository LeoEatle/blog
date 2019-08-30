---
title: '[iOS]官网的iOS Guide in Swift(4)'
date: 2017-02-14 14:56:41
subtitle: "Implement a Custom Control"
tags: 
    - Swift
    - iOS
---

## 学习目标：
1. 根据storyboard创建并组织自定义源代码
2. 定义一个class
3. 在这个class上实现一个initializer
4. 使用**UIStackView**作为一个容器
5. 理解如何自动创建视图
6. 添加辅助性信息到custom control上
7. 使用**@IBInspectable**和**@IBDesignable**来展示并控制一个custom view

## 创建一个custom view

首先我们需要创建一个新的swift文件作为类，然后我们需要实现init这个method
注意init有两种实现方式，一种是init(frame: CGRect)，这个是必须加上**override**关键字的
另一种是init(frame: NSCoder)，这个必须加上**required**关键字，意思是它的subclass也必须实现这个方法，否则就会自动继承

每一个init方法都要调用**super.init**

## 显示一个custom view
这部分其实就是用编程的方式去写界面，先生成一个button实例，然后需要再去添加相应的constraint

## 添加action
这部分就相当于用代码的方式完成之前的添加action操作

```
//Setup the button action
button.addTarget(self, action: #selector(RatingControl.ratingButtonTapped(button:)), for: .touchUpInside)
```

`addTarget`一共有三个参数，self, action 和 for， action 传递了一个方法进去， for 则是要监听的事件

## 支持Interface Builder
写完这些界面代码，我们会发现强大的IB就失效了，这个时候我们的IB应该只有一个空空的矩形，里面并没有什么五个红色矩形，这是因为IB并不知道我们对这个stack view做了什么
这时我们应该在我们创建的类前面添加一个`@IBDesignable`，这样IB就会复制好界面

同时我们也可以定义`@inspector`来给IB中添加新的可以控制宽高等属性框

