---
title: jenkins问题定位
date: 2018-12-08 15:58:43
tags:
---

一个奇妙的周五早上，大家发现jenkins网站登不上去了，一查机器发现已经宕机。

虽然不知道什么原因，但是重启了。可怕的事情发生了，jenkins目录下的项目竟然全部失踪。

后来才定位到可能是公司的系统在检查机器的时候，发现占用空间过大，进行了清理，而我们的jenkins home目录恰好在那个清理范围内。

幸好每个项目接入成本并不高，因为在jenkins上创建项目已经有相关封装的脚本完成。只是jenkins上的一些插件、样式需要重新安装。

在项目都逐渐恢复之后查看了一下jenkins的目录，到底是哪个目录占用空间过高。

用到了`du`命令。

```bash
du -s --max-depth=1 .jenkins
```

发现是因为`.jenkins/workspace`的占用最大，达到了10G以上，这个目录是每个项目的代码存放目录。

继续深入一个项目进行检查，发现是`node_modules`占用最大，有些项目可以达到500M以上。

继续检查`node_modules`，并进行排序，这里将结果输出到一个txt文件中

```bash
du -sh * | sort -nr > size.txt
```

这里列出依赖大小前几名：

```
10M	    caniuse-db
8.0M	webpack-visualizer-plugin
8.0K	mem-fs
8.0K	findup-sync
8.0K	detect-conflict
7.8M	webpack-cli
7.5M	raven-js
7.5M	prettier
7.3M	core-js
7.1M	webpack
7.1M	rx
6.9M	api.js
6.3M	fork-ts-checker-webpack-plugin
6.2M	eslint
6.1M	less
5.9M	m-select
5.9M	@tencent
5.6M	http-proxy-middleware
5.6M	alloytouch
5.4M	yeoman-generator
5.3M	jsdom
5.2M	webpack-dev-server
5.2M	concurrently
5.1M	fbjs
4.8M	lodash
4.4M	jpeg-js
4.3M	stylelint
4.2M	handlebars
3.8M	fsevents
...
```

发现是某些依赖包尤其大，举几个例子：

1. `caniuse-db`，这个检查兼容性的依赖达到了恐怖的10M
2. `webpack-visualizer-plugin` 8.0M 这个分析插件可能是包含了一些图片资源，用于结果的展示，导致包很大
3. `prettier` 7.5M prettier光`bin`就达到了恐怖的**36685**行，没有进行压缩不知是出于何种考虑，可能是作为开发依赖所以无所谓吧，另外，除了prettier，eslint|stylelint 这些lint工具也都居于依赖包大小前列
4. `webpack`相关各种cli和插件，都挺大的

要解决这个问题，可以让每次项目构建后删除node_modules，但是重新构建的时候就必须重新下载。这个大概是时间换空间的解决策略...

总之，每个项目多少有些冗余的依赖，但关键还是我们的构建机器存储空间实在太小，总共才分配了30G...怎么也得1个T才够吧。

--- 

更新：

周一过来之后，才发现上周五定位的原因**完全是错误的！**

并不是因为公司将机器清理，而是存储集群出现了故障，导致我们本来用于存放jenkins的500G磁盘没有挂载上，jenkins在原来30G的系统盘上**重新创建了对应的路径**，于是我们惊喜地看到了**全新的Jenkins**，而且我们周五还重新为这个jenkins添加了一堆项目，导致30G根本支撑不住。

只要使用`df`这个命令，就能看到目前挂载上的所有硬盘。

知道原因之后，我们自然是欢喜地重新用

```
mount /dev/vdb1 /data2
``` 

将我们的500G大硬盘重新挂载上，原来的项目都回来了，并且我们写入了[fstab](https://www.howtogeek.com/howto/38125/htg-explains-what-is-the-linux-fstab-and-how-does-it-work/)文件，以后重启也会自动挂载上了，皆大欢喜。

---

没想到，周一这一天跟噩梦一样，jenkins动不动就崩溃，每次崩溃网站都无法登入，不知道项目构建哪个步骤报错，使用`ps ef| jenkins`，会找到一堆相关进程，无法定位。

每次报错，我只能先用`ps -aux|grep jenkins`找到jenkins进场，kill掉，再用java命令重启war包，很蛋疼。

终于到了下午，我发现我的项目构建npm报了一个错：

`no space left on device, write`


奇怪了，500G硬盘明明才占用30%，怎么会报错？我去网上查了查，原来这个错误可能是因为npm无法写入`.npm/cache`导致的，而这个目录，显然在系统盘。

原来我们的根目录已经占用100%了。

这时我又查到了这篇文章：https://cloud.tencent.com/developer/article/1005036

看来问题很明显了，我们在30G硬盘上的`/data2/.jenkins`依然存在，并且占用了全部的空间，但此时因为被新硬盘挂载上访问不到，所以也就无法删除。

必须使用

```bash
umount /dev/vdb1 /data2
```

先将硬盘卸载，再

```bash
rm -r -f /data2/ 
mkdir data2
mount /dev/vdb1 /data2
```

重新挂载。

`rm -r -f`敲得我心惊胆战，删除了接近十分钟，磁盘占用从100%降到54%。

目前看起来jenkins服务终于正常了...这中间被无数同事吐槽服务不稳定也就不说了...

好歹学会了不少Linux命令...

话说我们这机器cpu双核 2GHz真是弱的一笔啊...