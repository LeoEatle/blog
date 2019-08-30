---
title: React16源码解析（Fiber）
date: 2018-08-05 08:13:20
tags:
    - React
---

# 前言

在看这篇解析Fiber源码的文章之前，建议可以先去看看Fiber的相关文章，Fiber算法相比原来的虚拟DOM，其实在结构上还是保持了DOMElement和Fiber对象的对应关系，只是原来是用树的形式，Fiber改用了链表存储。

另外就是Fiber招牌的异步渲染，原来的React在render过程中如果组件过多，会导致浏览器忙于执行js而不会响应诸如onInput的事件。而Fiber能够中断这个render的过程，在一定时间内会检查是否有优先级更高的事件需要处理（这里是使用了浏览器的api`requestIdleCallback`，如果不支持，React16也提供了polyfill），如果有优先级更高的任务，就将render延后。

这是怎么做到的呢，其实Fiber内部除了当前的current树，还同时创建了一个`workInProgress`树，Fiber就在后者上做对应的render操作，并且将创建出来的`workInProgress`树和原来的树做differ，将需要变更的节点打上tag，之后会一起存到一个`sideEffect`的变量中，等待一次性地应用到真实的渲染上。如果这个过程超时了，就可以暂停，在下次`tick`中可以继续在`workInProgress`树上工作。虽然这样渲染也许会延迟一两帧，但人眼几乎感觉不到，相比input的卡顿好了太多。

# 根节点的创建

继续上篇文章的`ReactDOM.render`，我们先直接看根节点的FiberNode是如何创建的。

```js
const uninitializedFiber = createHostRootFiber(isAsync);
  const root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,

    earliestPendingTime: NoWork,
    latestPendingTime: NoWork,
    earliestSuspendedTime: NoWork,
    latestSuspendedTime: NoWork,
    latestPingedTime: NoWork,

    didError: false,

    pendingCommitExpirationTime: NoWork,
    finishedWork: null,
    timeoutHandle: noTimeout,
    context: null,
    pendingContext: null,
    hydrate,
    nextExpirationTimeToWorkOn: NoWork,
    expirationTime: NoWork,
    firstBatch: null,
    nextScheduledRoot: null,
  };
```

在这里定义了一个`root`长什么样，其中的`current`是一个未初始化的fiber，`fiber`的具体定义可以在`ReactFiber.js`中查看，里面对`Fiber`的定义注释非常详细，其中包括了一个Fiber节点是否在render状态，是否在compele状态，以及对于渲染时间的各种记录用于开发调试，我这里就不一一列举了。

对于我们这个根节点，唯一的特殊点就是这个FiberNode的`tag`属性为`HostRoot`。除了`HostRoot`，还有`HostPortal`、`Fragment`等多种tag，Fragment也同样是React16的特性之一。HostRoot之所以叫HostRoot而不是DOMRoot，是因为这个Host可以指代不同平台。

# this.setState的实现

既然已经了解了`ReactDOM.render`干了什么事，我们现在希望能更深入了解Fiber整个更新机制是怎样的，这就不得不提到`this.setState`的实现，回顾第一篇文章，在创建ReactElement的时候需要传入一个`updater`，我们也可以在项目中搜索这个`updater`，很快就发现是`enqueueSetState`这个函数。

```js
enqueueSetState(inst, payload, callback) { // 这就是传入的updater了
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback, 'setState');
      }
      update.callback = callback;
    }

    enqueueUpdate(fiber, update); // 关键
    scheduleWork(fiber, expirationTime); // 关键
  },
```
注意到下面两个函数的调用，事实上就是将一个update事件加入队列中，然后schedulework去调度。在调度任务中，会发现一个`markPendingPriorityLevel`方法，这个里面定义了每种update的优先级，像我们的`setState`优先级就不如`input`事件高。

但是其实目前的React即使检查优先级也没有开启异步渲染，所以当前这种杀手级的优化还没有发挥出它的实力。

顺着调用链会发现是这样的顺序

schedulreWork -> performWork -> performWorkOnRoot -> renderRoot -> workLoop -> performUnitOfWork -> completeUnitOfWork

`performUnitOfWork`这里其实简单的说就是开始了循环，在ok的情况下执行了`beginWork`，不断遍历Fiber链表寻找`children`和`sidbing`，这个过程在Fiber里叫做`reconcile`，是可以被打断的，我们可以看到`expireTime`一直作为参数传入。

# reconcile阶段

`biginWork`是个单独的文件，里面实现了对每个workInProgress链表节点相比current链表节点的differ算法，针对不同的`Fiber.tag`都有对应的update机制，这点其实应该是和之前大名鼎鼎的differ算法类似，只是这里用链表所以略有不同吧。

拿最典型的ClassComponent作为例子深入了解，在我们这个Class返回array的情况下调用路径是这样的

updateClassComponent -> finishClassComponent -> reconcileChildren -> reconcileChildFibers -> reconcileChildrenArray

```js
function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<*>,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    // This algorithm can't optimize by searching from boths ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.

    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.

    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.

    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.

    if (__DEV__) {
      // First, validate keys.
      let knownKeys = null;
      for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys);
      }
    }

    let resultingFirstChild: Fiber | null = null;
    let previousNewFiber: Fiber | null = null;

    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime,
      );
      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime,
        );
        if (!newFiber) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // Keep scanning and use the map to restore deleted items as moves.
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        expirationTime,
      );
      if (newFiber) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }
```

这个differ算法我就不详细说了，网上也有不少研究这个differ算法的文章。
同时，`beginWork`也对context、portal等新特性做了相关处理。这个阶段中组件会调用如`componentWillUnmount`钩子。

# commit阶段

在reconsile阶段结束后就进入了commit阶段。跟前面的`renderRoot`对应，这次是`compeletRoot` -> commitRoot -> commitAllLifeCycles

commit阶段会将current节点指向workInProgress，从根节点遍历调用sideEffect，以及各种生命周期钩子。