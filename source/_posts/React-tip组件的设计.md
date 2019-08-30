---
title: React tip组件的设计
date: 2018-10-16 18:52:04
tags:
    - React
---

开发一个能够随时`showTip`的组件，看起来感觉似乎很简单，但是越简单的东西反而有更自由的设计模式，导致我每次都在此处纠结。

就像之前开发loading组件一样，我再次调研了市面上的各种React tip组件，发现基本有这两种模式：

# 使用高阶组件为container赋能

这种方式很好理解，即开发一个类似`toastTipHOC`的组件，然后将它包住你想显示tip的容器组件。

```js
toastTipHOC(
    <div className="container">
        ...
    </div>
)
```
在这个container组件中，就可以通过`this.props.showTip`来调用到外层的tip组件，并且，这个`tip`组件中会有内部的`state`，控制是否显示，下面给一个简单的示例：

```js
/**
 * 用高阶组件的方式调用toastTip（兼容之前的调用方式）
 */
export default BaseComponent => {
    return class InnerComponent extends Component {
        constructor() {
            super()
            this.state = {
                isShow: false,
                type: "",
                text: ""
            }
            this.timer = null
            this.showToolTip = this.showToolTip.bind(this)
        }

        showToolTip(text = "", type = "") {
            this.setState({
                isShow: true,
                type,
                text
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    isShow: false
                })
            }, 3000)
        }

        render() {
            let { isShow, type, text } = this.state

            return (
                <div>
                    <BaseComponent
                        {...this.props}
                        showToolTip={this.showToolTip}
                    />
                    <div
                        className={classNames("toast-tip", type, {
                            show: isShow
                        })}
                    >
                        {text}
                    </div>
                </div>
            )
        }
    }
}

```
## 优势

- 这种方式最大的好处莫过于整个容器中只有一个tip，统一管理
- 并且如果想控制这tip的渐变展示消失也非常简单，可以通过css的`transition`配合增删className进行控制。

## 缺点

- 这种方式会导致你的container中永远多存在一个`<div>`
- 这种方式必须得将`showToolTip`进行层层传递，每一个你可能需要用到`showToolTip` 


# 使用ReactDOM.render挂载到指定节点

虽然平时可能jsx写习惯了，一时很难跳出这个框架来思考是否有没有直接操控DOM的方式来使弹出tip这个操作简单明了的方式，其实是有的。
我们其实可以直接用`ReactDOM`提供的API直接操作真实DOM的挂载，[ant design](https://ant.design/components/skeleton-cn/) 也同样使用了这种方式

下面的示例是使用这种方式的关键代码：

```js
export function showTip(content, config) {
    if (!content) {
        console.warn("没有传入任何内容")
        return
    }
    const div = document.createElement("div")
    if (config.root) {
        config.root.appendChild(div)
    } else {
        document.body && document.body.appendChild(div)
    }
    let duration = config.duration || 3000

    ReactDOM.render(
        <ActToastTip className={config.className} duration={duration}>
            {content}
        </ActToastTip>,
        div
    )
    let timer

    clearTimeout(timer)

    timer = setTimeout(() => {
        ReactDOM.unmountComponentAtNode(div)
        div.parentNode.removeChild(div)
    }, duration)
}
```

## 优势

- 这种方式能够通过简单明了的`showTip("this is a tip")`方式来展示一个tip，无需将方法传递，只需`import showTip`方法。
- 无需担心增加了多余的DOM元素，同样，也无需操心存在的toasttip是否会干扰页面元素的CSS层级问题。
- 可以自由设置`root`，想在哪弹提示就在哪弹提示。

## 缺点

- 如果想用这种方式支持渐变效果，需要用animation去控制，但是使用animation的话，渐变时长、duration都很难控制，还有种方式是监听`didMount`和`unMount`事件来做动画，ant-design是这么干的，但是这事有多复杂？参考这个[答案](https://stackoverflow.com/questions/40064249/react-animate-mount-and-unmount-of-a-single-component)，总之如果希望一个组件mount的时候有好的渐变效果，没那么简单。
- 这种方式如果要实现多个提示连续显示，其实要比原来高阶组件的方式要稍显复杂（当然ant-design做到了，只是实现起来确实不如jsx直观）。

# 总结

最后要做一个总结的话，我觉得在一个项目只需要一个全局的提示的时候，用高阶组件依然是不错的选择，只是高阶组件虽然利用到了React的jsx方便之处，同时也使得调用方式非常不neat。
个人很推崇后一种调用方式，在默认情况下，使用组件的人不过是想弹一个提示，并不想修改自己的容器代码，甚至只想传一个字符串，其他都不想关心。那么第二种的调用方式最符合这种情况。

当然其实完全可以两种方式都支持的。在我的项目中，这两种方式都会支持。