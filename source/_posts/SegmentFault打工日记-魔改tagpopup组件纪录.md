---
title: '[SegmentFault打工日记]魔改tagpopup组件纪录'
date: 2016-12-19 15:38:53
tags:
    - bootstrap
    - underscore
---
## 前言：Bootstrap源码探索

> 先吐槽一下为什么关于bootstrap的Popover组件有个api`$(this).data('bs.popover')`，通过这个调用可以获取到弹出框对象，但这个bs提供的api我无论是在官网还是stackoverflow上都没能查出出处在哪，大家都是莫名其妙的就知道调用这个能获得一个bs自己创建的对象，然后再调用`popover.tip()`就能获得弹出框的DOM对象
真的很困惑好吗，然后我在webstorm里一路找到bs源码，才看到下面这段

```
function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))//注意这一行，创建了一个新对象
      if (typeof option == 'string') data[option]()
    })
  }
```

最后我终于在官网上看到这么一段话，在javascript组件页面的最前面

> 每个插件还通过 Constructor 属性暴露了其原始的构造函数：`$.fn.popover.Constructor`。如果你想获取某个插件的实例，可以直接通过页面元素获取：`$('[rel="popover"]').data('popover')`。

好吧，怪我没看好文档咯，然后我又在想了，那个`tip()`又是怎么拿到DOM对象的呢？原来这个是因为Popover对象是通过`jquery.fn.extend`方法继承了Tooltip对象，而在Tooltip对象中有定义这个原型方法；

```
 Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }
```
算是再次加强了对bs的理解吧...
---
## 解析需求：handlebar, spm

吐槽完毕，说说这个需求吧，由于原先SF使用的标签弹出框用的是bootstrap的popover组件加上[handlebar](http://handlebarsjs.com/)模版完成的，现在组长想让我把它改为underscore的模版，原话是：

1. 组件代码是 压缩后的代码，维护性差
2. 用到了 handlebar 模版语言，需用 underscore 替换
3. 交互逻辑，缓存逻辑需要进一步改进

好吧，这个组件代码是因为在这个`sf_tagpopup`中不知道是谁写的，用的是spm打包，spm是一个CommonJS风格的打包工具，之前完全没听说过，而且在这个组件中的`package.json`中npm test的脚本还写错了
其实个人觉得用spm自己的调试感觉还好，但是现在还是要和大项目风格统一比较合理。

## 改造：spm 的CommonJS改为RequireJS的AMD

第一次改这么大型的项目，而且这个项目里竟然同时用到了CommonJS和AMD风格、CoffeeScript和ES6、Jquery和Underscore，这么艰巨的重构任务，我的内心几乎是崩溃的
在看了一上午这个sf_popover组件后，我终于鼓起勇气首先把关于事件监测的部分改掉了，其余的其实不用太动，打算先把模块化改了再开发新的templatable组件

首先当然是把`define`函数写好依赖，然后修改项目根目录的require配置文件，这里注意一定要记得在build目录下的requirejs配置也要修改，否则开发环境用的还是那一套
修改什么呢，当然是把之前CommonJS生成的js文件路径改为我已经修改好的AMD风格的js组件路径，然后注意处理下相关依赖里面的config

## 改造：模版引擎
突然觉得说改风格其实没什么意思，主要是小心为妙，下面说说怎么修改templatable组件

[handlebar](http://handlebarsjs.com/)又是个模版引擎，最近真是接触了太多模版引擎了，粗粗看完文档，感觉前端果然真的要毁一生。
OK，话说回来，这个组件有个好处，一旦一个template是生成过的，里面通过ajax请求到的数据它会缓存于自己的一个数组`templates`中，下次再渲染这个模版的时候就不用通过ajax拿数据了，嘛这也是模版引擎组件应该做的事情。
但是一个致命的问题是，标签生成的popover里面有关注按钮，如果缓存了未关注状态，点击关注后重新渲染，拿的还是原来缓存的html。

这就尴尬了，这并不是$稍微操作下DOM可以解决的，必需要深入到组件里面去改，所以组长要我重构这个组件。用Underscore。

underscore的模版风格也就那样，讲真这些模版引擎除了jade比较激进，其它就差不多都是mustache语法也没什么好说的。主要区别就是用的是`<% %>`作为js语句的包装字符。

## 粒度过细的组件
这个组件一个很大的问题是粒度很细，可以看出当初作者的野心很大，想把它做成一个标签系统之类的东西，所以封装了templatable、follow这些组件，但是现在跟组长讨论之后，决定把这些都合并成一个sf_popup组件。

我花了很久时间把这些组件看了一遍，然后简化了大部分验证逻辑，因为如果只是针对这种tech tag的话并不需要那么多验证，之后最难的问题出现了。

## 缓存系统
这个组件的缓存系统经过我的简化，终于可以很方便的通过tech id这个字段进行读取数据，但是每一个弹出框都有一个`关注`按钮，每次这个按钮绑定的时候我的`$pop`变量由于闭包的原因指向的是这个按钮所在的弹出框，修改的关注人数等等也是仅限于这个弹出框的，这原本是正确的。
问题在于由于每次按钮都是动态生成的，这个按钮的监听事件函数我绑定在了最上层的`body`标签上，这直接导致了一个问题。每次我popup一个弹出框时，如果这个弹出框已经弹出过，它不会再执行一次popup的代码（用的是jquery的$.one()函数绑定），因此当点击关注按钮事件冒泡上来的时候，调用的正是上一次保存在监听函数里的弹出框。

于是我每次用弹下一个标签，点击关注改变的确实上一个弹出框的内容。

## 一点小坑
其实这个问题本来应该很好解决，只要绑定在每个特定的按钮上就好了，但是奇怪的是不知道为何这个按钮就是绑定不上去，最后我是委托给上层的container解决的这个问题。

## 一点插曲
由于之前我在修复另一个bug的时候merge到了master上，之中我已经在开始魔改这个组件的工作了，结果...上线之后js全挂了，而且错误信息赫然显示的是我的名字的绝对路径，简直醉了...
于是我就这样紧急把这个写了两三天的组件上线了，感觉运行的还不错...

