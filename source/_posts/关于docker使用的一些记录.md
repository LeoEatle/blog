---
title: 关于docker使用的一些记录
date: 2019-08-28 14:28:11
tags:
    - docker
---
虽然平时就在使用docker但是对于docker命令的一些参数还是不太了解，在这里记录一下。

# `docker` 的 `-i` 和 `-t`
经常遇到的一个命令是进入一个docker，往往这样进入

```
docker exec -it V2.7.8_FinalDocker su - root
```

后面的参数就是要执行的命令，`su - root`和`su -`其实是一样的，加上`-`是为了保持环境变量并使用root账号登录，如果不加`-`，环境变量无法得到保留。[参考链接](https://linux.cn/article-8404-1.html)

那么前面的`-it`参数又是做什么的呢？

```
-i, --interactive          Keep STDIN open even if not attached
```
保持输入的打开，但是，如果你只加`-i`运行，会发现docker马上执行完并关闭了容器，无法进入终端。

```
-t, --tty                  Allocate a pseudo-TTY
```
分配一个[TTY](https://unix.stackexchange.com/questions/21147/what-are-pseudo-terminals-pty-tty)，只有分配了TTY之后才能通过伪终端输入到docker，并输出到伪终端，这就是为什么大多数docker命令都有`-it`这个参数。

那么为什么还要`-i`这个参数呀，因为也有应用场景，可以作为[管道输出](https://stackoverflow.com/questions/35459652/when-would-i-use-interactive-without-tty-in-a-docker-container)。


