---
title: Using rxdb to make your node application more reactive
date: 2019-10-30 12:02:04
tags:
    - node
    - database
    - reactive
---

## 现状

随着前端技术逐渐成熟和稳定，以MVVM架构开发前端应用成为了基本共识，另外，尝试用node做BFF(Backend for frontend)的也越来越多，好处很明显，Javascript代码复用，尤其是如果用typescript的话，typings定义也可以在前后端复用。接入后端通用RPC框架后，前端和客户端可以复用接口。减少很多后台工作量。

但是还是有些问题。

### 本地存储

其中比较明显的是，客户端是有本地db存在的，所以针对客户端的后台接口很多都是**更新**的机制。举个例子：

假如这是个IM应用，那么一定存在通讯录这个功能，对于客户端来说，除了下载app后第一次打开是从后台拉取全部通讯录数据，后面再次访问通讯录时其实都是更新本地的通讯录数据，这个数据是存放在本地的数据库中的，比如`sqlite`。

而如果是web端，就不得不每次用HTTP协议拉取全部的通讯录数据，而且还不能做到实时更新，需要手动触发更新（http实现推送消息的方式都比较蛋疼，升级到websocket又有兼容问题，不过话说回来，2019了，websocket真应该多用用）。

其实致命的并不在于这点，致命的在于当初的美好涉想：和客户端公用接口这件事，变成了空中楼阁。

在浏览器环境，没有这样一个本地数据库做数据存储，

诶，不过我们有`indexDB`呀。确实，我们有`indexDB`，但是目前兼容性还不是特别理想，而且在可申请的存储空间方面，相比那些原生应用还是远远不够。

### 前端痛点

迁移到MVVM后，看起来我们似乎用最好的方式解决了View层的问题，所有DOM变更细节不用再关心，定义好View Model之后，我们唯一需要关注的就是数据本身而已。

但是数据并不是我们能够掌控的。

（未完待续）