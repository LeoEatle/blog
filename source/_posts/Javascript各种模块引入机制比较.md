---
title: Javascript各种模块引入机制比较
date: 2016-12-07 13:53:00
subtitle: "ES6的import,AMD和CommonJS"
tags:
    - Javascript
    - ES6
    - Module
---

## ES6的import
先说ES6，ES6的import模块机制一个最大的优势就是静态加载，当我们输入这行的时候
`import { stat, exists, readFile } from 'fs'`
其实js只从fs模块中加载了其中三个方法

但是相比原来的CommonJS
`let { stat, exists, readFile } = require('fs') `
这里的fs必需是经过完全运行，即它的所有方法都被加载后，才在其中找到那三个方法，这种属于运行加载

静态加载一个很重要的好处是可以进行静态优化，

