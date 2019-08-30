---
title: 释放webpack的真正潜力
date: 2018-08-27 12:24:01
tags:
    - webpack
---

在上周末广州举办的feday中，webpack的核心开发者Sean在介绍webpack插件系统原理时，隆重介绍了一个中国学生于Google夏令营，在导师Tobias带领下写的一个webpack插件，[webpack-deep-scope-analysis-plugin](https://github.com/vincentdchan/webpack-deep-scope-analysis-plugin)，这个插件能够大大提高webpack tree-shaking的效率。

## tree-shaking目前的缺陷

tree-shaking 作为 rollup 的一个杀手级特性，能够利用ES6的静态引入规范，减少包的体积，避免不必要的代码引入，webpack2也很快引入了这个特性，但是目前，webpack只能做比较简单的解决方案，比如：
```js
import { isNumber, isNull } from 'lodash-es'
export function fun1() {
  // do something
}
export function isNull(...args) {
  return isNull(...args)
}
```

这个例子中，webpack会寻找引入变量的引用，当发现没有对isNumber的引用时，就会去除isNumber的代码。这其实不太实用，毕竟在现在的vscode中，没有引用的变量在ide中都会灰显提示，一般不会犯这种import某个模块却不用的错误了。

如果是接下来这种引入方式呢，我写了一个demo如下

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/webpack-deep-analyse/demo.png)

这个例子非常简单，如果用图来表示是这样
![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/webpack-deep-analyse/graph.png)


在index.js中引入了func.js中的func2，并没有引入func1，但是func1引入了lodash。webpack检查的时候发现func.js中的确用到了lodash，所以不会把lodash去掉。实际上，我们根本没用到它。

webpack-deep-scope-analysis-plugin就可以解决这种判断。

## 插件效果


引入前
![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/webpack-deep-analyse/%E5%BC%95%E5%85%A5%E5%89%8D.png)


引入后
![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/webpack-deep-analyse/%E5%BC%95%E5%85%A5%E5%90%8E.png)


85.8kb -> 不到1kb 

当然，我这里是标题党了，因为这里直接把一个lodash库给去掉了，所以变化才这么惊人。但是即使在实际项目中，我们也能轻易用一个插件减少大量的不必要的引入。

## 原理

原理方面，可以参考作者的[Medium文章](https://medium.com/webpack/better-tree-shaking-with-deep-scope-analysis-a0b788c0ce77)，解释得非常清楚，这里不做赘述。

webpack的原理，其实就是遍历所有的模块，把它们打包成一个文件，在这个过程中，它就知道哪些export的模块有被使用到。那我们同样也可以遍历所有的scope（作用域），简化没有用到的scope，最后只留下我们需要的。
我们提到的这个webpack插件，正是内置了这样一个scope分析器，它能够从入口文件中分析出scope的引用关系，最后排除掉所有没有用到的模块。

当然，这个插件也并不是自己做了所有的事情，它也是依赖于了前人的工作。 [escope](https://github.com/estools/escope)  是一个分析ES中scope的工具，插件作者将它改成了ts版本集成到了插件中，并且利用了webpack暴露的接口，可以解析出来的模块的AST树，基于这个AST就可以交给escope分析出scope的引用关系。

## 最佳实践

一些使用此插件的特殊情况也可以参考作者的[原Medium文章](https://medium.com/webpack/better-tree-shaking-with-deep-scope-analysis-a0b788c0ce77)。

首先，要用到tree-shaking，必然要保证引用的模块都是ES6规范的。这也是为什么我在前面的demo中，引入的是`lodash-es`而不是`lodash`。

在项目中，注意要把`babel`设置`module: false`，避免babel将模块转为CommonJS规范。引入的模块包，也必须是符合ES6规范，并且在最新的webpack中加了一条限制，即在`package.json`中定义`sideEffect: false`，这也是为了避免出现`import xxx`导致模块内部的一些函数执行后影响全局环境，却被去除掉的情况。

## 未来

当时跟这位插件作者沟通，他说将来有可能Tobias会把这个插件内置到webpack中，这也是符合webpack4零配置的趋势。但是我们也看得到，要将前端工程的dead code elimination做到和其他静态语言一样好，靠这些工具是远远不够的，模块自身也必须配合做到符合规范。

## 参考链接：

github项目地址：https://github.com/vincentdchan/webpack-deep-scope-analysis-plugin
Medium博客地址：https://medium.com/webpack/better-tree-shaking-with-deep-scope-analysis-a0b788c0ce77



