---
title: Docker学习笔记
date: 2016-11-28 15:23:27
subtitle: 第一篇Docker
tags:
    - Docker
---
由于SegmentFault使用Docker进行部署，我开始学习Docker的使用

## 安装Docker
安装Docker非常简单，只需要在官网下载dmg文件安装即可，官网都有说明注意事项

## [Docker的原理](https://docs.docker.com/engine/getstarted/step_two/)
Docker有两个重要的概念，一个是image，一个是containers

这有点像虚拟机，一个是镜像，一个是容器。
镜像是不会改变的，容器是运行镜像的一个实例，如果你的本地没有这些镜像，docker会从它的hub上下载一个下来

你不需要担心镜像里的软件能否运行，一切交给Docker去做就好

DockerHub保管着大量的Docker镜像，可以在上面查找需要的镜像。

## 动手写一个Dock镜像

### 要做一个镜像，从Dockerfile开始
![docker](2016-11-28 at 下午4.11.png)

## 用网络连接容器
`docker network ls`这行命令可以看到Docker引擎自动安装的默认的网络

其中bridge是一个特殊的网络，除非你声明别的，Docker总是在你的容器中运行这一个网络。

`docker run -itd --name=networktest ubuntu`
先安装ubuntu这个容器
`docker network inspect bridge`这行命令可以检查bridge相关的ip地址

官网用一个例子证明了，就算是容器正在运行，它也可以动态地连接到不同的网络上

## 操作数据

你现在已经知道了一些基本的Docker概念啦，现在你应该学习如何在你的容器中管理你的数据

### Data volume & Data volume containers

一个数据卷是一个被特别设计的目录
每次一个Container被创建的时候，Data Volume就被创建了，它可以在容器间共享，当你更新一个镜像的时候，数据源也不会发生改变

每一个镜像的实例都是一系列的只读的文件系统层，下图显示了Ubuntu 15.04镜像所包含的4个层叠起来的镜像层
![image layer](image-layers.jpg)
Docker的存储引擎需要把个层栈联合起来并且提供一个合体的层
当你创建一个新的容器的时候，你其实是给这个栈的顶部添加了一个新的可写的层，这个层就是container layer，所有的对容器的操作，像是增删改查，都是在这个层中完成的，下图展示了一个基于Ubuntu 15.04的镜像
![container layer](container-layers.jpg)


