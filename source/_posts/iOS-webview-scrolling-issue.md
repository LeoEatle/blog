---
title: iOS webview scrolling issue
date: 2018-08-30 13:43:28
tags:
    - iOS
    - event
    - compact
---
在iOS中，有很多苹果为了用户过度设计的一些特性，这导致一些出奇意料的结果。比如我这篇要说的，是iOS中webview上下滑动，即使到了顶部，也会有个可以拉下去再回弹的效果。

要解决这个问题其实也容易，只需要在iOS中设置这两个属性：
```
webView.scrollView.bounces = false;
```
如果希望webview完全不能滑动，常见于一些全屏的活动页面，可以这样设置：
```
webView.scrollView.scrollEnabled = false;
```
如果在手Q中，mqq已经提供了这个接口：


但是，如果是作为前端开发，不在手Q这种客户端，并且在客户端同学暂时改不了的情况下，可以怎么办呢？

第一种办法是直接禁用touch事件的默认效果：
```
document.ontouchstart = function(e){ 
    e.preventDefault(); 
}
```
之所以监听touchstart而不是touchmove，是因为touchstart的开始时间要更早。

但是这样子的话，整个webview的所有元素都无法滚动。

还有别的解决方案吗？我的场景是页面中有个需要滚动的列表，如果滚动到列表顶部继续滚动，就会导致整个webview接着滚动，列表的滚动就会失效。

我不能像第一种这种做法来做，只能通过监听列表的touchstart事件，并且阻止它冒泡，来解决这个问题。这样的话，就算是到了列表顶部，再滑动也不会造成整个webview的滑动了。

```
 onTouchStart={(e) => {e.stopPropagation()}
 ```

---
update
但是事情并没有这么简单，我发现即使我已经阻止了事件的冒泡，在document上依然能捕获到`touchstart`事件。

 ## React 的合成事件问题

 因为React是通过合成事件，通过绑定在`document`解决性能问题，绑定在任何React节点的事件监听实际上都是最先被`document`捕获，ok啊，现在我有两种方案，一是使用React提供的`event.nativeEvent`来获取到原生事件，再阻止冒泡，另一种则是在`componentDidMount`中使用原生DOM的api`document.getElementById`来获取到真实DOM节点，监听`touchstart`并阻止冒泡。

 ## 但我方向就已经错了

 事实上我发现，就算是我阻止了`touchstart`事件冒泡，在列表滑动到顶部或者底部并再次滑动的时候，webview依然会随之滑动，阻止事件冒泡并不能解决这个问题，只有在`document`使用`preventDefault`才能解决webview滑动问题。

## 能否根据事件的target来判断是否preventDefault

可以，并且有人已经写了这样一个库，[iNoBounce](https://github.com/lazd/iNoBounce)就是这样一个库，利用监听元素的父节点是否有`-webkit-overflow-scrolling: touch`这个css属性来选择性的`preventDefault`

## 跳出前端思维

事实上，我认为没必要死磕怎么在前端解决这个问题，既然这是客户端一条代码完美解决的事情，就应该和客户端同学沟通去解决，重要的不是代码多fancy，而是效果有多好，不是吗？
