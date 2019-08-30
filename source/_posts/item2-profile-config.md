---
title: item2 profile config
date: 2019-01-21 12:06:49
tags:
    - shell
---

When you want to use item2 profile for automatically `ssh`, you may write such a script.


```
#!/usr/bin/expect -f
set port xxx
set user xxx
set host xxx
set password xxx
set timeout -1

spawn ssh -p$port $user@$host
expect "*assword:*"
send "$password\r"
interact
expect eof
```

You should realize that it is not a shell script. If you try to `sh xxx.sh`, you will find that `spawn is not a command` and `expect is not a command`. That is because these commands only exist in `expect` environment. 

So, you must save it as `xxx` without the postfix `sh`. 

Then you should open the preference of item2 and add a new profile for it.

---

Sometimes you will find that it will fail and show a modal window. But it will not show any errors about this script. This does confuse me a lot. 

After a list of debug, I found that is because I don't have the permission of this script.

So we should use `chmod` to change the permission of this script.

We can use `chmod a+x xxx`

`a` is for all users.

`x` is for the permission.

There are also other params and please read [this](https://zh.wikipedia.org/wiki/Chmod) for more information.