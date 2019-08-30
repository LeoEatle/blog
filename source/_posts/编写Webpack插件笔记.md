---
title: 编写Webpack插件笔记
date: 2017-09-08 15:27:10
subtitle: 为了给Steamer写插件
tags:
    - webpack
---
Webpack最强大的地方就在于它的插件体系，可以在构建的时候对代码做各种操作。根据阶段性的构建回调函数，开发者就可以在构建过程中插入自己的操作。编写插件相比编写加载器要难，因为你需要理解webpack一些低层次的钩子，并做好阅读源码的准备。

# 创建一个插件
一个`webpack`的插件包括
- 一个命名的js函数
- 定义这个函数prototype的`apply`方法
- 编写响应webpack事件钩子函数
- 操作webpack内部实例抛出的一些具体数据
- 完成插件的逻辑后调用webpack提供的回调函数
```javascript
// A named JavaScript function.
function MyExampleWebpackPlugin() {

};

// Defines `apply` method in it's prototype.
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  // Specifies webpack's event hook to attach itself.
  compiler.plugin('webpacksEventHook', function(compilation /* Manipulates webpack internal instance specific data. */, callback) {
    console.log("This is an example plugin!!!");

    // Invokes webpack provided callback after functionality is complete.
    callback();
  });
};
```

# 编译和编译器
在开发插件可利用的众多资源中，`compiler`和`compliation`是两个最重要的对象。理解他们的用途是拓展webpack引擎非常重要的一步。
- `compiler`对象代表完全配置过的webpack环境。这个对象在webpack一启动时就被创建，并且包含配置的所有options, loaders,和plugins。当给webpack环境应用一个插件时，这个插件可以获取到这个对象的一个引用。使用这个对象就可以获取webpack的主要环境。
- `compilation`对象代表一个