---
title: '鹅厂打工日记——Jest: 强大的React测试工具'
date: 2017-03-02 15:26:09
subtitle: 'React技术栈要用果然必须来一套'
tags:
    - React
    - Jest
    - 测试
---
React表面上看只是个专注View层的框架，然而如果要真正能够利用好它的强大功能，我们必须考虑Facebook为它打造的一整套生态圈。
管理数据流状态可以用Redux，配合Immutable更能提高React对比state变化的性能，但这一次要说说同样是FB开源计划的重要组成部分，Jest。

## Jest是什么
Jest是一个“0配置”测试平台，它其实不仅仅可以用来测试React项目，还可以测试各种javascript代码。当然，它对React有强力的支持。

## 开始
理所当然的第一步
`npm install --save-dev jest`

假设我们是要测试一个最简单的加法函数
```
function sum(a, b){
    return a + b;
}
module.exports = sum;
```

接下来，我们创建一个`sum.test.js`，其中包含了我们的测试用例
```
const sum = require('./sum');

test('add 1 + 2 to equal 3', ()=>{
    expect(sum(1, 2)).toBe(3);
});
```

给你的`package.json`加上test命令
```
"scripts": {
    "test": "jest"
}
```

最后，运行`npm test`，你会看到这些信息
```
PASS ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

感觉如何？你刚刚用Jest成功写了第一个测试用例！（我也是写测试的高手了）
