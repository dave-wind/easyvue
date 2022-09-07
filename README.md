### VUE 2.0 学习

### Rollup

##### 什么时候使用rollup
```js
1.不需要代码分割
2.不需要[模块热替换（HMR)][https://webpack.js.org/concepts/hot-module-replacement/]，
3.比较适合打包 js 的 sdk 或者封装的框架
那么你可以首选使用rollup
```

```js

1.项目初始化

npm init
npm install rollup @babel/core @babel/preset-env  @rollup/plugin-babel rollup-plugin-serve cross-env -D

rollup: 打包工具

@babel/core; babel 核心库


@babel/preset-env: babel预设 可以把使用的js高级语法 转化为es5 

@rollup/plugin-babel: 是rollup 与 babel的 bridge 桥梁

rollup-plugin-serve: 开启 静态服务

cross-env: 环境变量设置


rollup-plugin-commonjs: 在 rollup 中引用 commonjs 规范的包。该插件的作用是将 commonjs 模块转成 es6 模块

```


#### rollup 注意

```js
1.commonjs:
引用第三方库时，好像是因为库并没有严格的遵循 ES6 Module 输出模块，所以 import 的时候会报错,解决方案: 需要使用到 rollup-plugins-commonjs 的 namedExports 定义输出的模块名

```


### Vue 原理


#### 步骤
```js
Vue入口文件,当实例化Vue时 会进行初始化操作,内部会调用各种Mixin方法给vue 的原型添加方法


1.initMixin:增加初始化方法:

    0.声明 _$init方法
    1.对 new Vue 传进来的对象 上进行初始化 
    2.对data 数据进行 数据监控用的 就是 Object.defineproperty, 每一个key上都 设置 get set
    3.对对象和数组都进行 数据监控,对数组里 对象也会进行监控
    4.声明$mount 方法, 有el挂载元素 就在$init 内调用
    5. 没有render方法 就自己生成,通过compileToFunction 编译方法 生成 render模版方法 
    6.步骤:
    将 html 通过 paeseHTML->ast语法树 通过generate-> 字符串模版 (字符串拼接)-> with + new Function 生成render方法(模版引擎)
    
2.renderMixin: 增加渲染方法,调用render方法 ==>  render方法 生成虚拟dom    
    0.里面拓展了原型方法,_c,_v,_s 辅助 render方法里的方法;最后生成虚拟dom
    1.render方法从何而来, 当init时候,没有render 方法 去重新生成的
    2.在哪里调用的? 在lifecycleMixin里 挂载的时候调用的
    3. render 内部函数 其实也是调用 option 里的render方法, 用户不用 vue-compile-template生成 就要vue里自己生成render方法
    
 3.lifecycleMixin:
    0.增加_update方法,将虚拟dom 渲染成真实的dom  
    1.调用时机: 在init.js里 $mount里 进行了 初次挂载渲染 调用 mountComponent
    2. mountComponent 内 => 声明 new Watcher,会调用 updateComponent => 调用 _update方法  vm._update(vm._render()) 把 vm._render()返回的虚拟dom 再调用patch方法 转化为 真实的dom

```




#### 异步批量更新

```js

$nextTick 方法

当修改属性的时候, 内部会调用 nextTick; 如果用户在外面也写 $nextTick 也会被调用; 执行顺序 看调用顺序;

```


#### Vue组件原理

```js
0.原型知识:
// 声明一个类
 function Rabbit(){
    this.name = 'rabbit';

    this.say = function() {
        console.log('say')
    }
 }

 Rabbit.prototype.eat = function() {
    console.log('eat');
 }

 let r1 = new Rabbit;
 /*
 * 因为一个实例的构造函数指向其函数类本身;
 * default prototype 是一个对象,其唯一属性构造函数指向函数本身 
 * Rabbit.prototype (default prototype)
 */
 r1.constructor === Rabbit.prototype.constructor; // true

// 实例可以通过实例的构造函数去创建; 因为实例的构造函数指向函数本身
 let r2 = new r1.constructor();
 r2.constructor == r1.constructor; // true

// 实例原型链指针 指向类的原型
r1.__proto__ === Rabbit.prototype // true
Rabbit.prototype.__proto__ == Object.prototype // true
Object.prototype.__proto__ == null

/**
 *  一般没有人会问 构造函数的 指针指向哪? 
 * 和原型上任意方法指向都是一样的
 * eg: [].slice.__proto__; Rabbit.prototype.eat.__proto__
 * 都是 native 原生方法 非js代码 返回结果被 FunctionSourceString了
 **/
Rabbit.prototype.constructor.__proto__ //  ƒ () { [native code] }


/*
* 继承 原型链
*/

function Sub() {}
/**
 * 1.通过 Object.create 继承; 
 * 2.把构造函数指向其本身
 */
Sub.prototype = Object.create(Rabbit.prototype);
Sub.prototype.constructor = Sub;




1.Vue.extend:

实际上实现的是 子组件 对 父组件的 继承

Sub.prototype = Object.create(Vue.prototype)
Sub.prototype.constructor = Sub;

```