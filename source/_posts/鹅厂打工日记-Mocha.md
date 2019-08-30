---
title: '[鹅厂打工日记]Mocha'
date: 2017-03-30 16:17:24
tags:
    - Test
    - Mocha
---
## 前言
以前从来没有用过测试框架，但是在腾讯这样的大公司，没有测试框架的规范显然是不行的，其实做测试也不难，最近接触了两个前端测试框架，一个是针对react的Jest，一个是已经享誉前端界的[Mocha](https://mochajs.org/)。

## 安装
还是那个npm的步骤，可以装本地也可以装全局
```bash
npm install mocha -g 
```
装完之后可以试一下，在任何一个目录创建一个`test.js`文件，然后在里面写一些`assert`，比如
```javascript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```
之后直接在这个目录运行`mocha`就可以了，这个测试用例无疑是通过的。

## ASSERTIONS
关于断言，Mocha默认用的是node官方的库[assert](https://nodejs.org/api/assert.html)，其实也可以使用`should.js`, `expect.js`等等不同风格的断言。

## 异步测试
使用异步非常简单，只需要往`it()`传入一个一般叫`done`的回调就行了，在需要测试的语句中，将`done`传入到异步函数的回调参数中，一旦异步函数完成，done被执行，这个异步就测试通过。
done会自动接收异步函数抛出的错误。

## Promise
如果使用Promise,就连`done`都不需要传，直接return 这个promise

## 同步的代码
如果是同步的代码，Mocha会一条条检查语句

## 箭头函数
不建议使用箭头函数，因为箭头函数自动绑定this会让断言函数失去Mocha的上下文。

## 钩子
Mocha提供了BDD风格的接口，包括了`before()`, `after()`, `beforeEach()`, `afterEach()`的钩子函数，这些函数顾名思义了。

## 几个函数
可以在assert的回调函数中调用`this.retries(num)`来让断言多执行几遍
可以不传回调给`it()`，这样最后就会提示有一个待处理的测试，属于`pending`
可以用`it.skip()`来跳过某个断言，这样最后也会报告`pending`
可以用`this.Timeout(3000)`来使得断言能够退后执行


