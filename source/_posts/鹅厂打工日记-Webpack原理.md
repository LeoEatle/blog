---
title: '[鹅厂打工日记]fis构建转移webpack构建'
date: 2017-04-14 15:14:24
tags:
    - Webpack
    - 构建工具
---
在鹅厂这个团队，每个人除了每天的需求外，需要分出至少20%的时间做自己的技术项目，这个项目完全凭自己兴趣，当然最后是对公司开源计划有利的。
我恰好加入了一位同事的steamer项目，这个项目是基于webpack的，本来是针对业务做的startkit，现在想做得更加通用一点。

为了更深入地了解Webpack，我只得慢慢看文档了，并且加入了webpack-china.org去进行webpack2翻译计划。

恰好，最近又接到一个需求，需要讲原来使用fis构建的项目，转成使用webpack构建。fis项目使用的模块化工具是其中一个mod.js实现的，并不完全符合CommonJS或者AMD规范，每一个模块竟然直接return一个变量，这会让webpack编译时报错，因为它认为这个模块的return语句竟然不是包裹在函数中的。

没有办法，我只能给每个模块一个个加上`module.exports = xxx`。另外fis对于静态资源如css、图片或者ejs模板，有个内部函数`__inline`和`__url`，其实这些都可以通过webpack的`url-loader`实现，另外这个项目还有flash...不过我一查，惊了，`file-loader`竟然是支持flash文件和db文件的，遂支持之。

这里其实还有个坑，那就是原来的fis在`__inline`一个ejs模板时，并没有对产生的html文件进行转义，而`file-loader`是直接将其转义了，如果要在一个ejs模板里插入另一个ejs模板，原来是直接使用`<%= %>`的，现在必须用`<%- %>`。

由于原项目的模块有些多，我本来想尝试将原来模块目录通过webpack的`moduleDirectory`指定，但不知道为啥，webpack就是不懂的去这个目录找模块，只知道在源文件和`node_modules`里找，就很气。

总之最近工作还是比较紧，几乎没有写博客，今天是回校前最后一天了，纪录下最近付出大量精力和时间的这次迁移吧。

另外我在使用webpack的时候，找到了一个讲明webpack原理很好的解析教程，从最简单的文件进行webpack编译开始讲起，讲明了webpack是怎么处理不同的模块规范、怎么处理每个文件、在哪里进行plugin和loader的处理的。地址：https://webpack.toobug.net/zh-cn/chapter2/non-moduler.html

我之前的一个疑问也随之打消，因为项目中使用了jquery，以及各种jquery插件，如果在不同文件中require jquery，然后在这个jquery变量上添加各种属性，它们引用的是同一个jquery吗？

## 实验开始
我创建了三个文件，a.js，b.js，c.js，在每个模块中有一个属性是value，有一个print是打印这个value，有一个函数是让value自加1，其中a模块和b模块还require c模块，它们的函数是让c.value++
又创建一个入口文件main.js，require以上三个模块，先require a，让a给c+1，调动c的打印，然后require b，让b给c+1，再次打印，最后让c自增，打印

结果赫然是
```
1
2
3
```

说明webpack虽然防止了污染全局的变量，但只要调用模块内的函数和变量，改变的就是同个模块的值，jquery插件去require的jquery，确实是同一个jquery。


