---
title: Mobx学习笔记
date: 2017-11-30 19:58:02
tags:
    - Mobx
---
# 最近在尝试用Mobx管理状态，以下是学习笔记

## Mobx-react

### observer
通过`@observer`可以将一个React组件改为**可响应的**，加上这个装饰器，React组件就可以跟踪observer的变量并进行自动render

或者你也可以通过`<Observer>`将组件中的一部分包裹起来，让只有这部分变成可相应的区域。

### `onError`全局的error handler
可以在组件类中加入onError来抓取错误，这一点在React v16也加入了这个新特性

### `componentWillRect`
由于Mobx自己对`shouldComponentUpdate`做了优化，所有Observer的对象如果有改变，它会做一个基于`PureRenderMixin`的对比，所以它还提供了一个生命周期函数，即`componentWillReact`，这个钩子函数触发于Mobx发现需要re-render的时刻。注意这个函数不会在第一次render的时候触发。

### `PropTypes`
mobx-react提供了以下几个额外的PropTypes，用于验证observable的对象类型
* observableArray
* observableArrayOf(React.PropTypes.number)
* observableMap
* observableObject
* arrayOrObservableArray
* arrayOrObservableArrayOf(React.PropTypes.number)
* objectOrObservableObject

### `Provider`和`inject`
`Provider`和Redux的很像，就不说了，`inject`是一个高阶函数（也可以是装饰器），他可以让一些stores在被包裹的组件中可用，就像下面这样
```javascript
@inject("color") @observer
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <Provider color="red">
        <div>
            {children}
        </div>
    </Provider>;
  }
}
```

**注意：**
* 使用`Provider`去提供值要在最外层的组件提供，这是为了避免[React #2517](https://github.com/facebook/react/issues/2517)这种情况
* 如果同时使用了`@inject`和`@observer`，应该要把`observer`放里面，`@inject`放外面

