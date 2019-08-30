---
title: compositionstart事件
date: 2016-11-30 11:13:32
subtitle: 中文输入时避免input.value的改变
tags:
    - WebAPI
---
当我们平时在input框中输入中文的时候，尤其是在搜索框输入中文的时候，我们经常会发现，输入到一半还没有中文出来的时候，系统就凭借已经输入的英文去查询了，怎么避免这种情况呢？

关键就在于这个[compositionstart事件](https://developer.mozilla.org/en-US/docs/Web/Events/compositionstart)

> compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）。

其实简单的说，`compositionstart`触发于你开始输入中文，还没有确定好候选词的时候，`compositionend`触发于你选好候选词结束的时候

那我们如何保证用户在输入中文并确定候选词后再改变input的值呢，可以这么做
```
window.chinese = false;
inputField.on('compositionstart',()=>{window.chinese = true});//监听到compositionstart就将全局变量chinese改为true
inputField.on('compositionend',()=>{window.chinese = false});//监听到compositionend就将全局变量改为false

window.on('keyup',()=>{
    if(!window.chinese){
        //当不是在中文输入过程中时才能改变value的值
    }
})
```
