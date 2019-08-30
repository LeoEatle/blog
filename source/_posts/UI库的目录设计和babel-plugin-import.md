---
layout: antd
title: UI库的目录设计和babel-plugin-import
date: 2018-07-12 16:30:37
tags:
---
最近在规划小组里使用的UI库，事实上也已经开发了一段时间了，但是最近想使用antd这种引入的方式时出现了问题

```javascript
import { DatePicker } from 'antd'
```

这种引入方式自然是很爽的，但是如果不用[babel-plugin-import](https://github.com/ant-design/babel-plugin-import)做相应的转换的话，这样会把整个UI库都引入到代码中。

```javascript
import DatePicker from 'antd/lib/date-picker';  // 加载 JS
import 'antd/lib/date-picker/style/css';        // 加载 CSS
// import 'antd/lib/date-picker/style';         // 加载 LESS
```

还好`babel-plugin-import`是支持自定义`libraryName`的，甚至还能控制转换后的名字，就很开心的使用了。

本地开发并没有什么问题，但是到Linux机器上构建的时候，报错找不到组件。

嗯？我并没有使用参数把驼峰命名改为连字符，为什么也找不到呢。
原因就是Linux是大小写敏感的，但是OS X并不会。

我的组件库的目录是驼峰命名，生成的`lib`中的文件也是驼峰的，比如`checkBox`，但是我引入的时候是这样的：
```js
import { CheckBox } from '@tencent/ui-components'
```
一般我们的组件确实是会首字母大写，但这导致了转换之后是这样的：
```js
import CheckBox from '@tencent/ui-componts/lib/CheckBox'
```
这样就找不到了。

如果要解决这个问题，可以使用`babel-plugin-import`中的`customName`参数，自己去转换名字
如果是`babel 7.0`以上的话，直接在json里就能写了，如果不是，就得把json改为`babelrc.js`再写，有些麻烦的。

事实上目录似乎真的不适合驼峰命名，算是一个教训。

怪不得antd采用的是连字符命名目录，并且最后生成的`lib`中也是连字符命名，最后再用`babel-plugin-import`达到使用驼峰命名引入，但实际上引入的是连字符命名的效果。


