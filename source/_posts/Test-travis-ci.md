---
title: Test travis ci
date: 2017-11-30 22:14:58
tags:
    - ci
---
# This post is only for testing travis-ci

One thing worth mentioning is that in .travis.yml. When `git push <repo> <src>:<des>`, the src should be master if you set master as the watch branch. It seems like travis ci only pull `HEAD:` when it builds.
