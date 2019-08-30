---
title: '[鹅厂打工日记]Karma的使用和与Mocha的配合'
date: 2017-03-31 10:30:25
tags:
    － Test
    - Karma
---

## Karma是什么？
Karma，它不是一个Mocha那种用来写测试断言的库，也不是一个Assertion库，它是用来针对浏览器使用的，让代码在浏览器的环境跑并且进行测试。

作者在官网的"How it works"说，想知道为什么要有Karma吗？去看我的[论文](https://github.com/karma-runner/karma/raw/master/thesis.pdf)吧！

我的内心（Orzzzz），如果我也能在毕业设计写个框架，我也可以特么写个10000字的论文，毕竟光configuration我应该就能写上十页

然而我并没有那种实力，人家论文开头就说，我要感谢Angular Team，因为我在那学到了很多。好的，我知道你大学就能加入Angular了，真是的



## Karma是什么？
Karma，它不是一个Mocha那种用来写测试断言的库，也不是一个Assertion库，它是用来针对浏览器使用的，让代码在浏览器的环境跑并且进行测试。


## 使用Karma

### 安装
首先当然是需要安装
```shell
# Install Karma
$ npm install karma --save-dev
```
它也有提供一个命令行工具
```shell
$ npm install -g karma-cli
```

### 配置
如果安装了他的命令行工具，可以快捷初始化一个配置文件
```shell
$ karma init my.conf.js
```
它会询问你的各种需求，最后生成一个my.conf.js的配置文件

### 启动
之后就可以`karma start my.conf.js`了 

> 等一下，我根本没有测试框架和断言的代码啊。是的Karma只负责启动一个服务器让代码在浏览器中测试，甚至是多个不同浏览器，并提供watch功能，但它不care你用什么测试框架或者断言库，所以其实是非常灵活的。

# 配合Mocha+Chai+Webpack
我在网上找到了很多种配置，有配合JUnit的，Jenkins的，我这里推荐一个配合Mocha+Chai+Webpack的方式

## 安装Mocha, Chai, Webpack

首先安装Mocha和Chai，当然还有Webpack，不过这个一般都是装了的吧，如果项目没有用Webpack的话，其实不如用require或者System.js进行预处理更加轻量，使用webpack的优点是可以复用一个webpack配置文件，而且跟生产环境是更接近的

如果你的webpack还用了很多不同的插件、loader、middleware，请自行配置

```shell
$ npm install mocha chai webpack --save-dev
```
## 安装Karma相关插件

然后安装Karma的相关插件，我们需要Mocha, Chai和Webpack的相关插件，还要chrome启动器、phentomjs（可用于Linux环境），然后我们还需要[istanbul](https://github.com/gotwarlost/istanbul)来显示测试覆盖率
```shell
$ npm install karma-mocha karma-chai karma-webpack karma-chrome-launcher karma-coverage karma-sourcemap-loader karma-spec-reporter karma-phantomjs-launcher --save-dev
```

如果你希望能够直接复用你的webpack配置文件，你可以装一个webpack预处理器
```shell
karma-webpack-preprocessor
```


## 配置Karma

这里我建议新建一个test目录，并子目录如下
├─test
│  └─unit
│      ├─coverage
│      │ 
│      |─specs
        |--index.js
        |--karma.conf.js

index.js是用来配置karma要测试的入口的，这了给出示例如下
```javascript
// 引入所有测试文件 (以 .spec.js 结尾)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// 引入除了main.js的所有源文件以做覆盖率测试
// 你也可以修改配置只测试一部分js文件
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
```

我们可以直接利用karma-cli来生成一个配置
```shell
$ karma init karma.conf.js
```


进入我们生成的karma.conf.js，我这里给一份示例配置：
```javascript
var webpackTestConf = require('../../tools/webpack.test.conf');
module.exports = function (config) {
  config.set({

    // 将被用于所有配置的基础路径 (eg. files, exclude)
    basePath: '',

    // 使用的测试框架 可用的框架: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha', 'chai'
    ],

    // Karma的入口文件
    files: [//{pattern: 'node_modules/chai/chai.js',include: true},
      './index.js'],

    // 需排除的文件
    exclude: [],

    // 需要预处理的文件，比如需要webpack进行处理后再让karma运行服务器 可用的预处理器:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      ['index.js']: ['webpack', 'sourcemap']
    },

    // 配置webpack
    webpack: webpackTestConf,
    webpackMiddleware: {
      noInfo: true
    },

    // 测试结果报告，覆盖率报告如有需要在这里配置 可用的报告插件:
    // https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'progress', 'coverage'
    ],

    // 覆盖率报告插件配置
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'json',
          subdir: '.',
          file: 'coverage.json'
        }, {
          type: 'lcov',
          subdir: '.'
        }, {
          type: 'text-summary'
        }
      ]
    },
    // 服务器端口
    port: 9876,

    // 是否要有颜色
    colors: true,

    // logging的级别 可用值: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // 是否监听文件变动
    autoWatch: true,

    // 启动下列这些浏览器 可用的启动器: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome', 'PhantomJS'
    ],

    // 持续集成模式 如果是true，Karma只会运行一次并退出
    singleRun: false
  })
}
```

我这里引用了额外的`webpack.test.conf.js`的配置文件，可以视情况是否需要重新引入专为test准备的webpack配置，主要是去除一些压缩、提取css等步骤可以提高打包速度，另外有一个比较重要的一点是，需要增加`istanbul`的插件进行代码覆盖率测试。

这个插件需要在babel配置里加，可以选择直接在webpack里加上，也可以配置babel，首先安装cross-env和babel-istanbul, 

```shell
npm install babel-istanbul
```
然后在babelrc文件中配置如下

```shell
{
    "plugins": ["transform-decorators-legacy"],
   "presets": [
       ["es2015", {"loose": true}],
       "react",
       "stage-0"
   ],
    "env": {
        "test": {
            "presets": [
                [" ‘’es2015", {"loose": true}],
                "react",
                "stage-0"
            ],
            "plugins": [ "istanbul" ]
        }
    }
}

```
通过配置env字段，可以在node script中指定babel运行环境，这样babel就会使用test环境的配置。

```shell
cross-env BABEL_ENV=test karma start test/unit/karma.conf.js
```

# 和Enzyme的配合
Enzyme是Airbnb针对React的测试库，它是对官方的Test Utilities 的一个封装，因为官方的实在有一些难用。

Enzyme针对React的特点提供 Shallow Rendering 和 Full DOM Rendering 两种方式，Shallow Rendering 即只在虚拟的DOM上进行测试。

















