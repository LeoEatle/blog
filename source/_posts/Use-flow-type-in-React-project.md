---
title: Use flow type in React project
date: 2017-12-01 17:35:31
tags:
    - flow
---

**本文着重记录Flow在React项目中的应用，但是flow的应用范围可以不止React**


# Components

## PropTypes
对于原来的React，有提供`PropTypes`用于在运行时检查你传入的props类型，如果用了flow，那么就不需要引入PropTypes了，只需要像下面这样写
```javascript
import * as React from 'react';

type Props = {
  foo: number,
  bar?: string,
};

class MyComponent extends React.Component<Props> {
  render() {
    this.props.doesNotExist; // Error! You did not define a `doesNotExist` prop.

    return <div>{this.props.bar}</div>;
  }
}

<MyComponent foo={42} />;
```
其中`Component`后面的`<Props>`也可以直接这样代替`React.Component<{ foo: number, bar?: string }>`
---
## State Types
不仅仅是Props，`State`也可以同样用这种方式限制，只需要写
```javascript
import * as React from 'react';

type Props = { /* ... */ };

type State = {
  count: number,
};

class MyComponent extends React.Component<Props, State> {
  state = {
    count: 0,
  };

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count + 1,
      }));
    }, 1000);
  }

  render() {
    return <div>Count: {this.state.count}</div>;
  }
}

<MyComponent />;
```
这样你在组件中使用`State`的时候也会受到flow的限制了

## defaultprops
原来React中可以定义组件的默认props，在flow中也可以，并且更加方便地写在class中就可以了
```javascript
import * as React from 'react';

type Props = {
  foo: number, // foo is required.
};

class MyComponent extends React.Component<Props> {
  static defaultProps = {
    foo: 42, // ...but we have a default prop for foo.
  };
}

// So we don't need to include foo.
<MyComponent />
```
flow会自动把添加了默认props的属性作为optional的对待，所以不需要在type里定义`?`

