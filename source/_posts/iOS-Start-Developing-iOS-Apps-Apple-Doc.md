---
title: '[iOS]官网 iOS Apps Developing(1)'
date: 2017-01-13 20:02:46
subtitle: 'Build a Basic UI'
tags:
    - iOS
    - Swift
---
[官网的教程](https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/BuildABasicUI.html#//apple_ref/doc/uid/TP40015214-CH5-SW1)总是最新、最全、最正确的，我将按照官网提供的不同步骤记下我的翻译和思考。
官网提供的教程非常新，也十分适合入门，这里只是记下几个tips：

## 关于AppDelegate
1. AppDelegate.Swift这个文件创建你的app内容的渲染区域，并且提供了代码来表现state的改变
2. 它也创建了一个你app的进入点，并且开始开启并运行了一个循环，这个循环不断地递交input事件到你的app，这个工作是通过`UIApplicationMain`来完成的
3. 这个`UIApplicationMain`相当于调用了一个`UIApplicationMain`函数并且把你的`AppDelegate`的类名作为代理类名，作为回应，系统会创建一个application object，这个application object用来负责管理应用的生命周期，这个系统也同样创建了一个`AppDelegate`类的实例并且把它赋值给这个appliation object，最后系统会启动你的app。

这个AppDelegate是自动创建的，这个类采用了`UIApplicationDelegate`协议，这个协议定义了一下你必须要设置的app方法去回应状态的改变和响应app级的事件。

这个类包含了一个单独的属性：`window`
`var window: UIWindow?`
这个属性保存了一个对app的window的一个引用，这个window代表了你app的视图层级，它是你所有app内容渲染的地方，注意window这个属性是可选的，所以说它有时候可能是`nil`

AppDelegate也包含了下面这些实现
```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool
func applicationWillResignActive(_ application: UIApplication)
func applicationDidEnterBackground(_ application: UIApplication)
func applicationWillEnterForeground(_ application: UIApplication)
func applicationDidBecomeActive(_ application: UIApplication)
func applicationWillTerminate(_ application: UIApplication)
```
这些方法可以让app对象能够与app委托进行通信从而实现一些比如启动app、转到后台、停止app的时候，app对象就可以调用对应的委托方法，让你的app有机会去做一些响应，你不需要去保证这些方法会在该被调用的时候被调用，app对象会替你做这些事情。

每一个委托方法都有一个默认行为，如果你把他们留空或者把它们删除了，那么默认的行为就会被调用。所以你也可以写你自己的代码来覆盖这些磨人的行为。

这些模版同样提供了大量注释来解释每个方法的作用，你可以把它们当做你的蓝图。

## The View Controller Source File
`ViewController.swift`这个文件定义了`UIViewController`的一个子类，一开始这个类只是简单地继承了`UIViewController`的行为，你需要自己覆盖这些行为。
> 这里用到了`override`关键字

现在你应该看到你的`ViewController.swift`是这个样子的：
```
import UIKit
 
class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
}
```

## Open Your Storyboard
这段我就跳过吧比较简单...

## Build the Basic UI
Xcode提供了一个物件的库，里面有按钮啊、文本框啊，还有视图控制器和手势识别器，这些是不显示出来的。

所有的物件都属于`UIView`类型或者是它它其中的一个子类，许多`UIView`子类都被高度定义化了，

比如text field，注意如果要定义这个物件的属性，都在属性栏里，属性栏就是那个有个尖尖的朝下的那个标志下面，这真是个好东西，我可以定义placeholder，可以定义在键盘上显示完成是`Done`还是`Google`还是`Go`

每一个场景只有一个top view，一般就是叫`View`，所有的子视图都在里面，

可以查看辅助按钮（就是两个圆圈相连的那个）来看预览，选择`Main.storyboard(Preview)`就可以了

**关于Auto Layout**
这是iOS布局非常重要的一个机制，它通过设置`contrainter`来控制组件的位置，可以设置离父组件左、右、top等距离多少，还可以将几个组件组合成一个stack view进行控制，这样就可以适配不同代iphone还有各种尺寸的ipad了，不需要写一堆`if`去排版
