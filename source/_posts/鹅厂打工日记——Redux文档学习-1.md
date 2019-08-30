---
title: 鹅厂打工日记——Redux文档学习(1)
date: 2017-02-17 14:42:36
subtitle: 同时也是花样直播源码学习记录
tags:
    - React.js
    - Redux
    - Javascript
---
请注意这种学习记录我并不是为了教会别人而写的，仅仅是我自己个人的学习笔记，会用极其简略的办法记录我认为的重点，不建议新手学习。

## Redux是啥
Redux改变传统的界面编程模式，采用一种管理`state`的方式来编程的模式。关键在于一个**可预测的javascript容器**，这个概念还不清楚
配合React使用有奇效，配合Imuutable使用更佳。

## Reducer
Reducer是用来描述一个`state`接受一个`action`怎样变成另一个`state`的函数，即`(state, action)=>state`

## Store
通过`createStore()`创建一个store
可以用`subscribe()`订阅收到`action`应当回调的函数
可以用`dispatch()`分发一个`action`

## action
Action是一个plain object describe only the message and type.

## Pure function and Impure function
Pure function就是指函数接受确定的输入产生确定的输出 如简单的`(x)=>{return x*x}`
Impure function可能会改变传入的参数引用，因此多次接受同个输入，输出可能会变，如`(x)=>{return x.update()}`

Pure function 是让state predictable的关键

## 中间件
中间件是用来让异步派发action成为可能的东西
也是可以用于检查所有action的一个东西

## Redux和React结合
Redux可以说是flux思想为了React而生的东西，所以和React结合非常方便，其中的关键在于`connect`函数，这个函数做了两件事
1. `mapStateToProps`这个函数是用于把state中的东西变成props的
2. `mapDispatchtoProps`，还记得dispatch吗，这是分发一个action的，而这个函数，就是把dispatch绑定到组件的监听函数上

最后把这个绑定到container就成了

## Redux和我的项目的实践
具体不说是什么项目了，就说说这个项目的目录结构设计吧

根目录：
  还是那些东西你懂的，package.json, .gitignore, yarn.lock, config.json, eslint.js等等

  .happypack 放sourcemap的
  .steamer steamer的配置
  .webpack_cache hot-replace产生的cache
  config 配置文件
  mock 假数据
  node_modules
  dist
  src

  下面重点说src
  src
  --css
  --img
  --js
    --common
  --lib
  --page
    --banner
    --broadcast
    --common
        --actions
        --components
        --constants
        --middleware
        --utils
    --main
        --actions
        --components
        --connect
        --constants
        --container
        --reducers
        --root
        --stores

    main.html
    favicon.ico

注意看上面中的main目录，这是一个标准的redux页面配置，其中各个目录的功能在目录名称都写着，action其实是一堆action creater，constants定义了action的名称，components即react组件，reducer要写很多，可能要用到`combineReducer()`
可以统一action的名称，比如是用来向后台请求数据的有特定的后缀，可以设置一个中间件截取这些action然后转化为异步请求拿到数据

## Redux Devtool
这个玩意真好用啊真好用，一下就把Chrome变成了IDE，我用这玩意看了下douban.fm，惊呆，状态树密密麻麻
Redux真是神奇的东西
