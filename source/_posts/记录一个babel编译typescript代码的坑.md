---
title: 记录一个babel编译typescript代码的坑
date: 2021-01-14 14:38:08
description: 编译typescript有四种方式，你知道吗
tags:
    - babel
    - typescript
---

## 背景
首先这是一个团队使用的vue组件库，最近把它改造成了 typescript + class style 来写。虽然 Vue2 对于 typescript 的支持只能说是个残废，但是至少 typescript 对于加强代码的可读性和增强写组件时的反思，很有作用。

如果是把 typescript 用在 node 环境，其实不建议使用 webpack 去编译打包，建议是直接用官方的`tsc`进行构建，这样的好处是所有文件都会被原样编译出一份js代码，而不是最后被压成一个bundle，对于支持 Commonjs 模块的node环境，打包几乎没有任何意义。而且，官方的`tsc`自然是能保证支持所有的ts特性的。

但是对于组件库，用webpack打包是不可避的，所以要么使用`ts-loader`去处理ts，要么使用`babel-loader`，最新的babel已经号称支持了typescript编译，而且不会进行类型检查，经过对比，我发现babel-loader的确构建速度显著增快，那么何不使用babel-loader来同时处理js和ts文件呢？


配置参考：

使用ts-loader:
```js
{
    test: /\.(ts|tsx)?$/,
    loader: 'ts-loader',
    options: {
        transpileOnly: true, // 这样也能跳过类型检查，但是速度还是没有babel快，babel, ast yyds
        appendTsSuffixTo: [/\.vue$/], // 为script有lang='ts'标识的脚本文件添加ts后缀，否则vue文件不会进入ts-loader
    }
},
```

使用babel-loader：
```js
{
    test: /\.(ts|js)$/, // 包含处理ts和js
    loader: 'babel-loader',
    options: {
        sourceMap: true,
        presets: [
            [
                '@babel/preset-env',
                {
                    'targets': {
                        'browsers': ['last 2 versions', 'ie >= 11']
                    },
                    'useBuiltIns': 'usage',
                    'corejs': 3,
                    'modules': false
                }
            ],
            [
                '@babel/preset-typescript',   // 引用Typescript插件
                {
                    allExtensions: true,        // ?支持所有文件扩展名
                },
            ],
        ],
        plugins: [
            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
            '@babel/plugin-proposal-class-properties'
        ]
    },
    exclude: /node_modules/,
},
```

注意这里用了两个preset，包括了preset-env和preset-typescript，而后者就是用于处理typescript的。前者还会把polyfill打进去。

## 遇到的问题

### polyfill 的冗余性

现在业界的组件库，在构建上都会提供一个包含全部组件的umd bundle以及每个组件分别输出一个打包构建后的组件，这也是方便之后增量引入组件，配合`babel-import-plugin`这种东西就能让业务中使用`import { button } from YourLib`这种看起来很美好的ES6语法，实际编译出来是`import button from 'YourLib/button/index.js'`这种把戏。

但是注意这段babel配置
```js
{
    'targets': {
        'browsers': ['last 2 versions', 'ie >= 11']
    },
    'useBuiltIns': 'usage', // 使用polyfill
    'corejs': 3, // 指定polyfill的corejs版本为3
    'modules': false // 避免babel自动把模块转为es6，万一第三方输出es6就可以tree-shaking
}
```

因为使用了polyfill，这样就会导致每一份组件编译出来的代码都是带了大量polyfill，即使指定了ie >= 11也无法避免这么多polyfill的打入，不同组件包含的polyfill其实是重复的。
经过我的测试，一个简单的button组件，用babel-loader编译出来的要比ts-loader的大整整一倍。

### class 静态方法的解析

我有个tip组件会存在这样的写法：
```ts
@Component({
    name: 'Tips'
})
class Tips extends VueClass {
    // 前面省略
    tipTimer: number = 0

    
    public static show(options) {
        if (Vue.prototype.$isServer) return
        options = options || {}
        if (typeof options === 'string') {
            options = {
                msg: options
            }
        }
        const instance = new Tips({
            propsData: options
        })
        instance.$mount()
        if (options.tipBindElement) {
            options.tipBindElement.appendChild(instance.$el)
        } else {
            document.body.appendChild(instance.$el)
        }
        instance.tipTimer && clearTimeout(instance.tipTimer)
        instance.tipTimer = setTimeout(function() {
            instance.destroy()
        }, options.delay || DEFAULT_DELAY)
        return instance
    }

    public static success(msg, delay, tipBindElement) {
        Tips.show({
            msg,
            delay,
            type: 'success',
            tipBindElement
        })
    }

    public static error(msg, delay, tipBindElement) {
        Tips.show({
            msg,
            delay,
            type: 'error',
            tipBindElement
        })
    }

    public static suc = Tips.success // 这里相当于一个alias

    public static err = Tips.error
}

export default Tips
```

Tips组件存在大量的class静态方法定义，这些都是为了和之前jquery插件的api对齐，所以采用了直接new Vue实例渲染的方式，其实这也非常适合Tips这种命令式调用，很多组件库也是为这种组件提供类似的命令式API。

在babel-loader中编译出来的文件却出了问题：
```js
var Tips = (_dec = Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_12__["Component"])({
  name: 'Tips'
}), _dec2 = Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_12__["Prop"])({
  type: String,
  default: _constant__WEBPACK_IMPORTED_MODULE_13__["NOTICE_TYPE"].ERROR,
  validator: function validator(value) {
    var isValid = false;

    for (var i in _constant__WEBPACK_IMPORTED_MODULE_13__["NOTICE_TYPE"]) {
      if (_constant__WEBPACK_IMPORTED_MODULE_13__["NOTICE_TYPE"][i] === value) {
        isValid = true;
      }
    }

    return isValid;
  }
}), _dec3 = Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_12__["Prop"])({
  type: String,
  default: '系统错误'
}), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_VueClass) {
  Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__["default"])(Tips, _VueClass);

  var _super = Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_7__["default"])(Tips);

  function Tips() {
    var _this;

    Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, Tips);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this), "tipTimer", 0);

    Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this), "type", _descriptor, Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this));

    Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this), "msg", _descriptor2, Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this));

    return _this;
  }

  Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(Tips, [{
    key: "mounted",
    // hooks
    value: function mounted() {
      /* eslint-disable */
      console.info('this', this.msg, this.type);
      /* eslint-enable */
    } // methods

  }, {
    key: "destroy",
    value: function destroy() {
      this.$destroy();

      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  }, {
    key: "classType",
    // computed
    get: function get() {
      return classTypeMap[this.type];
    }
  }], [{
    key: "install",
    value: function install(Vue) {
      Vue.component(Tips.name, Tips);
    }
  }, {
    key: "show",
    value: function show(options) {
      if (vue__WEBPACK_IMPORTED_MODULE_11__["default"].prototype.$isServer) return;
      options = options || {};

      if (typeof options === 'string') {
        options = {
          msg: options
        };
      }

      var instance = new Tips({
        propsData: options
      });
      instance.$mount();

      if (options.tipBindElement) {
        options.tipBindElement.appendChild(instance.$el);
      } else {
        document.body.appendChild(instance.$el);
      }

      instance.tipTimer && clearTimeout(instance.tipTimer);
      instance.tipTimer = setTimeout(function () {
        instance.destroy();
      }, options.delay || DEFAULT_DELAY);
      return instance;
    }
  }, {
    key: "success",
    value: function success(msg, delay, tipBindElement) {
      Tips.show({
        msg: msg,
        delay: delay,
        type: 'success',
        tipBindElement: tipBindElement
      });
    }
  }, {
    key: "error",
    value: function error(msg, delay, tipBindElement) {
      Tips.show({
        msg: msg,
        delay: delay,
        type: 'error',
        tipBindElement: tipBindElement
      });
    }
  }]);

  return Tips;
}(vue_property_decorator__WEBPACK_IMPORTED_MODULE_12__["Vue"]), 
Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_class3, "suc", Tips.success), 
Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_class3, "err", Tips.error), 
_temp), 
(_descriptor = Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_9__["default"])(_class2.prototype, "type", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = Object(_Users_eatleleo_git_wework_wwvue_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_9__["default"])(_class2.prototype, "msg", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class);
```

babel-loader由于在Tips定义出来之前就去访问`Tips.success`，导致js直接报错Tips没有定义
也就是说，对于babel-loader，我们不能在class里面去引用class自身

更奇怪的是，即使我去掉这个alias定义，最后在new Vue实例的时候，它的class定义也并没有完整，缺少了template定义（可能是没有成功继承vue组件）

以下是ts-loader编译出来的：
```js
var Tips = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Tips, _super);
    function Tips() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tipTimer = 0;
        return _this;
    }
    Tips_1 = Tips;
    Object.defineProperty(Tips.prototype, "classType", {
        // computed
        get: function () {
            return classTypeMap[this.type];
        },
        enumerable: false,
        configurable: true
    });
    // hooks
    Tips.prototype.mounted = function () {
        /* eslint-disable */
        console.info('this', this.msg, this.type);
        /* eslint-enable */
    };
    // methods
    Tips.prototype.destroy = function () {
        this.$destroy();
        if (this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
    };
    Tips.install = function (Vue) {
        Vue.component(Tips_1.name, Tips_1);
    };
    Tips.show = function (options) {
        if (vue__WEBPACK_IMPORTED_MODULE_1__["default"].prototype.$isServer)
            return;
        options = options || {};
        if (typeof options === 'string') {
            options = {
                msg: options
            };
        }
        var instance = new Tips_1({
            propsData: options
        });
        instance.$mount();
        if (options.tipBindElement) {
            options.tipBindElement.appendChild(instance.$el);
        }
        else {
            document.body.appendChild(instance.$el);
        }
        instance.tipTimer && clearTimeout(instance.tipTimer);
        instance.tipTimer = setTimeout(function () {
            instance.destroy();
        }, options.delay || DEFAULT_DELAY);
        return instance;
    };
    Tips.success = function (msg, delay, tipBindElement) {
        Tips_1.show({
            msg: msg,
            delay: delay,
            type: 'success',
            tipBindElement: tipBindElement
        });
    };
    Tips.error = function (msg, delay, tipBindElement) {
        Tips_1.show({
            msg: msg,
            delay: delay,
            type: 'error',
            tipBindElement: tipBindElement
        });
    };
    var Tips_1;
    Tips.suc = Tips_1.success;
    Tips.err = Tips_1.error;
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_2__["Prop"])({
            type: String,
            default: _constant__WEBPACK_IMPORTED_MODULE_3__["NOTICE_TYPE"].ERROR,
            validator: function (value) {
                var isValid = false;
                for (var i in _constant__WEBPACK_IMPORTED_MODULE_3__["NOTICE_TYPE"]) {
                    if (_constant__WEBPACK_IMPORTED_MODULE_3__["NOTICE_TYPE"][i] === value) {
                        isValid = true;
                    }
                }
                return isValid;
            }
        })
    ], Tips.prototype, "type", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_2__["Prop"])({
            type: String,
            default: '系统错误'
        })
    ], Tips.prototype, "msg", void 0);
    Tips = Tips_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            name: 'Tips'
        })
    ], Tips);
    return Tips;
}(vue_property_decorator__WEBPACK_IMPORTED_MODULE_2__["Vue"]));
```

ts-loader 保留了class，所以必然是没有问题的

## 为何不用tsx
其实说白了，这都是因为vue组件需要特殊的loader导致了处理不一致，我相信普通的ts文件，用babel编译不会有问题的

所以为什么不用tsx呢？因为组件库迁移到tsx，又是一堆成本...

## 解决方案？
目前用了个很无语的方案。。。就是用ts-loader和babel-loader串联起来，先走ts-loader处理ts语法，再走babel-loader处理es5兼容性。
其实我看很多组件库也是这么做的。