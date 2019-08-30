---
title: 【译】如何使用iOS的捷径生成PWA图标和web app manifest
date: 2019-01-11 10:48:32
tags:
    - translate
---

原文： https://bitsofco.de/a-siri-shortcut-to-generate-pwa-icons-and-web-app-manifest/

iOS 12发布了“捷径”这个功能，事实上这功能有很多想象空间。它其实包含了很多自动化工具，可以视为一种可视化编程。除了运行脚本外，它还可以被用来操作图片，这让我产生了一个想法，我完全可以使用“捷径”来为PWA自动产生不同大小的图标。

# 使用捷径

要使用这个捷径，你所要做的不过是传入应用的名称和原始图标文件。这里有个视频录制了大概的流程。

这个捷径将产生32px, 48px, 128px, 144px, 152px, 192px, 256px, 和 512px不同大小的图标以及对应的`manifest.json`。另外，还会产生一个`head.html`，里面包含了对于各个图标的`<link>`链接。

```json
{
    "name": "bitsofcode",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#fff",
    "icons": [
        {
            "src": "/icon-32.png",
            "sizes": "32x32",
            "type": "image/png"
        },
        {
            "src": "/icon-48.png",
            "sizes": "48x48",
            "type": "image/png"
        },
        {
            "src": "/icon-128.png",
            "sizes": "128x128",
            "type": "image/png"
        },
        {
            "src": "/icon-144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "/icon-152.png",
            "sizes": "152x152",
            "type": "image/png"
        },
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

```html
<head>
    <title>bitsofcode</title>
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png">
    <link rel="icon" type="image/png" sizes="128x128" href="/icon-128.png">
    <link rel="icon" type="image/png" sizes="144x144" href="/icon-144.png">
    <link rel="icon" type="image/png" sizes="152x152" href="/icon-152.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
    <link rel="icon" type="image/png" sizes="256x256" href="/icon-256.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
    <meta name="apple-touch-icon" sizes="152x152" href="/icon-152.png">
    <meta name="msapplication-TileImage" sizes="144x144" href="/icon-144.png">
</head>
```

# 分步讲解

Siri捷径的语法可能需要花上一段时间去适应，不过其实和代码也没什么区别。我们可以使用变量、if/else、循环、甚至是结构化的数据比如数组和对象。

你可以[在这里](https://bitsofco.de/content/images/2018/12/Full.png)查看捷径的整个流程图。不过现在我会把每一步分解开来讲解。

## 获取应用名称

<div style="display: flex">
<img style="width: 50%; height: 50%; margin-right: 20px;" src="https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/1.png
"/>
<p>
首先我们要做的是让用户输入应用完整的名称作为变量存储，这个变量将被用来作为生成目录的名字，也同样被用来web app manifest中的名字。
</p>
</div>

## 获取原始图标

<div style="display: flex">
<img style="width: 50%; height: 50%; margin-right: 20px;" src="https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/2.png
"/>
<p>
下一步是提示用户从图片库选择一张图片作为原始图标，并且把它存入`Image`变量，文件拓展名设置为`Image Extension`。

这里需要检查图标是否是正方形，如果不是的话，会给用户弹警告，表示图标会被裁剪。

将来在这里可以做更多的检查，比如检查图片格式是否正确、大小是否在512px以上。
</p>
</div>

## 准备目录、manifest和head文件

<div style="display: flex">
<img style="width: 50%; height: 50%; margin-right: 20px;" src="https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/3.png
"/>
<p>
下一步创建一个目录，并且把这个目录存储为`Folder`变量，这个目录被命名在应用名之后。

然后，我创建了`head.html`和`manifest.json`，随着捷径流程进行，还会有其他内容填充到这些文件中。
</p>
</div>

## 创建图标

<div style="display: flex">
<img style="width: 50%; height: 50%; margin-right: 20px;" src="https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/4.png
"/>
<p>
下一步是创建不同的图标大小。我先创建一个有`icon_sizes`的字典，这个字段包含了所有产生的图标大小。通过遍历这个字段，我们直接使用捷径自带的`Resize Image`来重新调整每个图片的大小。另外，也给`head.html`和`manifest.json`添加对应的icon细节。
</p>
</div>

## 完成head.html和manifest.json

<div style="display: flex">
<img style="width: 50%; height: 50%; margin-right: 20px;" src="https://tuchuang-1251767583.cos.ap-guangzhou.myqcloud.com/5-1.png
"/>
<p>
最后一步，就是拼接一下`head.html`和`manifest.json`，然后保存在同个目录。
</p>
</div>


# 下载捷径

如果你想要自己使用这个捷径，你可以[在这里](https://www.icloud.com/shortcuts/f7adf6b082664f17afc2389b79f9dfd3)下载捷径。