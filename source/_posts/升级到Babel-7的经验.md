---
title: 升级到Babel 7的经验
date: 2018-09-17 19:59:39
tags:
    - Babel
---
Babel的最新版本Babel 7 已经在Henry Zhu的不断努力下发布了，他真的是全身心地投入到了Babel的开发中，而Babel对于前端界的贡献也是有目共睹，没有这个神奇的编译器，前端界要落地ES6语法恐怕还要再等十年。

最近我在给自己团队的UI组件库升级到Babel 7，没有想象中那么难，但也有一些需要注意的问题，这里分享一些升级的体会和经验。

# 关于stage-x插件的废弃

Babel 7的改动还是不少的，一个比较大的改动在于移除了之前的`stage-x`插件，根据[官方博客](https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets)的解释，`stage-x`插件原本是对应于ECMA Script提案中的不同阶段，每个阶段有不同特性，而`stage-x`插件事实上就是集合这个阶段中几种特性转译的插件，比如我们最经常看到的`babel-preset-stage-0`，其实就是这样的：

```js
module.exports = {
  presets: [
    require("babel-preset-stage-1")
  ],
  plugins: [
    require("babel-plugin-transform-do-expressions"),
    require("babel-plugin-transform-function-bind")
  ]
};
```

每个stage插件都会包含下一阶段的所有插件，这就导致大家为了能用上大多数特性，纷纷采用了`babel-preset-stage-0`，React项目中，我们最经常看到的`babelrc`配置是这样的：

```js
{
  "presets": ["es2015", "react", "stage-0"]
}
```

然而，提案一直在变，如今是stage 0的特性，可能之后就进入到了stage 1，也可能之后直接被否决抛弃掉，并不会进入到ES规范中。那么babel是不是应该更新这些stage插件呢？如果更新了，现阶段大量前端项目、npm库都在使用这个stage插件，会不会突然发现就编译不了某个特性了呢？

> 到底应该遵循规范，还是应该迁就老项目做兼容呢？

最后Babel团队做出来的决定是，废弃掉`stage-x`插件！这不仅仅是关乎上面这个问题，由于大家已经习惯了stage的配置，对于其中封装的各个特性早已不再关心，废除掉`stage-x`插件，开发者就得加上自己需要的插件，每个插件对应一个提案中的特性，这样项目中的配置也能更清晰。

另外，之前的命名也由`@babel/plugin-transform-`改为`@babel/plugin-proposal-`，就是为了强调这只是一个提案中的特性，并不能确保它会出现在下一代的ES规范中。

# es2015 插件 -> env 插件

`babel-preset-env`已经发布了一段时间，它相比`es2015`可以更加灵活地配置，Babel 7宣布废弃`babel-preset-es201x`而采用新的env插件也是理所当然，这个插件的配置不再赘述，可以参考[官方文档](https://babeljs.io/docs/en/next/babel-preset-env.html)

# 说说babel-upgrade

为了让你更方便的升级到Babel 7，官方提供了一个工具[babel-upgrade](https://github.com/babel/babel-upgrade)，对于已有的项目，只需要运行这样一行命令就可以了：

```shell
npx babel-upgrade --write --install
```

但是这就是为什么我先写了前面这两节的原因，这个工具的本质其实就是把之前的`es2015`换成`env`，`stage-x`换成各种`proposal-xxx`，并且加上了`@babel`作为新的Babel 7生态统一使用的scope。如果之前的项目使用了`stage-x`插件，就会多出大量的插件，其实这里面大部分插件都是无需使用的，你可以根据项目中用到的特性适当删减。

事实上，我最后项目中只使用了一个插件，babelrc配置如下：

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false
            }
        ],
        "@babel/preset-react"
    ],
    "plugins": ["@babel/proposal-class-properties"]
}
```

# 说说babel-plugin-transform-class-properties

这个插件在React项目中十分常用，因为我们经常需要将React组件类中的方法的`this`绑定到组件本身，如果不用箭头函数，我们就需要使用`bind`将函数一个个绑定好，但如果可以使用箭头函数在class字段中直接绑定的话，就非常方便了，即：

```js
class Bork {
    boundFunction = () => {
        return this.state;
    }
}
```

这样，箭头函数被当作成class的属性来看待，`this`也不会指向`undefined`。

这个特性就需要[babel-plugin-transform-class-properties](https://babeljs.io/docs/en/babel-plugin-transform-class-properties)来转译，这个插件在原来是包含在`stage-2`里面的，现在，就需要单独引入。
当然其实这里最好是引入[@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html)，更加符合规范。

这个是属于[Class Field](https://github.com/tc39/proposal-class-fields)提案。