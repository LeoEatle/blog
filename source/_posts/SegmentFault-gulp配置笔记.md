---
title: SegmentFault Require.js转Webpack配置笔记
date: 2016-12-08 14:37:30
subtitle: "Gulp分析->转移"
tags:
    - Gulp
    - Require.js
    - Webpack
---
最近接到任务尝试将现在项目所使用的Require.js尝试转到Webpack中，不仅为了Webpack强大的Plugin和Loader，也是为了能够复用一些公用代码

## 分析Gulpfile

SegmentFault的Gulp引用的插件很多，这里做一个记录

1. [task]es2js
这个主要用到的是babel，不详述

2. [task]buildcss
[cssnano](http://cssnano.co/): 压缩css，优化以下类型：
删除空格和最后一个分号
删除注释
优化字体权重
丢弃重复的样式规则
优化 calc()
压缩选择器
减少手写属性
合并规则

其中配置了一个参数`zindex: false`，避免对zindex的优化，免得本来5000变成1

3. [task]buildimg
[imagemin](http://www.ydcss.com/archives/26): 压缩img，有以下参数
progressive: true是否无损压缩
[gulp-notify](https://github.com/mikaelbr/gulp-notify)可以用来给OSX发送推送消息（表示图片压缩已完成）
可以用cache缓存没修改的图片，增强性能

4. [task]buildjs
这是最大的一个task了

这里最大的块头就是require.js
[require的配置详细讲解](https://segmentfault.com/a/1190000002403806#articleHeader39)
[require配置文件学习](https://segmentfault.com/a/1190000000394849)

require.js的配置中，符合AMD规范和传统的不符合AMD的文件，是分开配置的，一个是`path`，一个是`shim`

require.js的optimizer中配置了uglify，所以其实其中最消耗时间的还是uglify这个插件

最麻烦的是，由于SF使用Twig模版的结构，前后端分离不算彻底，属于多页面应用，每个页面都需要生成一个对应的min.js，但是Webpack针对的是单页面应用，一般情况入口js和出口js都只有一个

## 配置Webpack



