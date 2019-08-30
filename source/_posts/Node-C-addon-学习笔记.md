---
title: Node C++ addon 学习笔记
date: 2019-02-27 20:03:04
tags:
    - C++
---

最近在了解学习node C++相关的东西，因为确实也遇到了这方面的需求，老架构如果要升级node版本，必须将旧的、自己写的C++ addon重新编译，所以找了死月的那本书来看。下面做一些零碎的笔记。

# V8相关

## 句柄

`ToLocalChecked`是经常在代码中也在书中出现的一个函数，这个咋一看是个检查性质的函数，但其实不是，这是V8提供的API，用于将Maybe Handle转为Local Handle，见https://idom.me/articles/847.html。

`v8::Local<v8::Number>`是非常常见的句柄，代表Javascript本地句柄，`<v8::Number>`代表这是数值类型，与之类似，`<v8::String>`代表字符串类型。
另一种句柄`v8::Persistent<v8::String>`则是代表持久句柄。

这两种句柄都比较常见，而且V8给他们写了很多操作符重载。

`New`是本地句柄最重要的api，例如`Local<Number> Number::New(Isolate* isolate, double value);`，这是个静态方法，代表创建了一个JavaScript中的Number数据，然后返回引用这个数据的本地句柄。

再如`Clear`，是个成员函数，使用方法如下：

```c++
Local<Number> handle = Number::New(isolate, 233);
handle.Clear();
```

持久句柄一般是由一个本地句柄生成而来的，如
```c++
Local<Number> local = Number::New(isolate, 2333);
Persistent<Number> persistent_handle (isolate, local);
```

## 模板

这个模板并不是C++的模板，而是指Javascript的模具，可以用它来包装Javascript对象或者函数，这样Javascript才能调用他们。

`FunctionTemplate`和`ObjectTemplate`是两种最重要的模板，分别代表函数模板和对象模板。

### 函数模板

函数模板就是Javascript函数的模具，生成函数模板后，可以通过调用`GetFunction`方法来获取函数实体句柄，下面以项目中用到的代码为例：

```c++
Local<Function> SchemaConstructor() {
    Init();
    Local<FunctionTemplate> schemaTemplate = New(SchemaTemplate);
    return schemaTemplate->GetFunction();
}
```

### 对象模板

对象模板和函数模板对应，有一些设置属性的方法，个人觉得没什么特别的，不过值得注意的是有个方法是`SetCallAsFunctionHandler`，它可以给这个对象设置函数体。最后这个返回的实例就可以当作函数使用。