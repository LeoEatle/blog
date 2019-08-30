---
title: '[SegmentFault打工日记]Video.js和直播平台'
date: 2016-12-27 12:07:27
subtitle: "终于要做直播啦兴奋"
tags:
    - npm
    - video.js
---
> 最近听闻sf要做开发者直播平台，嘛，这可能真的成为了某种意义上的直播写代码了。

# 先看Video.js的文档吧

## 安装
安装就是CDN和npm两种方式，现在一般都是npm管理了吧。

## 设置选项
这个是每个插件使用最重要的点。
首先，由于video.js是作用于video tag标签上的，因此一般的html5标签可以用的属性都是可以用的，比如`control`，你也可以使用`data-setup`这个属性来给video标签赋值。
`autoplay`这个属性不能被用于iOS设备，apple把它ban掉了.

## Tracks
video.js支持弹幕，但是需要一个叫做[WebVTT](http://dev.w3.org/html5/webvtt/)格式的字幕文件，然后你就可以在video标签中插入一个`track`标签，这个track标签也可以设置一些属性来设置语言之类的。

## Components
可以通过定制组件添加到video组件上

## API 
可以通过`videojs`这个函数来用js调用相应的DOM ID，
