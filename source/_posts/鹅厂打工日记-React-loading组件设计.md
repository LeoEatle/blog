---
title: 鹅厂打工日记 React-loading组件设计
date: 2017-03-14 15:22:53
tags:
    - React
    - Component
---
最近需要写一个用于loading的React组件，这个组件虽然简单，但也确实很常用，如何能够利用React真正打造一个可定制化很强、又没有副作用的React组件，是我现在需要思考的问题。

## 市面上的React组件

### [react-loading](https://github.com/cezary/react-loading)
这名字一看就很直观，它提供了svg的动画，有几种类型，但是除了`type`和`color`就没有什么可定制化的余地了。

### [react-loading-animation](https://www.npmjs.com/package/react-loading-animation)
这个是一个比较炫酷的动画组件，实现了一种类似material-design的loading特效，利用的是svg的`<circle>`+css3的animation
他提供了两种方式去使用，一种就是在loading时直接用`<Loading />`去替换，另一种就是把要展现的内容放在`<Loading></Loading>`里，展现的内容用`prop.children`控制，如下
```javascript
const ListOfThings = ({ isFetching, things }) => {
    return (
        <Loading isLoading={isFetching && things.size() == 0}>
            <ul>
                ...
            </ul>
        </Loading>
    );
}
```
我觉得第二种是最好的，因为这样就有点AOP切面编程的意思，仿佛就像一个装饰器。

### [react-component-loading](https://github.com/booxood/react-component-loading/blob/master/README_CN.md)
这个是个国产的react组件，用的是CSS3，作者还好要我们不要导入全部组件，根据需要的type导入特定的，然而你只有两种type啊...（也许还在填坑）

### [React-Spinkit](http://kyleamathews.github.io/react-spinkit/)
这个是一个专门用于spinner的react组件，有各种旋转方式，

### [react-imageloader](https://github.com/hzdg/react-imageloader)
这个组件是专门用于载入图片的，它甚至可以通过改变`props.src`这个属性来动态载入图片，它监听了`propwillchange`等生命周期函数来改变一个唯一的state属性
另外，它的`props.children`是用来显示载入失败时的提示信息的，这点可以借鉴一下

## Loading组件功能的设计
综合来看，除了常用的宽高、`style`等设置，作为Loading组件，还要注意这些方面。

### 想载入的内容怎么放？
就像之前介绍的组件之一，有两种方式，一种是直接替换，另一种是把要载入的用`<Loading>`组件包裹起来，我想用后一种方式，这样显得很无副作用，很纯，很函数式...
那这样的话要载入的内容就是children了，错误信息呢？我打算放在props里的onError
问题来了，我这个Loading组件如何能知道载入情况呢？我觉得如果要和redux结合的话，我还要定义好action和reducer才行

另外，我是否需要像一些上面提到的一些组件一样，提供默认的关于加载失败的处理？

我思考了很久，觉得与其为这个组件的使用者考虑太多情形，不如仅仅使用`isLoading`一个参数来控制这个组件的显示来的直观，这样才不会扼杀使用者的灵活性

不过想到这里，我之前想使用`<Loading>`包裹的想法就行不通了，这样的话只能让这个组件以一种附加品出现在原来的组件中，而不能用一种装饰者模式去使用了...

## 一个通用的React组件设计模式
用ES6的class语法写一个React组件，其实也就那么几种函数，`componentDidMount`是想在React中使用jquery的最爱，但是缺点显然易见，违反了React希望不操作DOM的原则
一个纯的React组件，应该是不能动到DOM的，完全凭借`props`去决定渲染的内容，这个是重点也是难点。