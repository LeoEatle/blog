---
title: '[iOS]官网的iOS Guide in Swift 6'
date: 2017-02-17 20:06:27
subtitle: "Create a Table View"
tags:
    - iOS
    - Swift
---

## 学习目标
1. 创建第二个storyboard场景
2. 理解table view中的重要的组件
3. 创建并设计一个自定义组件
4. 理解table view的代理和数据源
5. 使用一个数组来储存并处理数据
6. 在table view中展示动态数据

## Create the Meal List
到目前为止，这个应用只有一个场景，也就是说，只有一个屏幕的内容，在storyboard中，每一个场景都包含一个被view controller管理的视图，一个使徒是一个矩阵区域，它是属于`UIView`class或者它的其中一个子类的。在我们这个例子中，场景包含了view controller的内容视图，还有所有在Interface Builder加入的子视图。

现在我们应该创建另外一个展现meals列表的场景。幸运的事，iOS有一个内置的类，叫做`UITableView`，是专门用来展现一个可以滚动的列表的，一个`UITableView`被一个table view controller`UITableViewController`管理，这是一个`UIViewController`的子类，被用来处理table view相关的逻。你将用这个`UITableView`创建一个新的场景，这个controller会展现并且管理table view，事实上，这个table view就是controller的“content view“，它会填满这个场景整个共建。

**如何添加一个table view**
1. 打开story board
2. 打开Object library 
3. 找到Table View Controller object
4. 把一个Table View Contoller 拖进这个Canvas，并且放在已存在场景的左边

现在就应该有两个场景了，为了让用户看到的第一个场景是meal list，我们需要把entry point 指向我们的meal list，只需要把那个箭头拖过来指向meal list就行了。

如果现在你运行这个app，会发现meal list里面什么都没有，很正常，因为我们什么都还没有加。

**配置table view**
1. 在你的storyboard中，打开outline view 并且展开utility area
2. 选择Table View
3. 在选中状态下，在工具栏打开Size inspector
4. 找到标着"Row Height"的一栏，设置成“90”

## 设计自定义的Table Cells
Table Rows中的每一行都是一个`UITableViewCell`，这是一个用来负责渲染其中的内容的，Table view cells是一个有着各种预定义行为和样式的，然而，因为你需要在其中展现更多的内容和样式，你需要自定义一下。

**创建一个UITableViewCell的子类**
1. 展开Navigator area并且打开Project目录
2. 选择File > New > File(或者按下Command-N)
3. 在弹出来的对话框中，选择iOS
4. 选择Cocoa Touch Class，然后继续
5. 在Class输入框中输入Meal
6. 在"Subclass"输入框中选择`UITableViewCell`，class的名称会改变成"MealTableViewCell"，这是Xcode自动改的
7. 确定语言是Swift
8. 剩下的选项都保持默认就好，测试就不要选了
9. 点击创建，Xcode会生成一个定义了`MealTableViewCell`class的`MealTableViewCell.swift`文件

现在再次打开你的storyboard，你会发现在Table View中只有一个table view cell，这是这个table的原型cell，你可以定义并设计这个cell的行为，这个table就会创建这个cell的实例，但是首先你需要把table view cell链接到你刚刚创建的cell子类

**配置并自定义一个cell**
1. 在outline view中，选择Table View Cell
2. 在Attribute检查器中，选择Identifier并且输入`MealTableViewCell`
3. 打开Size检查器
4. 高度设为90
5. 打开Identity检查器
6. 将Class改为`MealTableViewCell`

这样配置好之后，你就可以在story board中定义界面了

**给自定义的table cell定义界面**





## Table View
Table View是UIView的一个子类，它的控制器事UITableViewController，这又是UIViewController的一个子类，所以我们就利用这个Controller来创建第二个Scene。
