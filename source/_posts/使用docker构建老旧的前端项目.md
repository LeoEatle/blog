---
title: 使用docker构建老旧的Node web项目
date: 2019-05-22 16:28:28
description: 并同时接入docker持续集成
tags:
    - docker
---

最近一直在尝试改造这个旧前端项目，想办法使它变得更现代化一点。但是困难重重。

最近尝试接入公司内部一个近似`Travis-CI`的持续集成平台，这个平台是通过临时创建一个docker环境去构建的，构建完即销毁，所以可以充分利用到资源，对于不同构建环境的兼容上，docker也能够完美解决各种环境问题。并且，这个平台是完全使用Node编写和公司内部开源的，使用的配置文件跟Travis非常相似，对于企业微信等外部工具的结合也很好。

其实对于一般的前端项目，想利用这个平台做CI非常简单，因为一般的Node项目接入CI只有3步：

```shell
git pull
npm install
npm run build
```

没了

但是我这个项目，极其有历史感。

使用grunt构建、node_modules采用svn external管理、没有使用npm管理模块、前后端不分离、使用backbone+jquery做前端、使用express并魔改了成面向对象的框架做后端、使用node版本是0.12...为什么升不上去，因为用了一堆自己写的C++ addon，导致与node版本绑定，而又没人没时间去重新构建出适合新版本node的C++插件...

所以这种不规范的项目想改造成现代化的，是极其困难的。这篇博客除了总结一些docker使用经验外，大部分是为了吐槽这个项目...

## Docker镜像的构建

### 添加基础库

首先的想法自然是使用目前官方的Node镜像，这样让CI平台直接拉取Node镜像去构建就可以了。但是很快发现，我们的项目依赖一个额外的node基础库，为了能够让node寻找模块的时候加入这个基础库，必须自己构建一个镜像。

这个倒也好解决，非常简单的两行dockerfile:

```docker
FROM node:6
# 设置一下mail_node_basic加入NODE_PATH
COPY mail_node_basic ./mail_node_basic
ENV NODE_PATH '/usr/local/lib/node_modules/:/mail_node_basic/'
```

不得不感慨docker果然是可以兼容万物万物兼容的，加个基础库这么简单，管你什么依赖通通打包二进制。再次证明标准化在计算机领域是多么重要的事情。

### 关于alpine和busybox

当我在CI中跑到rsync命令时，它会提示找不到`rsync`，原来这个node镜像是不包含各种平时使用的linux工具的，所以我不得不去找找其他人是怎么解决这个问题的。

看了很多docker镜像会发现，很多人都是基于`alpine`这个镜像，这是个什么镜像呢？这其实是个基础的linux镜像，因为非常纯净，所以可以构建出比较小的镜像，不会说动辄几个G。关键是，它包含了`apk`这个重要的包管理工具，有了它就可以像`apt-get`一样安装各种工具了。

而且，它包含了`busybox`，这是一个几乎只有1M的工具库，包含了我们平时常用的linux命令。

所以我又找到了一个官方推荐的`node-alpine`镜像，并基于它打包。这样我就能在`dockerfile`中安装各种工具了。

```docker
FROM node:6-alpine
RUN apk update
RUN apk add rsync openssh \
    && apk add --no-cache \
        libstdc++ \
    && apk add --no-cache --virtual .build-deps \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gnupg \
        libgcc \
        linux-headers \
        make \
        python
```

为了之后要安装C++的addon，把gcc也安装了。

### docker镜像的构建和推送镜像源

写好`dockerfile`之后，就可以进行打包了

`docker build -t ww/wwmngnjlogic .`


这里需要注意，如果你需要推送到某个镜像源，你要注意你当时的tag命名，否则你推送的虽然是`latest`，但其实是个旧的。
所以我的处理是还是自己去打tag标示镜像版本。比较直观一点。

![](https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/docker/docker_tag_push.png)

### 构建上的优化

由于这个项目之前是基于svn的增量构建，所以很多构建任务都是针对增量构建设计的。

webpack的设计是将所有资源处理并打包，在这之前的前端项目就是几乎是脚本构建，导致很多资源的处理方式极其分散。一旦全量构建会有各种问题。之前有很多md5缓存处理，所以得想办法把这种每次构建出来的缓存映射保存下来。

还好这个平台是支持缓存的，为什么每次重新生成docker依然能利用到缓存呢？其实原理就是将指明的缓存保存在一个母机上，每次要构建的时候拉下来，构建完生成的目录再推回去。

这样直接让我们的构建从全量**800s**减少到了**100s**

### People, people is the key

最关键的，还是人。

刚加入团队，要挑战他们一直以来习惯的svn增量构建、单独提交文件测试、增量发布的工作流程，这才是难度最大的事情。这个也是没有办法，从一开始的毫无头绪，到目前至少从技术层面上解决迁移到git的问题，我觉得我已经尽力了。接下来就是不断沟通，包括开发团队也包括测试团队。

而且目前还有很多事情并没有解决，比如node_modules中各种乱七八糟自建模块如何整理好用npm管理，比如如何把node版本提到8+，这些还需要更多时间和更多沟通。