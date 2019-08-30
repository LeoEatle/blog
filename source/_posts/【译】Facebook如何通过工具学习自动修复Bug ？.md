---
title: 【译】Facebook如何通过工具学习自动修复Bug ？
date: 2018-11-17 20:35:30
tags:
    - facebook
    - translation
---

此文翻译自Facebook博客，地址：https://code.fb.com/developer-tools/getafix-how-facebook-tools-learn-to-fix-bugs-automatically/

译者：LeoEatle

---
## 写在前面

Facebook的这个Getafix确实能做到自动修复bug，不过目前来看能修复的bug非常有限，在文中详细介绍了null pointer这种bug的解决方案，但在现实中很多bug是跟业务相关的，计算机几乎不能理解。

所以在译者看来，目前这个工具只能算作一个加强版的Lint工具，并且还要依赖大量的代码库提交作为机器学习的原料，才能够做到修复一些经常出现的常规bug。文中也提到了Facebook内部的多种代码检查工具，这其中能够获取到的大量代码提交数据，是一般公司根本获取不到的。机器学习也就无从谈起。

不过能够将机器学习用于自动修复bug，的确是一个创新的尝试，希望之后这类工具能改进得越来越实用，甚至大家都能为之贡献修复代码的案例让它学习，最后成为通用的自动修复工具。

---

- 目前Facebook已经创造了一个叫做`Getafix`的工具，它可以自动找到bug的解决方案并且提供给工程师让他们去改，这能大大提高工程师的工作效率和代码质量。
- `Getafix`在同类工具中是第一个达到Facebook这样规模的，并且它已应用于生产环境，它为亿万用户的app不断改进稳定性和性能.
- `Getafix`增强了`Sapfix`的能力，`Sapfix`是一个用于寻找bug的测试工具。同样，`Getafix`也能为静态工具`Infer`提供解决方案。
- 因为`Getafix`会去学习工程师之前的代码，所以他提供的bug fix方案易读性非常强。
- `Getafix`相比之前的自动纠错工具，最大的提升点在于它能够从过去提交的代码中寻找到一种修bug的模式，它用到了一种强大的聚类算法（译者注：hierarchical clustering，一种机器学习算法），并且，它还会分析出bug行数的上下文，来给出一个最恰当的解决方案。

对于一个已经成熟的项目来说，代码库都无比复杂而且经常要更新。为了能够创造一个自动修bug的工具，我们可以让它去学习之前的代码提交，它就能从中学到一些套路并为新bug提供最佳的解决方案。

这个工具就是`Getafix`，它已经被应用到Facebook的生产环境，并且正在被应用于有亿万用户的app。它通过配合其他两个Facebook内部的测试工具来运作，不过理论上这个技术可以用于任何源代码。目前在Facebook，`Infer`作为静态分析工具，可以先找到bug的位置，例如在Android和Java中常见的null point错误，另外还有个自动测试系统，叫做`SapFix`，之前已经[有介绍过](https://code.fb.com/developer-tools/finding-and-fixing-software-bugs-automatically-with-sapfix-and-sapienz/)，也可以发现不少bug。这篇文章会专注于`Getafux`如何自动修bug，不会对如何找bug做更多的阐述。

`Getafix`的目的是为了让计算机去处理那些常规、固定的bug。当然依然还存在一些需要工程师亲自解决的复杂bug。这个工具分析数以千计的人类工程师提交的代码，以及这些代码的各种语境，从而发现一些隐藏的bug逻辑，修复之前的自动修复工具修不了的bug。

`Getafix`同样能够缩小修bug所做的代码改动的范围，这样它就能快速创造一个补丁，而不需要去通过遍历暴力破解。这种高效的实践才得以让它能够用于生产环境，同时，因为`Getafix`会从过去的代码中自动学习，所以它提交的代码改动对于人类来说都是简单易懂的。

对于`Infer`找到的null dereference bug，Getafix可以做到自动修复，同时，他也能通过对比新旧版本代码来解决一些代码质量问题。

## Getafix 和普通自动修复工具的不同点

目前业界中的自动修复工具主要被用来解决基本的问题，并且它们的修复方案都十分简单直观。比如，某个分析工具可能只会警告一些"dead exception"，开发者可能会忘了在`new Exception(...)`前面添加`throw`。这些都可以通过lint规则解决，并不需要知道代码的上下文。

Getafix显然提供了一个更通用的能力，它能通过分析代码上下文来提出解决方案。下面这个例子中，Getafix提供了一个PR来解决Infer在22行发现的bug

![Getafix_additional_images.003](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/Getafix_additional_images.003.png)

*一个简单的bug report，包括了Getafix生成的PR*

注意这个修复不仅仅依赖于`ctx`，也同样需要关注这个函数的返回类型。不像简单的lint修复，这种修复是Infer这种工具无法独自完成的。

下面这个图展示了另外一个Getafix修复bug的例子。尽管这些bug都一样（都属于null method call），每种修复方式却不一样。注意这些修复方式跟平时开发者所做的修复几乎没什么两样。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/getafix_4_codeblocks.png)

## 技术细节

Getafix的工具链由下图所示，在这个章节，我们会介绍下面三种主要组件的主要功能和所遇到的挑战。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/revised_getfix_treedifferencer.gif)


### Tree differencer在代码树的层次上进行比较。

首先一个抽象语法树比较器会比较两个版本的代码。它会检测一些经常出现的改bug的模式，比如在`if`语句前添加`@Nullable`或者`import`的注明，或者在一个`return`语句前面添加条件判断。下面这个例子中，如果`dog`是`null`提前`return`、`public`改为`private`、以及代码的删除都会被视为一个有效修改（concrete edits），这类修改都会被标注出来，

语法树比较器中一个难点是高效并准确地区分好前后两个树，这样才能正确找到我们要找的有效修改。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/Getafix_additional_images.002.png)

### 一种全新的寻找bugfix的模式

Getafix通过使用层次聚类(hierarchical clustering)技术，加上anti-unification——一种用来概括不同表达式的方法（译者注：可以访问[wikipedia](https://en.wikipedia.org/wiki/Anti-unification_(computer_science))查看更多关于这个方法的介绍，它就能够创造一个包含了所有树对比数据以及所隐含的修复模式集合。有了这个集合，我们就能抽象出可能会出现的“漏洞”。

下面的这个动图表现了分析出来的层次聚类解构树状图（和之前举的例子一致）。每一行都展现了一次修改，“修改前”的是紫色，“修改后”的是蓝色，并且还包括了一些其他数据。每个垂直的黑色条表示了层级，最顶部的黑色条包含了所有修改模式。次层级的被包含在更小的黑条中。Anti-unification把“如果dog是null，提前返回”这样的修改和之前的一个修改结合起来，他们唯一的区别是之前的修改是`dog.drink(water)`。这样的结果是产生了一个新的修改模式。图中的`h0`，代表了一个修改模式“漏洞”。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/Getafix_animation_7.gif)

接下来我们就可以用这样的修改模式解决相同结构的问题。当我们继续分析整个语法树的时候，更多这样的修改模式会被找出来。比如它可以把这种修改和`cat`相关的结合起来，解决动图中更上一层的问题。

这种层级匹配确确实实地帮助Getafix发现了不少可复用的代码改动。下面这张图展示了一个包含了Infer报告的2288次对于null指针的修复。我们所要寻找的bugfix模式，就隐含在这张图表内。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/dendogram_full_getafix_border.png	)

其实用anti-unification去寻找可复用模型之前就有人尝试过，但是有几个关键的改进使得Getafix能够为新bug提供有效的解决方案。

其中一个改进是我们把代码改动的上下文作为学习的重要依据。比如在前面的例子中，我们发现有两个修改都是在`dog.drink(...)`前面加上了`if (dog == null) return;`，尽管`dog.drink(..);`没有发生任何改变，这句代码依然被包含在了要前后对比的代码中，在更高层级的改动中，`dog.drink(...)`被合入了一个抽象层`h0.h1()`，后面我们会介绍一个更详细的例子。

一个传统的贪婪聚类算法是没有办法像这样去学习上下文的。因为贪婪聚类算法只会维护每一个聚类单独的信息，没有包括未改动的代码。比如，如果我们在`do(list.get())`前面加上了`if (list != null) return`，这类改动和前面的`dog.drink()`放到了一起，贪婪算法不知道要在什么地方加上return。而Getafix的算法就会保留这些上下文，从而找到修复方案。

除了上下文，我们还会将Infer的代码报告与这些修改结合在一起。这样我们就能够从相关的bug report中学习如何修复bug。Infer在报告中的"erroVar"会变成`h0`。这样我们就能够把代码中具体的变量名替换成`h0`，从而表示一种具体修改模式。

### Getafix如何创建补丁的

最后一步是把bug修复好。显然有很多种修复bug的方式。所以难点在于我们如何去选择一种最合适的方式去修一个bug。下面这个例子解释了一个我们是怎么解决这个难题的。

例子1 假设我们现在已经发现了前面找的这种修复：`h0.h1();` -> `if (h0 == null) return; h0.h1();`

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/getafix_codeblock3.png)


Getafix会通过下面步骤创建一个补丁

1. 在`mListView.clearListeners();`前面找到子语法树
2. 实例化“漏洞”`h0`和`h1`
3. 把找到的子语法树替换成实例化的代码

注意这里面的`mListView.clearListeners();`，如果没有这种未修改代码，有可能会变成`<nothing> → if (h0 == null) return;`，这可能会导致代码被加到`mListView.clearListeners();`后面，甚至是`mListView = null;`后面。

这种插入的模式其实也同样会出现在高层，比如`h0.h1()`。下个例子会介绍Getafix如何处理可能插入多个位置的情况。

例子2： 假设现在是这种模式：`h0.h1() → h0!=null && h0.h1()`

显然，这种情况也可以使用`if`条件语句和`return`表达式解决，所以我们当然也可以用这种方式去替换原来的代码。但是这样会使得像`mListView.clearListeners();`也会被匹配到，Getafix的分级策略会根据之前的数据推荐更显著的修改方案，比如对比例子1的这种修改和`if (h0.h1()) { ... } → if (h0!=null && h0.h1()) { ... }`这种修改，前者只会用于语句中而不是表达式中，那么前者获胜，因为它的描述更为具体，在分级策略中得分更高。

## 效果测试

Getafix在Facebook中被用于为Infer找到的空指针错误自动提交修复，也同样被用于解决一些比较明显的其他bug。

在一次测验中，我们对比为了解决空指针问题Getafix提交的fix和人类工程师提交的fix，这其中包含了大概200个提交并且每个提交改动不超过5行，结果发现，大概25%的Getafix的提交和人类的提交完全一致。

另一个测验是关于Instagram的代码库的，包含了大概2000个null method调用问题。Getafix可以尝试修复大概60%的bug。其中90%的修改都通过了自动测试。总体来说，Getafix成功地修复了1077（大概53%）个null method调用问题。

除了这种测试工具发现的bug，我们也将它应用到了之前code review中发现的bug中。结果是我们解决了几百个[return not nullable](https://fbinfer.com/docs/eradicate-warnings.html#ERADICATE_RETURN_NOT_NULLABLE)以及[field not nullable](https://fbinfer.com/docs/eradicate-warnings.html#ERADICATE_FIELD_NOT_NULLABLE)的bug。并且这些bug的解决率前者从56%提高到了62%，后者从51%提高到了59%。

Getafix也同样可以用于解决SapFix发现的crash问题，过去的几个月中，Getafix已经提供了超过一半的修复方案（全部测试通过）。从整个历史上来说，Getafix提供给SapFix的修复通过测试的成功率已经达到了80%。

## Getafix的影响力

Getafix已经帮助我们达到了让计算机处理常规bug的目的。但我们依然不断地改进测试和验证工具，我们希望能有一天Getafix可以解决更大型的问题。

我们也注意到不能只让Getafix处理Infer找到的那些bug，其实它也可以处理那些人工发现的bug，这能大大提高解决code review中发现的问题的效率。也就是说，一个曾经在代码库中多次出现的错误，可以未来的提交中自动修复，并不需要一个人去手动提交。

Getafix是我们基于静态分析工具以及大型代码库创造出来的智能工具。这种工具对于改进软件开发周期、提高开发效率很有帮助。将来，我们在开发Getafix中获得的经验也一定能帮助我们创造更好的同类工具。

