---
title: One example of Typescript generics
subtitle: 用一个例子理解Typescript的泛型
date: 2019-12-02 21:53:29
tags:
    - Typescript
---

When I learned about Typescript at like two years ago, I just can't figure out the meaning of generics.
For a programmer who start coding by writing script language such as javascript or python, it's really hard to understand why we need generics in a typing system. This is one of the cons about getting used to script language. You just lose sensitive feeling about the importance of types in computer languages.

But recently I found a very good example to describe why generics is useful and neccessary in a typing system. (Forgive me I can only use 'good' as an adj.)

This example is from our very familiar friend, browser DOM API. And it is also a very common scene. This API is `addEventListener`.

Yeah, now you can open [typescript playground](http://www.typescriptlang.org/play/) and try to enter these typescript code:

```typescript
addEventListener('click', function (ev) {
    // ev typing
})

addEventListener('hashchange', function (ev) {
    // ev typing
})
```

When you type `ev` in the callback, you'll find that the typings of ev are just different.

For `click` event, it has propertes like `ev.button`.

For `hashchange` event, it has propertes like `ev.newURL`.

How do typescript know we are listening a specific event and give correct event typing to the callback? 

Or we can use a more generic speak. How do we limit the second parameter according to the first parameter? Or even check the return value according to what we pass to it?

OK, now we just `git clone https://github.com/microsoft/TypeScript.git` and figure it out.
(Of course, you can just browse https://github.com/microsoft/TypeScript to explore the code.)

Let's search `lib.dom.d.ts` and `declare function addEventListener`. Or you can just visit https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L19966. Here we go

```typescript
declare function addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
```

This is, of course, the definition of `addEventListener`.

We can see `<K extends keyof WindowEventMap>` after the function name. This is the main role: generics.
`K` is a specific window event in `WindowEventMap`. And it is later used in the function signature.

First parameter is `type: K`. Well, it can be any event in `WindowEventMap`.

Second parameter is a callback function. `(this: Window, ev: WindowEventMap[K]) => any`. Now we can see `K` again in `WindowEventMap[K]`.

So what is `WindowEventMap` exactly? Press `command` and click it we'll find:

```typescript
// https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L18434
interface WindowEventMap extends GlobalEventHandlersEventMap, WindowEventHandlersEventMap {
    "abort": UIEvent;
    "afterprint": Event;
    "beforeprint": Event;
    "beforeunload": BeforeUnloadEvent;
    "blur": FocusEvent;
    "canplay": Event;
    "canplaythrough": Event;
    "change": Event;
    "click": MouseEvent;
    "compassneedscalibration": Event;
    "contextmenu": MouseEvent;
    "dblclick": MouseEvent;
    "devicelight": DeviceLightEvent;
    "devicemotion": DeviceMotionEvent;
    "deviceorientation": DeviceOrientationEvent;
    "deviceorientationabsolute": DeviceOrientationEvent;
    "drag": DragEvent;
    "dragend": DragEvent;
    "dragenter": DragEvent;
    // blabla
```

Wow, it's the map for **event type** to **event difination**. So it explains every thing.

`addEventListener` accept the first parameter event type to constrait the second parameter, a callback function.
And this is implemented by `K`, a generic type.

OK, now you may think why we need generics here. We can also use these codes to define `addEventListener`:

```typescript
declare function addEventListener(type: 'click', listener: (this: Window, ev: MouseEvent) => any, options?: boolean | AddEventListenerOptions): void;
declare function addEventListener(type: 'drag', listener: (this: Window, ev: DragEvent) => any, options?: boolean | AddEventListenerOptions): void;
declare function addEventListener(type: 'hashchange', listener: (this: Window, ev: HashChangeEvent) => any, options?: boolean | AddEventListenerOptions): void;
declare function addEventListener(type: 'focus', listener: (this: Window, ev: FocusEvent) => any, options?: boolean | AddEventListenerOptions): void;
// and we still have a lot
```
Come on! Who'll do such a stupid thing if we have **generics** now.

### Return to the docs

Now we can visit [handbook of typescript](http://www.typescriptlang.org/docs/handbook/generics.html) and find more about generics.

Here I will introduce three more useful usages.

The first one is use generics as return type of function.
```typescript
function identity<T>(arg: T): T {
    return arg;
}
```
Now we can easily understand what `T` means here. This is function return the type what it excatly accept.
 But for a beginner, it is confused why there are three `T`s.

 The second example is use generics to define array.

 ```typescript
 function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
 ```
Now we have an array of `T`s. Simple.

The third one is about how to use generic to constrain functions. In the first example, if we write `arg.length`, it will emit an error of `Error: T doesn't have .length`.

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

Now we want to constrain the function and make sure the parameter can be any type but has property `length`. To do so, we must list our requirement as a constraint on what T can be. 

```typescript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```
Here we create an interface that describes our constraint. And we use `extends` keyword to denote our constraint.

### Use generic type in my own project

The reason I explore generics is just because I have a scene in my own project. In my node service, we use `protobuf` to connect with RPC framework. There are many microservices there. When we call those RPC API, the code is like `this.requestTypeData('serviceName.APIName', queryData)`

I want to define my second parameter `queryData` according to the first parameter `serviceName.APIName`. So we need a map to find the protobuf defination of the specific API.

My colleague wrote a tool to transform all `protobuf` to `serviceName.d.ts`. Then we can just define the method `requestTypeData`.

```typescript
declare function requestTypeData<K extends keyof RPC_API_NAME>(apiName: K, queryData: RPC_API_REQ_MAP[K]): RPC_API_RES_MAP[K];
```
We use three maps here including the API's name, query map and result map.