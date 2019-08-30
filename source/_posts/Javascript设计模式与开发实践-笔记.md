---
title: 《Javascript设计模式与开发实践》笔记
date: 2016-12-08 03:18:46
subtitle: 将程序中不变的和可变的分离开来，是设计模式不变的主题
tags:
    - Design Pattern
    - Javascript
---
## 单例模式
单独的模态窗

## 策略模式
奖金发放、小球移动、表单验证

## 代理模式
小明送花
图片预加载、合并http请求

## 迭代器模式
$.each()

## 观察者模式（发布订阅模式）
登录时ajax完成后修改页面内容
Javascript中事件的实现

## 命令模式
厨房接受订单，订单就是一个command
command的发布者无需关注command是由谁完成、怎么完成的
command会有更长的生命周期
可以撤销、排队操作

例子：菜单界面编写，每一个按钮发布一个命令

> 命令模式的由来,其实是回调(callback)函数的一个面向对象的替代品

## 组合模式
一个大命令由许多小命令组合而成

## 模版方法模式
Coffee or Tea
抽象出来四个步骤

1. 把水煮沸
2. 用沸水冲泡饮料
3. 把饮料倒进杯子
4. 加调料

抽象类的概念
hook钩子方法，在父类加判断，子类可以复写方法使其挂钩

Javascript中实现模版方法模式不一定需要基于继承，可以像以下代码实现
```
var Beverage = function( param ){
    var boilWater = function(){ console.log( '' );

    var brew = param.brew || function(){ 5 throw new Error( '     brew   ' );

    var pourInCup = param.pourInCup || function(){ throw new Error( '     pourInCup   ' );

    var addCondiments = param.addCondiments || function(){ throw new Error( '     addCondiments   ' );

    var F = function(){};
    F.prototype.init = function(){ boilWater();
    brew();
    pourInCup(); 
    addCondiments();
     };
return F; 
};
var Coffee = Beverage({ brew: function(){
    console.log( ' ' ); 
},

pourInCup: function(){
    console.log( ' ' );
},
addCondiments: function(){
    console.log( ' ' ); }
});
```

## 享元模式
例子： 男模特 女模特 穿内衣拍照 
享元模式分为内部状态和外部状态：
内部状态存储于对象内部
内部状态可以被一些对象共享
内部状态独立于具体场景，一般不会改变
外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

是一种时间换空间的优化

性别是内部状态，内衣是外部状态

**对象池**
http连接池
地图的小气泡