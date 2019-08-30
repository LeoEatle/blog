---
title: '[iOS]官网的iOS Guide in Swift(3)'
date: 2017-01-25 12:41:13
subtitle: "Work with View Controllers"
tags:
    - Swift
    - iOS
---
怪不得写iOS的人都说，Apple官方的资料就是最好的学习资料，毕竟，Apple一手掌控所有Apple生态圈的api，没有人能比它更清楚自己的app应该怎么开发
很庆幸学习了官网的app开发教程，而且是英文原版，资料非常详细也很深入，让我们看到了Apple设计iOS时的想法路线是怎样的。

这是教程的第三部分，稍微改了下标题。

# Work with View Controllers

## 学习目标
1. 理解view controllers的生命周期和相应的回调函数，比如`viewDidLoad`
2. 在view controllers之间传递数据
3. 如何取消(dismiss)一个view controllers 
4. 如何使用手势识别器和手势事件
5. 基于`UIView/UIControl`类的代理预先定义好一个视图对象的行为
6. 把图像加入到工程的资源库中

教程用一张图清晰明了地表现了一个View Controller的生命周期：
![Life Circle](lifecircle.png)

是不是很像React的组件生命周期？界面编程果然都是相通的

这里教程突然提到这就是典型的MVC架构，啥？你之前不是还说iOS普遍是**action-target模式**吗？
我想了想，觉得可能它是指对于监听事件，是action-target，但是其实它的这个view controller，确实是典型的MVC模式思想

接下来我们需要给stack view中添加一个image view，并需要限制长宽比为1:1，这个通过Aspect Radio就可以做到，然后怎么给它添加默认图像呢？
首先把图片扔在Assets.xcassets，这里会需要设置是1x还是2x还是3x的图片，跟设备的Retina屏幕有关，然后我们在image view的右侧属性栏中通过下拉菜单就能选择图片

添加完之后重点来了：

一个image view并不属于**control**，它是属于**view**，
> A control (UIControl) is a subclass of UIView.
那我们该怎么让image view也能连接一个action到view controller呢，非常简单，我们需要一个手势识别器(Gesture Recognizer)
给image view附上一个`UITapGestureRecognizer`非常简单：
还是在右下角的objects找到`gestureRecognizer`然后拖到image view上就行了，这里我犯了个错误，就是我把它拖到整个stack view上了，结果后来我点击图片呼出photos的时候，就会报错，就算是在`info.plist`上写了权限也没用，这里一定要注意

之后我们就可以通过storyboard上面的dock中的gestureRecognizer拖一个action到code中了，步骤和之前的一样。
也就是说，通过这种方式，就好像给一个view加了个`eventListener`一样，监听了click事件，不管你是不是按钮，都可以触发相应的函数了

我们需要调用一个图片选择的界面，这是通过一个类`UIImagePickerController`实现的，同时我们也需要再在这个view controller上做一个代理，去handle关于image picker的相关方法，这点和之前的textfield代理是一样的道理
我们需要实现两个代理方法：`imagePickerControllerDidCancel`and`imagePickerController`,这里就不细说了

之后一定要记得设置好照片权限权限，否则imagePicker是弹不出来的。




