---
title: Google Android System learning
date: 2017-03-03 02:40:43
subtitle: "Android真好啊，多线程真好啊"
tags:
    - Android
    - Linux
---

因为舍友最近在学习Android，自己也对他的代码产生了兴趣，今晚抽空看了一下Google官方的Android文档，虽然有些部分还没有被翻译，但是难得可贵的是中文翻译的还不错，否则我可能宁愿看英文版。
地址是(Android Developer)[https://developer.android.com/index.html]，我看的时候还是Android 7.0，虽然应该并没有多少人升级吧。

重点看了以下几个部分

## 四种组件
分别是

1. Activity
2. Service
3. 内容提供程序 
4. 广播接收器

### Activity
Activity实在是Android的重中之重，类比Web就是一个网页，但是它有几种状态，比如暂停和销毁
所有的Activity是放在一个栈中的，一旦调用finish方法就会被销毁，底下的Activity就会"浮上来"。

每个Activity可以指定一个或多个xml文件作为UI。

### Service
Service可以通过`Intent`进行调用，`Intent`也很重要之后再说，但是Service就像是隐藏在后台的线程，可以在后台处理一下下载任务之类的
它还分为启动和绑定两种，启动的话除非自己stop否则无限运行，绑定的话可以多个组件绑定，但是如果全部取消绑定这个Service就会被销毁

正因为一个组件可以绑定很多Service，我怀疑这是为什么一些全家桶互相唤醒使系统占用极高，让我们不得不使用绿色守护等软件的原因所在。

### 内容提供程序
内容提供程序提供一个中央数据存储区的访问，以一个或多个表呈现数据给外部应用，具体的应用有联系人列表啊日历啊之类的系统通用的东西

### 广播接收器
广播接收器这里的广播一般指的是系统级的广播，比如电量过低啦、屏幕关闭啦，每条广播也同样是一个`Intent`

## Intent
Intent这个东西有点像Redux中的Action，应该说是后者抄前者的吧，但是两者有很大不同，Redux中的Action是用来改变唯一的state的，这里的Intent却是可以发往所有的组件
它可以用来打开Activity，打开Service，发送广播等
Intent分两种，一种是显式的，只发往特定的组件，一种是隐式的，可以规定好MIME类型或者action类型来匹配可以接受的组件，比较常用的有需要打开一个地图显示自己的位置啦、需要打开相机应用啦，是不是现实中很常见

所有又有个Intent过滤器这个东西，定义了每个组件可以接受的Intent类型

Intent可以携带的信息其实蛮多的，除了类型、url之类的，还可以携带extra等大量信息，根据需要来用吧

为什么前端领域没有像Intent这么方便的传递消息的载体呢？关键还是在于前端的组件化仍然不够完善，这种Intent需要前端每个组件能够遵循一定的规范，有相应的resolver等等才能实现

**比如Android强调并且推崇的，可以从一个应用的组件发Intent到另一个应用的组件，这在web前端开发应该很难想象吧，你几乎没有办法从一个页面的组件传递消息到另一个页面的组件**

这就是平台统一的好处所在了。

## 进程和线程
Android是基于Linux开发的，https://developer.android.com/guide/platform/index.html 这里可以看到整个平台架构是怎样的

Android中，每个应用都独占一个进程，并且是独占一个VM！所以其实每个应用还是蛮隔离的，另外，正常情况下，一个应用所有组件共享同个进程/线程，但是我们可以安排一个组件在单独的进程执行，也可以创建额外的线程。

Android的内存管理也比较复杂，把进程分为了五个等级，这里不详述了，反正是尽可能利用内存，又尽可能的销毁不用的组件。其中一个关键点是**绑定了Service的进程重要度比较高**，这可能又是一个国内Android app都爱绑定Service的原因。

**还有个重点！**，那就是关于界面编程的。

## 异步和UI线程
说到界面编程，难免要提到关于用户监听啦、数据异步拉取啦之类的问题，相比web前端，这些移动端编程会有什么不同呢？

**得益于多线程！**Android是这样做的，应用分为UI线程（也是主线程）和工作线程，只有UI线程能够控制UI组件，工作线程就可以用来做一些其他工作，比如异步拉取数据。

具体怎么做呢，当界面监听Onclick触发的时候，就在函数里`new Thread`，这就是工作线程了，新线程中需要执行拉取数据的操作，再把这个返回值交给一个特定的类比如`mImageView`，只有这个类可以控制UI组件，切记不能在工作进程中控制UI组件。
Android也实现了一个AsyncTask来简化这个过程，代码像这样的：
```
public void onClick(View v) {
    new DownloadImageTask().execute("http://example.com/image.png");
}

private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
    /** The system calls this to perform work in a worker thread and
      * delivers it the parameters given to AsyncTask.execute() */
    protected Bitmap doInBackground(String... urls) {
        return loadImageFromNetwork(urls[0]);
    }

    /** The system calls this to perform work in the UI thread and delivers
      * the result from doInBackground() */
    protected void onPostExecute(Bitmap result) {
        mImageView.setImageBitmap(result);
    }
}
```
还是比ES6的`Promise`或者ES7的`async await`好多了啊啊啊。多线程果然有多线程的好。

## webview
最后看了点关于Android的webview，不愧是Google还是很重视webview的，详细介绍了如何写函数提供JS SDK给前端使用，使得js调用系统组件成为可能。

## 总结
虽然Android开发也是界面编程，却体验和web前端着实不同，不得不承认设计的更好一些，得益于统一的平台和Google专业的设计，再加上多线程处理异步和UI阻塞问题，不知道何时web前端也能有这样统一的组件编程体验呢...