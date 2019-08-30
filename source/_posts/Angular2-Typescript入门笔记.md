---
title: Angular2+Typescript入门笔记
date: 2016-11-30 11:04:56
tags:
    - Angular2
    - Typescript
---
最近尝试用Angular2来做一个经典的后台管理系统，毕竟Angular2出了这么久，我相信Google的实力，而且对微软的Typescript也很感兴趣，没想到这两者会进行结合，总之就是特别想试试这种开发体验啊啊啊。

## 环境配置

首先用了官方的配置seed，`npm start`后，它会使用lite-server作为服务器，并且用`tsc`命令将ts编译好。

注意看app目录中的三个ts文件
```
app
- app.component.ts
- app.module.ts
- main.ts
```
app.component.ts 是定义了AppComponent的文件，它是所有组件的根组件
app.module.ts 定义了AppModule，它是根模块，此时它只声明了AppComponent一个组件
main.ts 编译整个应用

## 英雄的旅程——初尝Angular

保持npm start，它会监听你的文件改变并动态编译typescript

首先我们修改app.component.ts。把我们的组件修改如下
```
export class AppComponent {
  title = 'Tour of Heroes';
  hero = 'Windstorm';
}
```
这样我们就增加了两个变量，一个是`title`，一个是`hero`
然后我们修改模版如下
```
template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>'

```
这样我们的界面就会随变量改变。
保存之后网页会动态随之改变

### Hero Object
此时我们的英雄只有一个名字，它还需要更多的属性！我们把它变成一个类吧

在app.component.ts中加入以下代码
```
export class Hero {
  id: number;
  name: string;
}

```
我们可以在要export的组件中初始化一个英雄，像这样
```
hero: Hero = {
  id: 1,
  name: 'Windstorm'
};
```
由于hero被改为了一个对象，模版也需要进行相应的修改
`template: '<h1>{{title}}</h1><h2>{{hero.name}} details!</h2>`

### Adding more HTML

在ES2015和Typescript中，多行模版字符的特性都是被支持的，因此我们可以把模版改为这个样子

```
template:`
  <h1>{{title}}</h1>
  <h2>{{hero.name}} details!</h2>
  <div><label>id: </label>{{hero.id}}</div>
  <div>
    <label>name: </label>
    <input value="{{hero.name}}" placeholder="name">
  </div>
  `
```
而不是这样

`template: '<h1>{{title}}</h1><h2>{{hero.name}} details!</h2><div><label>id: </label>{{hero.id}}</div><div><label>name: </label>{{hero.name}}</div>'`

但是我们发现，当我们修改input文本框中的值时，hero的名字并没有随之改变，这和我认识的Angular双向绑定不一样啊！
其实这里只是单向的一个绑定。

### Two-Way Binding
如果我们需要一个双向绑定应该如何做呢，在我们引入双向绑定前，我们需要引入`FormsModule`这个包，将它加入到`NgModule`修饰的`import`数组里
然后把`<input>`替换成下面这个

`<input [(ngModel)]="hero.name" placeholder="name">`

这里用到了内置的ngModel指令

## Adding more Heroes
我们先创建一群Heroes：
```
const HEROES: Hero[] = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];
```
这里当然可以替换成Ajax获取数据，然后我们需要在export的component中定义`heroes = HEROES`，这一点很重要，否则模版找不到需要替换的变量

接下来我们需要使用到`*ngFor`这个命令来创建一连串的Heroes

`<li *ngFor="let hero of heroes">`

> 这里的*号非常重要

通过let这个关键字，将hero定义为用来生成模版的变量。就和React中的那个map函数，一样的效果。

接下来我们还可以给我们的组件添加style，这个style需要添加在`@Component`修饰的变量里，并且这个组件的style不会影响到其它的组件

## 绑定函数
接下来我们还是得看看怎么去绑定函数了，反正渲染列表、分别绑定函数几乎是每个框架必备的技能了

在Angular2中，绑定函数是这个样子的
```
<li *ngFor="let hero of heroes" (click)="onSelect(hero)">
  <span class="badge">{{hero.id}}</span> {{hero.name}}
</li>

```
括号代表的是把`click`事件作为目标，等号右边代表的是将要调用的AppComponent方法，`onSelect()`把模版输入变量`hero`作为一个参数传进去，这是和之前在`ngFor`里定义的是一样的

当没有英雄被选中时，selectedHero为undefined，所以我们需要加一个判断`ngif`，保证有被选中的英雄再显示他的名字

现在算是实现了一件事，那就是把`hero === selectedHero`这个信息通过`selected`的类名添加移除传递到了View层，嗯...真不简单

## 模块复用
接下来我们来看看Angular2怎么进行模块复用，我尽量简短说我的理解
其实差不多是以下几步：
1. 在app.module.ts中定义一个新的组件名，加入到`declaration`数组里
2. 创建一个新的组件文件叫做xxxx.component.ts
3. 在这个组件里的`@Component`中写上你的`selector`,`template`然后export这个类，如果你有什么props是需要绑定的，需要用`@Input()`修饰
4. 别忘了检查下你要import的其它组件或者类齐了没，没错！ts的类还是很好用的，没有就创建一个新的ts
5. 在里要引入这个新组件的地方，你就可以用尖括号`<selector-name [prop-name] = xxx></selector-name>`了

总之要定义的地方很多，但似乎定义好后复用性很强的样子

## 创建服务
这是我比较难理解的一部分，我尽量简单说我的理解
Angular2希望把服务这部分逻辑也分离出来，也就是我们平时用ajax拉取数据的这部分逻辑
它就把这部分又新建了一个组件进行封装

重要的地方是，它使用了`依赖注入`的概念，给export的服务类加了个`@Injectable`修饰
在我们需要用到这个服务的地方，我们不应该直接new一个这个service，我们应该把创建service的函数作为参数加入到组件类的`constructor`中
然后我们还需要在`@Component`中定义一个`provider`数组，包括了所有需要注入的服务

这样做的意义是什么呢，当我们需要修改服务的逻辑，比如需要在本地测试和上线网络环境拉取数据方式不同，我们不需要担心用到这个服务的地方需要改动，因为创建这个服务实例的操作不是在用它的地方创建的，而是Angular帮我们创建的
嘛，这大概就是依赖注入比较经典的地方

另外教程提到了生命周期这个概念，嘛，和React差不多，只是Angular还需要引入一个模块才能用，比如`OnInit`

教程建议服务类中用Promise拉取数据

## 路由
Angular2中的路由也需要引入一个新的模块（真是各种模块啊）


