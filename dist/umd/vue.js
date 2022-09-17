(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      // 不可枚举
      configurable: false,
      // 不可配置
      value: value
    });
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  function upper(all, letter) {
    return letter.toUpperCase();
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']; // 策略

  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    // 根据key 执行 自定义函数
    strats[hook] = mergeHook;
  }); // 组件策略 

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal); // res.__proto__ = parentVal;

    if (childVal) {
      for (var key in childVal) {
        // 让组件 先找自己的局部组件,找不到根据原型链 网上找
        res[key] = childVal[key];
      }
    }

    return res;
  } // 所以全局组件 可以在任何地方用


  strats.components = mergeAssets;

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        // 新的有,老的没有 生命周期 返回 数组格式
        return [childVal];
      }
    } else {
      // 没有子级 直接返回
      return parentVal;
    }
  }
  /**
   * @description: 合并对象 或其他类型
   * @param {*} parent 
   * @param {*} child 
   */


  function mergeOptions(parent, child) {
    var options = {}; // 父是对象

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 如果已经合并过了,就不需要再合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略 但有些属性 需要特殊的合并 生命周期的合并


    function mergeField(key) {
      // 如果你有 这个策略, 执行策略方法, 主要是用来处理生命周期; 因为其需要是一个数组 可一次执行
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) == 'object' && _typeof(child[key]) == 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        // 父为null 子为obj
        options[key] = child[key];
      }
    }

    return options;
  } // 如果是原生标签 返回true

  var isReservedTag = function isReservedTag(tagName) {
    var str = 'p,div,span,input,button';
    var obj = {};
    str.split(",").forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  };

  /**
   * @Object.create 用来进行基于原型链的继承
   * 用户操作 vm._data.arr.push 就会在 重写的 arrayMethods 中找方法
   * value.__proto__ = arrayMethods 
   * 如果 arrayMethods 找不到任何方法就会基于原型链向上找
   * arrayMethods.__proto__ = oldArrayMethods
   */
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods); // 都会改变 原数组 , slice 不会

  var methods = ["push", "shift", "unshift", "pop", "sort", "splice", "reverse"];
  methods.forEach(function (method) {
    // 先调用 重写的arr 方法 AOP 切片
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 再里面调用 原生的数组方法
      var result = oldArrayMethods[method].apply(this, args);
      var insert; // 当前用户插入的元素

      var ob = this.__ob__;

      switch (method) {
        case "push":
        case "unshit":
          insert = args; // 类数组 es6 ...args 参数

          break;

        case "splice":
          insert = args.slice(2);
      } // 当新添对象的话 继续 观察 


      if (insert) {
        ob.observerArray(insert);
      } //  如果用户调用了 数组方法 就会通知当前的dep 去更新


      ob.dep.notify();
      return result;
    };
  });
  /**
   * @总结:
   * @Object.create 原型链继承
   * @AOP 切片编程方法
   */

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    } // 把 watcher 添加到 dep中


    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target);
        // 这里的 Dep.target 就是 watcher, 方法意思是把 Dep 添加到watcher里
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        // console.log("watcher this.subs--", this.subs)
        this.subs.forEach(function (watcher) {
          return watcher.update();
        }); // wathcer 更新完就被移除了
        // console.log("Dep.target-- notify after", Dep.target)
      }
    }]);

    return Dep;
  }();

  Dep.target; // 栈

  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      /** 给数组用的 */
      this.dep = new Dep(); // value.__proto__.ob = this; // 给每一个监控过得对象依次增加set get 方法
      // 这里用数据存储器的方式 不让 该属性能枚举, 不然会死循环,因为存值是this,
      // 被枚举时候 会访问到this  会不断调用walk=>observerArray 等

      def(value, "__ob__", this);

      if (Array.isArray(value)) {
        // 如果是数组的话 并不会对索引进行观察,会导致性能问题,(数组里100个item 就要观察100次)
        // 而且用户很可能操作 索引, (最少别操作索引)
        // console.log("is Array")
        // 函数的劫持(代理),通过更改原型链上的 方法, arrayMethods内部再调用原生的方法 (push shift, unshift)
        value.__proto__ = arrayMethods; // 数组里放的对象 再监控

        this.observerArray(value);
      } else {
        // console.log("is object")
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 拿到所有的对象 key 进行深度遍历 设置 get set
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      } // 观察数组

    }, {
      key: "observerArray",
      value: function observerArray(value) {
        // 遍历数组每一项值, 非引用类型除外, 观察的是 每一个对象
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 数组中每一个都取出 收集依赖

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        // 递归数组中的数组 依赖收集
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    // 这个dep 是给对象使用的
    var dep = new Dep();
    /**
     * @observe :  对data里对象进行递归深度遍历观察; 其返回值是ovserver实例
     * @value: value可能是数组也可能是对象
     */

    var childOb = observe(value);
    /**
     * @数据描述器 
     * Object.defineProperty(obj,"newKey",{
     * get:function (){} | undefined,
     * set:function (value){} | undefined
     * configurable: true | false
     * enumerable: true | false
    });
     * @注意 当使用了getter或setter方法，不允许使用writable和value这两个属性
     * 
     */

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      // 这里要设置为true 不然 vm里data里的对象展示不出来
      get: function get() {
        if (Dep.target) {
          // 如果当前有watcher
          dep.depend(); // 表示要将watcher存起来
          // 收集数组的相关依赖

          if (childOb) {
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      // 操作 去设置值 
      set: function set(newValue) {
        // 监听变化
        console.log("监听变化"); // 浅比较 相等 就不继续执行

        if (newValue == value) return; // @注意!!! 如果用户直接修改 data 上的对象为一个新的对象,需要继续 observe

        observe(newValue); // 这里的 value 是闭包引用,直接修改即可

        value = newValue;
        dep.notify(); // 通知依赖的watcher 来更新
      }
    });
  }

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    waiting = false;
    var copies = callbacks.slice(0); // 置空

    callbacks.length = 0;

    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  var timerFunc;

  if (typeof Promise !== 'undefined') {
    var p = Promise.resolve();

    timerFunc = function timerFunc() {
      p.then(flushCallback);
    };
  } else if (typeof setImmediate !== 'undefined') {
    timerFunc = function timerFunc() {
      setImmediate(flushCallback);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallback, 0);
    };
  } // 项目初始化的时候 ,代码里写的 set属性, 或者用户自己执行$nextTick 都会往队列里塞cb;  这里需要拦截,因为代码里面会循环调用 队列里的 callback;不然会多次调用


  function nextTick(cb, ctx) {


    function fun() {
      if (cb) {
        cb.call(ctx);
      }
    }

    callbacks.push(fun); // 这里为了避免 异步函数 还没 被调用完 一种节流机制

    if (waiting === false) {
      waiting = true; // 执行并清空

      timerFunc();
    } // 当没有cb 可以提供Promise形式

    /**
     * vm.$nextTick().then(() => { })
     */


    if (!cb && typeof Promise !== 'undefined') {
      console.log("参数---", Array.prototype.slice.apply(arguments));
      return new Promise(function (resolve) {
        resolve();
      });
    }
  }

  var quene = []; //队列存放watcher

  var has = {};

  function flushSchedularQueue() {
    console.log("flushSchedularQueue--");
    quene.forEach(function (watcher) {
      return watcher.run();
    }); // 清空 队列 和 挂载对象

    quene = [];
    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id; // 同一个watcher 需要过滤;

    if (!has[id]) {
      quene.push(watcher);
      has[id] = true; // 单线程 等同步执行完以后 callback, 在下一个事件队列 执行;

      nextTick(flushSchedularQueue, watcher);
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.vm = vm;
      this.callback = callback; // 默认情况下 只有 渲染 watcher options 为true

      this.options = options; // 用来标记 计算属性的

      this.lazy = options.lazy; // 用于计算属性 缓存的

      this.dirty = this.lazy; // 所以 user 在渲染watcher下 为 undefined 这里要区分 渲染watcher 和 用户user

      this.user = options.user;

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        //  可能是字符串 watcher: {'obj.name.name'}
        // 将getter方法 封装成 取vm实例下的取值函数
        this.getter = function () {
          var patch = exprOrFn.split(".");
          var val = vm; // 循环取值 xxx.xx.x 

          for (var i = 0; i < patch.length; i++) {
            val = val[patch[i]];
          }

          return val;
        };
      } // dep 相关


      this.depsId = new Set(); // 唯一性 去重

      this.deps = []; // watcher 需要存的 上一次的值; 调用get方法会渲染watcher; 计算属性不调用

      console.log("this.lazy--", this.lazy);
      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id; // 解决watcher 重复存放的问题,就是解决 重复渲染问题

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep); // 调用 dep 方法;把watcher 存到dep里 (避免重复存放)

          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        // 依赖收集; watcher 和 user watcher 都会从这里收集依赖
        pushTarget(this); // 把watcher 存起来

        var val = this.getter.call(this.vm); // 渲染watcher的执行 || 用户写的watcher执行 || 计算属性函数执行

        popTarget(); // 移除watcher

        return val;
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get(); // 取完值 赋值false 就会拿缓存值

        this.dirty = false;
      } // 有可能会被 多次调用 update 所以要过滤

    }, {
      key: "update",
      value: function update() {
        // 同步watcher 取消 queue 直接执行; 改变几次 调用几次;
        if (this.sync) {
          this.run();
        } else if (this.lazy) {
          // 表示的是计算属性 依赖的值 改变了 
          this.dirty = true;
        } else {
          // 等待着
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value; // 第一次渲染的值

        var newValue = this.get(); // 更新value

        this.value = newValue; // 表示当前是user写的 watcher

        if (this.user) {
          this.callback.call(this.vm, newValue, oldValue);
        } else {
          // 内部渲染watcher
          this.get();
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        // 如果还有deps 依赖的属性,循环他们
        var index = this.deps.length;

        while (index--) {
          // 调用把每一个dep属性  都去存放当前 watcher
          this.deps[index].depend();
        }
      }
    }]);

    return Watcher;
  }();

  /**
   * 
   * @param {*} vm 传入实例
   * 初始化状态: 包含 props data computed watch (传入 Vue 里的 options 含有的都需要初始化)
   */

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.methods) ;

    if (opts.computed) {
      initComputed(vm, opts.computed);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }


  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data == 'function' ? data() : data; // 对象劫持, 用户改变了数据,希望可以监听到,得到通知 ==> 去更新视图View

    console.log("data--", data); //为零让用户更好的使用, 希望直接 vm.xx;  走代理模式

    for (var key in data) {
      // 代理 _data 转移取值
      proxy(vm, '_data', key);
    } // MVVM模式 数据变化 驱动视图变化
    // 用 Object.defineProperty 给给对象的属性增加get 和set方法


    observe(data);
  }


  function initComputed(vm, computed) {
    // _computedWatchers 存放着所有的计算属性对应的watcher
    var watchers = vm._computedWatcher = {};

    for (var key in computed) {
      var userDef = computed[key]; // 获取用户定义的函数 || 对象

      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      }); // 计算数学可以直接通过vm来进行取值,所以将属性定义到实例上

      defineComputed(vm, key, userDef);
    }
  } // 全局对象 描述器


  var sharedPropwetyDefinition = {
    enumerable: true,
    configurable: true,
    get: function get() {}
  };

  function defineComputed(target, key, userDef) {
    // 需要添加缓存效果 不可以直接获取
    if (typeof userDef === 'function') {
      // sharedPropwetyDefinition.get = userDef;
      sharedPropwetyDefinition.get = createComputedGetter(key);
    } else {
      sharedPropwetyDefinition.get = createComputedGetter(key);
      sharedPropwetyDefinition.set = userDef.set || {};
    }

    Object.defineProperty(target, key, sharedPropwetyDefinition);
  }

  function createComputedGetter(key) {
    // 添加了缓存机制
    return function () {
      // 拿到了刚才的watcher
      var watcher = this._computedWatcher[key];

      if (watcher.dirty) {
        // 默认第一次取值, 为true
        watcher.evaluate();
      } // 如果还存在渲染watcher 调用depend


      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  } // watch 原理是通过Watcher 实现


  function initWatch(vm, watch) {
    for (var key in watch) {
      var handler = watch[key];

      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          // 用户传递的是数组 循环 依次创建
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
  /** watch 几种方式
   watch: {
              name: [{
                  handler: 'handler',
                  sync: true
              }],
              name2(newVal,oldVal) {

              },
              name: {
                  handler(newVal,oldVal){

                  },
                  sync: true // 每次改变都会触发
              }
          },

   */


  function createWatcher(vm, key, handler, options) {
    // 参数的格式化操作
    if (isObject(handler)) {
      // options 默认是{} 放到 ioptions
      options = handler; // 对象取 handler

      handler = handler.handler;
    }

    if (typeof handler === 'string') {
      // 从methods 上找 方法
      handler = vm.$options.methods[handler];
    } //
    // watch原理 是基于$watch的


    return vm.$watch(key, handler, options);
  }

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      var vm = this; // 表示当前是用户自己写的 watcher; watcher是分 渲染watcher 和 用户自写的watcher的

      options.user = true;
      new Watcher(vm, exprOrFn, cb, options);
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var gnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <awdawd:awfwdw>

  var startTagopen = new RegExp("^<".concat(gnameCapture)); // 标签开头的正则 捕获的内容是标签名 

  var endTag = new RegExp("^<\\/".concat(gnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // 匹配属性  id = "app"  id = 'app'  id = app 三种可能
  //                 空格 + 非"'<>=       不捕获 空格 =

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)’+|([^\s"'=<>`]+)))?/;
  var startTagclose = /^\s*(\/?)>/; // 匹配标签结束 空格 + /> 

  function parseHTML(html) {
    var root = null; // ast语法树

    var currentParent; // 标识当前父亲是谁

    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = []; // 主要用于看是否为正常的 关闭的标签; 栈结构 先进后出
    // ast html节点

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      // 遇到开始标签,就创建一个ast元素
      var element = createASTElement(tagName, attrs); // 如果一上来没有root

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    } // <div><p></p></div>  [div]


    function end(tagName) {
      //  栈结构 当遇到结尾的标签 就弹出
      var element = stack.pop();
      currentParent = stack[stack.length - 1]; // 如果父节点存在,即可标明父子关系

      if (currentParent) {
        // 实现一个树的父子 关系
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    } // 不停解析html字符串


    while (html) {
      var textEnd = html.indexOf("<"); // 解析开始标签 + 属性
      // 默认开头的标签 <

      if (textEnd == 0) {
        // 如果索引为0,肯定是一个标签, 开始标签 || 结束标签
        var startTagMatch = parseStartTag(); // 获取到匹配的标签名, tagName 属性attr

        if (startTagMatch) {
          // console.log("startTagMatch---", startTagMatch)
          start(startTagMatch.tagName, startTagMatch.attrs); // 匹配到开头标签, continue 跳过循环 继续下一个循环

          continue;
        }

        var endTagMatch = html.match(endTag); // 匹配到 </ 结束标签

        if (endTagMatch) {
          // 删除结束标签, 比如 删除 <div> </div> 
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 2 解析结束标签

          continue;
        }
      } // 文本


      var text = void 0; // 匹配到 <p 之前的文本

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); // 3 解析文本
      }
    } // 截掉n之前的字符串


    function advance(n) {
      html = html.substring(n);
    } // 遍历 html 字符串 生成 节点+属性


    function parseStartTag() {
      /**
       * 1.匹配 tagName
       */
      // 匹配出来 是一个 数组  ['<div','div', index:0, input: "<div id ="app"",xxxx]
      var start = html.match(startTagopen);

      if (start) {
        // 设置一个对象来接受
        var match = {
          tagName: start[1],
          attrs: []
        }; // eg: <div . length, 为了把html 字符串 前面匹配过的 截掉

        advance(start[0].length);
        /**
         * 2.匹配 属性
        */

        var _end, attr; // 没有匹配到结束标签 且有 属性 attr


        while (!(_end = html.match(startTagclose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // 属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // console.log("end---", end)
          advance(_end[0].length);
          return match;
        }
      }
    } // 返回根节点


    return root;
  }
  /**
   * 匹配规则 html 为 语法树结构:
   * <div id="app">
       <p>hello</p>
     </div>
   *
   * 
  let root = {
      tag: 'div',
      attrs: [{ name: 'id', value: 'app' }],
      parent: null,
      type: 1, // nodeType 节点为1  属性为2 文本为3
      children: [{
          tag: 'p',
          attrs: [],
          parent: root,
          children: [
              {
                  text: 'hello',
                  type: 3
              }
          ]
      }]
  }
   * 
   *   
   */

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}}

  function genProps(attrs) {
    var str = ''; // attrs 是数组 格式 eg: [{name:id,value: 'app'},{name:style,value: " color:red;fontSize:14; "}] 

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // style="color:red;font-size:14;" ===>  {style:{color: 'red'}}
      // style 特殊处理

      if (attr.name === 'style') {
        (function () {
          var obj = {}; // attr.value =  color:red;font-size:14; ==> 转成 obj

          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1]; // 处理特殊key名,eg: font-size ==> fontSize


            if (key.indexOf("-") > -1) {
              // replace 第二参数 可以穿函数, 函数参数:(匹配到的值,第二个是捕获到的)
              key = key.replace(/-(\w)/g, upper);
            }

            obj[key] = value;
          }); // 改写 attr的 value

          attr.value = obj;
        })();
      } // 任何属性 key:value 形式 拼接; 每一个都接逗号


      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}"); // 最后一项 逗号不要
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    // 递归匹配
    if (node.type == 1) {
      return generate(node);
    } else {
      // exec 正则循环匹配 会有问题 ,lastIndex问题
      // _v("a"+_s(name)+"b"+_s(age)+"c")
      var text = node.text; // eg: a {{name}} b {{age}} c

      var tokens = []; // 是用来存 每一个 text 比如 a, {{name}} 等

      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex 每次调到0
      // 匹配不到 就为 null 结束循环

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          // 截取字符串
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")")); // 重新设置偏移量 = 匹配到的起始index + 匹配到的长度

        lastIndex = index + match[0].length;
      } // 如果没有匹配到最后, 直接把后面的全部push 到tokens里


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      console.log("tokens----", tokens); // 最后 全部 用 + 号 连起来

      return "_v(".concat(tokens.join("+"), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",\n    ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', "\n    ").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function compileToFunction(template) {
    console.log("compile", template); // 1.把html字符串 转为 ast语法树 

    var root = parseHTML(template); // console.log('root---', root)
    // 2.把 ast语法树 生成最终的 render函数 就是字符串拼接(模版引擎)
    // <div id="app"><p>hello {{name}}</p> hello </div>
    // 将ast树,再次转化为 js语法 ,核心思路就是将模版转化为 下面字符串:
    // _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))

    var code = generate(root); // console.log("code--", code)
    // 所有 模版引擎实现: 都需要 new Function + with
    // render 函数 返回的就是 虚拟dom  且 _c, _s _v 创建的都是一个个虚拟dom

    var renderFn = new Function("with(this){ return ".concat(code, "}"));
    return renderFn;
  }

  // 渲染成真实dom
  function patch(oldVnode, vnode) {
    // debugger
    if (!oldVnode) {
      // 这个是组件的挂载 又叫 空挂载  empty mount (likely as component) 
      console.log("组件vnode---", vnode);
      return createElm(vnode);
    } else {
      // 因为虚拟节点是 没有 nodeType的
      var isRealElement = oldVnode.nodeType; // 真实dom

      if (isRealElement) {
        var oldElm = oldVnode; // app

        var parentElm = oldElm.parentNode; // body

        var el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling); // 紧跟app 组件之后,插入el

        parentElm.removeChild(oldElm); // 删除老的 app
        // 需要将渲染好的dom 返回

        return el;
      } else {
        // 如果标签不一样 直接把自身替换掉,为新虚拟节点真实的dom
        if (oldVnode.tag !== vnode.tag) {
          // createElm(vnode) 生成最新的dom 去替换老的 el
          oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        } // debugger
        // 如果没有标签, 只是文本, 内容不一致的话


        if (!oldVnode.tag) {
          // debugger
          if (oldVnode.text !== vnode.text) {
            // 这句不写 不修改...
            oldVnode.el.nodeValue = vnode.text;
            oldVnode.el.texContent = vnode.text;
          }
        } // 标签一致 且不是文本; 修改属性
        // 让旧dom节点 赋值给 新的虚拟节点 el (复用)


        var _el = vnode.el = oldVnode.el; // 更新属性


        updateProperties(vnode, oldVnode.data); // 比对子节点

        var oldChildren = oldVnode.children || [];
        var newChildren = vnode.children || []; // 新老都有儿子, 需要比对里面儿子

        if (oldChildren.length > 0 && newChildren.length > 0) {
          updateChildren(_el, oldChildren, newChildren);
        } else if (newChildren.length > 0) {
          // 新的有孩子,老的没孩子 直接将孩子虚拟节点转化为真实节点 插入即可;
          for (var i = 0; i < newChildren.length; i++) {
            var child = newChildren[i]; // createElm 虚拟节点

            _el.appendChild(createElm(child));
          }
        } else if (oldChildren.length > 0) {
          // 老的有孩子, 新的没有孩子; 直接置空
          _el.innerHTML = '';
        }
      }
    }

    return vnode.el;
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function makeIndexByKey(children) {
    var map = {};
    children.forEach(function (item, index) {
      if (item.key) {
        map[item.key] = index; //根据key创建映射表
      }
    });
    return map;
  } // 比对新老子节点 vue 采用双指针方式


  function updateChildren(parent, oldChildren, newChildren) {
    // 第一个指针指向oldVnode 开头
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex]; // 第二个指针指向 newVnode 开头

    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex]; // 暴力比对 用的 把老的vnode 做成以key为键的对象

    var map = makeIndexByKey(oldChildren); // 在比对过程中 新老虚拟几点 有一方循环完毕 就结束

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      //在老指针移动过程中 可能会遇到 我们设置的undefined的情况 就跳过
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        // 反向操作
        oldEndVnode = oldChildren[--oldEndIndex];
      } // 优化向后插入的情况
      else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果是同一节点 就需要比对这个元素的属性; 递归深度比较
        patch(oldStartVnode, newStartVnode); // 循环完 下一次 跟进

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex]; // 优化向前插入的情况
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } // 头移尾 A移动到了最后

      /**
       * A B C D
       * B C D A
       */
      else if (isSameVnode(oldStartVnode, newEndVnode)) {
        patch(oldStartVnode, newEndVnode); // 把A元素 移动到 旧vnode最后一个元素下一个的 前面;

        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 移动完 结束本次循环

        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex]; // 尾移头
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode); // 把旧vnode 最后一个 移动到 最前面

        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 暴力比对
        // 现根据老节点key,做一个映射表,拿新的虚拟节点去映射表查找,如果可以查到,则进行移动(移到头指针前面位置)如果找不到就在头指针插入新元素)
        // 拿到移动到索引
        var moveIndex = map[newStartVnode.key];

        if (!moveIndex) {
          // 在旧vnode里没有 就再前插入
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          // 需要复用
          // 这种情况是 头,尾节点都不一样 乱序情况下,在映射表中查找到了,则直接将元素移走
          var moveVnode = oldChildren[moveIndex]; // 所以要拿到这个需要移动的dom
          // 为了避免循环塌陷,还要移动完以后, 设置为空

          oldChildren[moveIndex] = undefined;
          parent.insertBefore(moveVnode.el, oldStartVnode.el); // 放在头指针前面
          // 标签一致 还要比较子元素

          patch(moveVnode, newStartVnode);
        } // 最后 移动指针 准备下次循环


        newStartVnode = newChildren[++newStartIndex];
      }
    } // 新vnode 数量 大于 旧vnode


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // 正常情况下 向后找元素 到最后一位 为null 如果向前插入;  newChildren[newEndIndex + 1] 为首元素, 取其eldom元素
        var insertNode = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;

        if (insertNode == null) {
          // 将新增元素 直接进行插入
          // parent.appendChild(createElm(newChildren[i]));
          parent.insertBefore(createElm(newChildren[i]));
        } else {
          // 向前插入元素, 从尾巴开始比对 向左移动 

          /**
           *     A B C D
           *  
           *   E A B C D     
           */
          console.log("parent--", newChildren[newEndIndex + 1]);
          parent.insertBefore(createElm(newChildren[i]), insertNode);
        }
      }
    } // 如果当前老的开始 和老的结束中间 还有节点;  删除这些节点


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child !== undefined) {
          console.log("child.el------", child.el);
          parent.removeChild(child.el);
        }
      }
    }
  }

  function createComponent$1(vnode) {
    // 创建组件的实例
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      // 执行 组件内部自定义 声明周期
      i(vnode);
    }

    if (vnode.componentInstance) {
      return true;
    }
  } // 根据虚拟节点 创建 真实的 dom节点
  // 递归创建


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text;

    if (typeof tag == 'string') {
      // 实例化组件
      if (createComponent$1(vnode)) {
        return vnode.componentInstance.$el;
      } // 创建标签


      vnode.el = document.createElement(tag); // 把属性 也展示到 dom页面效果上

      updateProperties(vnode); // 递归子节点

      children.forEach(function (child) {
        // 把子节点 一个个 塞到 父节点里;递归 调用
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 虚拟dom 映射真实dom 方便后续更新操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 更新属性

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 如果在dom上 老的属性有,新的属性没有,在真实dom上将这个属性 直接删除掉

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {}; // 特殊处理 style的

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    } // 处理普通属性


    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    } // 循环添加样式 到dom el 上


    for (var _key2 in newProps) {
      if (_key2 == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute("".concat(_key2), newProps[_key2]);
      }
    }
  }
  /**
   * 注意:
   * 1.nextSibling 属性可返回某个元素之后紧跟的节点（处于同一树层级中）
   *
   *2 .Node.insertBefore(a,b) 在参考节点(b)之前插入一个拥有指定父节点的子节 a
   */

  function mountComponent(vm, el) {
    vm.$options;
    vm.$el = el; // 真实的dom 元素

    callHook(vm, 'beforeMount'); // Watcher 就是用来渲染的页面的
    // vm._render 通过解析render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom
    // 渲染页面

    var updateComponent = function updateComponent() {
      // 无论渲染还是更新都会执行
      // 1.返回虚拟dom: vm._render()
      // 2. 把虚拟dom 生成真实的dom, 只有第一次 转成ast 后面都是对比
      vm._update(vm._render());
    }; // 如何渲染? 通过 渲染watcher 每个组件都有一个watcher;
    //  默认渲染Watcher 不需要回掉函数, 而实例 vm.$watch(()=>{})有


    new Watcher(vm, updateComponent, function () {}, true); // true 表示这是一个渲染wather

    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode; // 保存上一次虚拟节点为了实现对比
      // 挂载在实例上 , 每new 一个实例, vm都会一直存在

      vm._vnode = vnode; // 真实渲染内容
      // 第一次渲染

      if (!prevVnode) {
        // 通过虚拟节点 渲染真实的dom, 去替换 真实的el
        vm.$el = patch(vm.$el, vnode);
      } else {
        // 拿到保存的上一次 真实内容 去对比
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // 发布 收集到的 生命周期函数

    if (handlers) {
      // 找到对应的钩子 执行
      for (var i = 0; i < handlers.length; i++) {
        // 传递this 指向问题 
        handlers[i].call(vm);
      }
    }
  }

  function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
      //  数据的劫持
      var vm = this; // Vue.options
      // vm.$options = options;

      /**
       * this.$options 指代的是用户传递的属性
       * 将用户传递的 和全局的Options 合并
       * 因为 init 可能会被子组件继承 或者子组件初始化调用, 所以用 vm.constructor.options, 
       * 当被 子类继承了以后 ,constructor 指向的就是子类了
       */

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm); // 分割代码的写法

      callHook(vm, 'created'); // 如果用户传入el 需要渲染templete

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options; // 取dom

      el = document.querySelector(el);
      /**
       * options 模版字段 优先级:
       * render 优先级最高 
       * template
       * el
       * 如果没有 options.render字段
       */

      if (!options.render) {
        var template = options.template; // 取出模版

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template); // 将template 转化为 render方法 vue1.0 是字符串正则  vue2.0 是虚拟dom

        console.log("render------", render);
        options.render = render;
      } // options.render()
      // 渲染当前的组件,挂载这个组件


      mountComponent(vm, el);
    }; // 用户调用的 nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // ast -> render -> 调用
    var key = data.key;

    if (key) {
      delete data.key;
    } // 原生标签的时候


    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      // 从vm 实例上 找到组件的定义 
      // console.log("vm.$options.components--", vm.$options.components, tag)
      var Ctor = vm.$options.components[tag];
      console.log("组件----Ctor", Ctor);
      return createComponent(vm, tag, data, key, children, Ctor);
    }
  }

  function createComponent(vm, tag, data, key, children, Ctor) {
    // 如果传的是对象 需要 通过 extend 变成构造函数, 继承父组件方法和属性等
    if (isObject(Ctor)) {
      // 构建了当前组件这个类
      Ctor = vm.$options._base.extend(Ctor);
    } // 组件内部的生命周期


    data.hook = {
      init: function init(vnode) {
        // 当前组件的实例, 虚拟节点上 componentInstance 表示的就是vue实例
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        }); // 组件的挂载 

        child.$mount();
      }
    };
    var componentObj = {
      Ctor: Ctor,
      // 组件的构造函数 方便子组件调用其他方法
      children: children // 子组件children 是插槽

    }; // 组件内部会自动调用 extend; 创建虚拟节点; 组件是没有孩子children的 只有插槽

    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, componentObj);
  }

  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  /**
   * @description 描述的是真实的dom结构 对象
   * @param {*} tag div 标签
   * @param {*} data 属性
   * @param {*} key  diff key
   * @param {*} children  子节点
   * @param {*} text  文本
   * @componentOptions 组件的options 
   * @return 专门产生虚拟节点
   * 
   */

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }
  /**
   * @description 流程:
   *  将template转化成ast语法树-> 生成render方法(字符串拼接)-> 生成虚拟dom->真实的dom
   *  重新生成虚拟dom -> 更新dom
   * 
   */

  function renderMixin(Vue) {
    // this 从实例上取值, 因为上面的 _c,_v,_s 都是vm实例上的方法
    // _c 创建元素虚拟节点
    // _v 创建文本虚拟节点
    // _s  JSON.stringify
    // 所有实例都会 共用 原型上的方法
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function (vnode) {
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm); // 去实例上 取值
    };
  }

  function initMixin(Vue) {
    // 生命周期的合并策略!!!
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  } // Vue.mixin({
  //     a: 1,
  //     beforeCreate(a) {
  //     }
  // })
  // Vue.mixin({
  //     b: 2,
  //     beforeCreate(b) {
  //     }
  // })

  var ASSETS_TYPE = ['component', 'directive', 'filter'];

  function initAssetRegister(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type == 'component') {
          // 注册全局组件
          // 使用 extend 方法 将对象变为构造函数
          // 子组件可能也有Vue Component.component方法; 所以统一用父类调用
          // 不可以❌  definition = this.extend(definition)
          // this.options._base 永远指向的都是父类
          definition = this.options._base.extend(definition);
        } // Vue is this; 给Vue 挂上options


        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    // 为什么要有子类和父类 new Vue (Vue构造函数)
    // 创造子类 继承与父类 扩展的时候都扩展到自己的属性上
    var cid = 0;

    Vue.extend = function (extendOptions) {
      console.log('extendOptions--', extendOptions);

      var Sub = function Vuecomponent(options) {
        // 这里this 指向子组件; 子组件初始化, 但是子类 没有_init方法,所以需要继承
        this._init(options);
      };

      Sub.cid = cid++; // Object.create 实现继承;但有缺陷;会改变其构造函数

      Sub.prototype = Object.create(this.prototype); // 把 default prototype 唯一属性 constructor 指向 其本身;

      Sub.prototype.constructor = Sub; // 当前的options 与传递的options 合并 

      console.log("this.options----", this.options);
      Sub.options = mergeOptions(this.options, extendOptions); // 子类继承父类;
      // 还可以拓展 mixin use ???
      // if(Sub.options.props) {
      //     initProps(Sub)
      // }
      // Sub.extend = Super.extend;
      // Sub.mixin = Super.mixin
      // Sub.use = Super.use

      return Sub;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了所有的全局相关的内容
    Vue.options = {};
    initMixin(Vue); // 初始化全局过滤器,指令 组件; 都要挂载在 options 上

    ASSETS_TYPE.forEach(function (type) {
      Vue.options[type + 's'] = {};
    });
    Vue.options._base = Vue; // _base 是Vue的构造函数 本身
    // 注册 Extend 方法

    initExtend(Vue);
    initAssetRegister(Vue);
  }

  function Vue(options) {
    // 调用了 Vue 的 init 原型方法
    this._init(options);
  } // init 数据劫持 合并options


  initMixin$1(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalAPI(Vue); // $watcher 声明

  stateMixin(Vue); // dif test

  return Vue;

}));
//# sourceMappingURL=vue.js.map
