---
title: nw.js的devtool要如何设置成dark主题（一段代码溯源史）
date: 2021-10-26 16:01:36
tags:
---
# 起因
最近接手QQ小程序开发者工具后有个问题非常膈应我，就是控制台的颜色是白色的，而工具其他地方的颜色都是深蓝色做底，这导致整体颜色看起来非常不和谐。

总结一下解决这个问题的思路和历程，其实也蛮有意思的。

![]()

# 过程
首先我当然是找到我们nw.js代码中设置devtools的部分，想看看是不是有什么接口可以控制这个devtool的主题，但是很可惜的是，nw.js并没有暴露太多参数，唯一可控的两个参数一个是`show`来控制是否显示开发者工具，另一个是`webview`来指定需要把工具显示的区域。

那我只好找到nw.js对于devtool控制的这段代码，而这是一段C++代码
```cpp
void ShowDevtools(bool show, content::WebContents* web_contents, content::WebContents* container) {
  content::RenderFrameHost* rfh = web_contents->GetMainFrame();
  if (container) {
    scoped_refptr<DevToolsAgentHost> agent_host(DevToolsAgentHost::GetOrCreateFor(web_contents));
    g_cdt_process_id = container->GetMainFrame()->GetProcess()->GetID();
    content::ChildProcessSecurityPolicy::GetInstance()->GrantAll(g_cdt_process_id);

    DevToolsWindow* window = DevToolsWindow::FindDevToolsWindow(agent_host.get());
    if (!window) {
      Profile* profile = Profile::FromBrowserContext(
             web_contents->GetBrowserContext());
      window = DevToolsWindow::Create(profile, nullptr, DevToolsWindow::kFrontendDefault, std::string(), false, std::string(), std::string(), false, false, container);
      if (!window)
        return;
      window->bindings_->AttachTo(agent_host);
    }
    return;
  }

  if (show) {
    DevToolsWindow::InspectElement(rfh, 0, 0);
    return;
  }
  scoped_refptr<DevToolsAgentHost> agent(
      DevToolsAgentHost::GetOrCreateFor(web_contents));
  DevToolsWindow* window = DevToolsWindow::FindDevToolsWindow(agent.get());
  if (window)
    window->InspectedContentsClosing();
}
```
同样可以非常可惜的发现，这里也没有能暴露出我们想控制的主题参数，这里只暴露了三个参数分别是`show`、`web_contents`、`container`
但是我们可以看到关键的这一行
```cpp
window = DevToolsWindow::Create(profile, nullptr, DevToolsWindow::kFrontendDefault, std::string(), false, std::string(), std::string(), false, false, container);
```
这里的DevToolsWindow是从chrome引用过来的，参数明显多了许多
```cpp
#include "chrome/browser/devtools/devtools_window.h"
```
通过搜索这一行引用的代码，我们可以找到chrome这块源码的位置
https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/devtools_window.h;bpv=1;bpt=0

那么显然，这个`profile`就是设置devtool主题的关键了，而这个`profile`就是由传入的webview获取而来的，而这个webview的属性，确实是我们可以控制的

https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/devtools_window.cc;l=137;drc=5539ecff898c79b0771340051d62bf81649e448d
```cpp
void SetPreferencesFromJson(Profile* profile, const std::string& json) {
  absl::optional<base::Value> parsed = base::JSONReader::Read(json);
  if (!parsed || !parsed->is_dict())
    return;
  DictionaryPrefUpdate update(profile->GetPrefs(), prefs::kDevToolsPreferences);
  for (auto dict_value : parsed->DictItems()) {
    if (!dict_value.second.is_string())
      continue;
    update.Get()->SetKey(dict_value.first, std::move(dict_value.second));
  }
}
```
那么我们现在有两个方案，第一种就是在`DevToolsWindow::Create`的时候，传入一个`setting`，另一种就是想办法先设置好`webview`的属性，然后就可以设置颜色了
现在的问题在于，我们如何知道哪一个setting属性是控制控制台的颜色呢？