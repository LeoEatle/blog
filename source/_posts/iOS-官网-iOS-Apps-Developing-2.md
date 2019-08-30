---
title: '[iOS]官网 iOS Apps Developing(2)'
date: 2017-01-18 19:53:27
subtitle: "Connect the UI to the code"
tags:
    - iOS
    - Swift
---
## Connect the UI to Code
接下来我们就到了比较关键的，所有做前端/iOS/Android/Whatever的界面工程师遇到的最重要的问题
`Connect the UI to Code`
这个也是老生常谈了，现在也有除了经典的MVC框架外的MVVM、Redux等等

## Learning Objectives
1. 理解storyboard中的一个scene和view controller的关系
2. 创建UI和code之间的联系（使用outlets和actions）
3. 处理用户的输入并呈现在UI中
4. 实现一个遵从protocal的class
5. 理解代理模式
6. 遵守`target-action`模式来构建app

View Controller其实是贯穿了View（Scene）和Data Modal的
每个Scene都对应了一个view controller，所以当之后要增加更多的scene的时候，我们就需要自己去连接scene和view controller，在`Identity Inspector`中可以查看要连接的class，每个object都有自己的identity，其中就包括了自己属于哪个class。

但这仅仅是view和code连接的一部分，我们还需要创建`outlets`和`actions`来连接view和code

## outlets
创建的方式就是非常具有苹果特色的，按住`ctrl`然后拖出一个outlet到`ViewController`这个界面中，这样就在`ViewController`中创建了一个新的`property`，
`@IBOutlet weak var nameTextField: UITextField!`
这行代码非常重要
`@IBOutlet`代表的是你可以通过Interface Builder来连接这个属性，这就是为什么它是`IB`开头的
`weak`代表这个属性是可以被系统重新赋值的
最后的`!`代表这是一个[implicitly unwrapped optional](https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/GlossaryDefinitions.html#//apple_ref/doc/uid/TP40015214-CH12-SW50)，这个是用来修饰`UITextField`这个属性的，`implicitly`代表隐性，`optional`代表这个属性一旦被设置后就永远会有个值，当系统获取这个属性的时候，它就会默认它有个值并且自动解析它

当一个view controller被加载之后，系统就会实例化整个视图层级并给每个outlets赋值，当`viewDidLoad()`调用的时候能够保证每个outlets都已经被赋予了适当的值

所以outlets就是视图对象在view controleler中的引用，但我们还需要定义`actions`来响应用户的不同行为。

## actions
action其实就相当于前端编程中事件监听器，它会对用户特定的行为触发响应
iOS app编程其实也是事件驱动的，这可是官网的[原话](https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/ConnectTheUIToCode.html#//apple_ref/doc/uid/TP40015214-CH22-SW1)

创建一个action也是用从IB中按住ctrl拖动一条线到code的方式，但是`connection`的类型要选择`action`并且关于`type`的类型，默认是`any`，代表任何object都可以触发，但是在这里我们最好限定为`UIButton`，表示只有`UIButton`才可以触发这个action，

```
@IBAction func setDefaultLabelText(_ sender: UIButton) {}
```
这段代码就是自动生成的代码，`@IBAction`代表这是一个可以连接到Interface Builder的action，参数`sender`代表传入的参数是一个`UIButton`，这个method的名字当然就是`setDefaultLabelText`

然后我们可以在这个method中给之前声明好的`mealNameLabel.text`赋值，这里不需要给`"Default Text`声明`String`类型，因为Swift有个`type inference`的功能可以自动判断类型

**这就是一个经典的target-action设计模式的实现**
在这里，target就是ViewController，action就是`setDefaultLabelText`，发起这个event的就是这个`Set Default Text button`

**关于Delegate**
对于`TextField`事件的监听，我们就不能用简单的拖动来解决了，因为`TextField`必须要实现一个`Delegate`去处理它触发的事件，而这个`Delegate`可以是ViewController它自己
具体实现是这样的，首先在声明class的时候也声明实现`UITextFieldDelegate`这个protocal，然后在`viewDidLoad`方法中定义`nameTextField.delegate = self`，之后我们就可以在ViewController这个类中实现`TextFieldDelegate`协议中的方法了
比如`textFieldShouldReturn`，这是当键盘按下`return`之后触发的事件，我们需要在这其中取消[First Responder](https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/GlossaryDefinitions.html#//apple_ref/doc/uid/TP40015214-CH12-SW40)状态
比如`textFieldDidEndEditing`，这是在`textFieldShouldReturn`之后触发的 


