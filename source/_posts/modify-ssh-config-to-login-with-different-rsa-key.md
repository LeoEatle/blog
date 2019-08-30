---
title: Modify ssh config to login with different rsa key
subtitle: And use proxy to connect different git server 
date: 2017-12-06 11:33:49
tags:
    - ssh
---

## ssh config
To config ssh, we can `touch` a config file in `~/.ssh` . Then we can config it like this:
```conf
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_github
    ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -H dev-proxy.oa.com:8080 %h %p
    protocol 2
    serverAliveInterval 60


Host git.code.oa.com
    HostName git.code.oa.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/tencent


## Host *
## 	StrictHostKeyChecking no
## 	UserKnownHostsFile=C:/Users/jeffjing/.ssh/known_hosts
```
Here we add two different Host. Now we will ssh to different host with different rsa key and identification.
 For Github, we use `ProxyCommand` to use a proxy server for visiting. The `connect.ext` is actually a `netcat` in Windows 10. 