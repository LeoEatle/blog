---
title: redux state change but react not render
date: 2018-06-26 16:22:44
tags:
    - Redux
---

今天遇到一个问题是Redux的state中有个数组明明已经改变了，但是Redux-react并没有触发虚拟DOM的重新render，

这个问题我查了一下，我是犯了一个常见的Redux使用错误，问题出在Reducer
在Reducer中，我用的是下面的方式返回新的state
```js
let newState = state
newState.push(newItem)
return newState
```

然而事实上此时
```js
newState === state // true
```

因此其实可以直接利用ES6的spread operator
```js
let newState = [...state, processedMsg]
return newState;
```

这也同时是为什么Immutable可以解决这种问题的原因，假如这是一个Immutable的Array的话
```js
let newState = state.push(newItem)
// 这里获取到的是全新的newState
newState === state // false
```

