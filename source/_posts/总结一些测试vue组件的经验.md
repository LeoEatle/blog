---
title: 总结一些测试vue组件的经验
date: 2021-03-02 22:03:00
tags:
    - typescript
    - jest
---

最近在升级vue组件的过程中，除了改造成typescript + class style的实现方式外，还用了typescript + jest的方式写了单元测试，这里记录一些写vue的单元测试需要注意的东西

# shallow mount 和 mount
`@vue/test-utils`中是有两种mount方法的，一种是`shallowMount`一种是`mount`，其实对于一般的props测试，method测试，使用`shallowMount`就完全足够了，但是如果出现里面嵌套了比较深的按钮，而你需要触发这个按钮的点击事件来进行事件测试的时候，会发现`shallowMount`是无法渲染出深层的button的。

见以下示例：
```tpl
<div ref="container" class="dialog_container" :style="containerStyle">
    <div ref="dialog" :class="['wwui_uiedit_dialog dialog_box', dialogClass]" :style="dialogStyle">
        <div v-if="useFooter" class="wwui_uiedit_dialog_foot">
            <!-- @slot footer内容 -->
            <slot name="footer">
                <Button v-if="showCancelBtn" class="wwui_uiedit_dialog_footer_btn" @click="$emit('close', $event)">{{cancel}}</Button>
                <Button class="wwui_uiedit_dialog_footer_btn wwui_button__Blue" :disabled="disabled" @click="submit">{{ok}}</Button>
            </slot>
        </div>
    </div>
</div>
```


```typescript
test('点击确认按钮触发submit事件', async () => {
    const wrapper: Wrapper<UIEdit> = mount(UIEdit, { // 注意这里必须用mount而不是shallowMount
        propsData: {
            disabled: false
        }
    });
    (wrapper as any).findAll('.wwui_uiedit_dialog_footer_btn').at(1).trigger('click')
    await wrapper.vm.$nextTick()
    console.log('emitted', wrapper.emitted())
    expect(wrapper.emitted('submit')).toBeTruthy()
})
```
# 静态方法的测试方式
有一些比如tip这种组件，会有一些静态的调用方式比如`Tip.error()`这种方法，在测试这种方法的时候，要注意返回这个实例用于测试

```typescript
test('Tips.error', (done) => {
    const testWord = 'test'
    const spy = jest.spyOn((Tips as any), 'show')
    const instance = (Tips as any).err(testWord)
    const options = { 'delay': undefined, 'msg': testWord, 'tipBindElement': undefined, 'type': NOTICE_TYPE.ERROR }
    expect(spy).toHaveBeenCalledWith(options)
    expect(instance.$props.msg).toEqual(testWord)
    const destroySpy = jest.spyOn(instance, 'destroy')
    setTimeout(() => {
        expect(destroySpy).toHaveBeenCalledTimes(1)
        done()
    }, DEFAULT_DELAY + 100)
})
```

通过`jest.spyOn`的方式就可以轻松的监听到各种函数的调用

如果是有进行一些dom元素的绑定，可以使用一个fakeElement来作为监听的对象

```typescript
test('挂载特殊容器', () => {
    const testWord = 'show'
    const fakeElement = {
        appendChild: () => {
            // fake appendChild
        }
    }
    const spy = jest.spyOn(fakeElement, 'appendChild')
    const instance = (Tips as any).err(testWord, 1000, fakeElement)
    expect(spy).toHaveBeenCalledWith(instance.$el)
    expect(instance.$props.msg).toEqual(testWord)
})
```

注意这里我使用了一个fakeElement来作为被监听的对象，监听是否有调用`appendChild`这个方法

# 绑定到document的事件测试

有些事件我们会在组件中绑定到document，比如回车事件，但是如果在测试用例中尝试触发回车事件，可能会发现没有响应，这是因为，必须要在mount的时候加上一个参数`attachToDocument`，才能真正触发在document中触发的事件

```typescript
test('回车触发submit事件', async () => {
    const wrapper: Wrapper<UIEdit> = mount(UIEdit, {
        propsData: {
            disabled: false
        },
        attachToDocument: true // 注意这个参数
    })
    const spy = jest.spyOn((wrapper.vm as any), 'onKeyDown')
    wrapper.trigger('keydown.enter')
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('submit')).toBeTruthy()
})
```
