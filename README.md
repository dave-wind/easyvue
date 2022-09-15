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



1.组件声明
Vue.component 会被注册成一个全局方法;调用也是全局组件;
都会定义在 Vue.options 上
原理:
    0.首先他会把 Vue.component('',options)里的 options 内部 转变为构造函数; 使用 this.options._base.extend, 这里实例的_base 指的是统一的父类Vue,因为考虑可能组件也有VueComponent.component;目的是保证 子组件是继承Vue组件;在其拓展不会影响Vue

2.Vue.extend:
    0.在内部声明VueComponent 子组件;目的是 内部初始化 调用 _this.init() 方法; 该方法从父组件而来所以需要继承
        const Sub = function Vuecomponent(options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Vue.prototype)
        Sub.prototype.constructor = Sub;
        // 子类 options 与Vue.options 合并
        // 一些方法 比如 component directive filter 子组件都会继承
        Sub.options = mergeOptions(..) 

    1.更改组件合并策略:(子组件的options 采用了和生命周期类似的合并策略;)
        如果不进行合并,可能子组件重名全局组件就会被覆盖;
        解决:
        function mergeAssets(parentVal, childVal) {
        // 继承了父级 res.__proto__ = parentVal; 
        const res = Object.create(parentVal); 
            if (childVal) {
                for (let key in childVal) {
                    // 让组件 先找自己的局部组件,找不到根据原型链 网上找
                    res[key] = childVal[key]
                }
            }
            return res;
        }
        合并完 子组件先从自身找, 找不到 再根据 __proto__ 向上找;所以全局组件可以在任何地方调用

3.组件渲染:

    1.render 方法里去渲染组件需要特殊判断,原先是只渲染原生标签
    在createElement方法中 先判断非原生标签 需要去找到组件的定义,通过构造函数 去创建组件 生成虚拟节点

    function createElement(vm, tag, data = {}, ...children) {

        if(原生组件) {
            return vnode(xxx)
        }else {
            // vm是实例,在实例上的$options方法上找到子组件的定义
             let Ctor = vm.$options.components[tag];
             // 通过构造函数 去创建组件 生成虚拟节点
              return createComponent(vm, tag, data, key, children, Ctor)
        }
    }

    function createComponent(vm, tag, data, key, children, Ctor) {
        // 如果传的是对象 需要 通过 extend 变成构造函数, 继承父组件方法和属性等
        if (isObject(Ctor)) {       
            Ctor = vm.$options._base.extend(Ctor)
        }

        // 定义的 组件内部的生命周期
        data.hook = {
            init(vnode) {
                // 当前组件的实例, 虚拟节点上 componentInstance 表示的就是vue实例
                let child = vnode.componentInstance = new Ctor({ _isComponent: true });
                // 组件的挂载 
                child.$mount();
            }
            // ....
        }

        let componentObj = {
            Ctor, // 组件的构造函数 方便子组件调用其他方法
            children // 子组件children 是插槽
        }

        // 组件内部会自动调用 extend; 创建虚拟节点; 组件是没有孩子children, 只有插槽
        return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, componentObj)
    }

    2.在子组件 执行init的时候 是需要挂载的,都会执行 _update 所以每个组件都会创建Watcher. 需要手动调用$mount, 因为他们options上没有传el;所以自定义了组件生命周期,要先内部调用.


    3. 渲染会调用 patch方法 把结果 放在 $el上;

    4.总结: Vue.component || 子组件声明 ==> 传的options 内部执行Vue.extend继承, 通过组件原型链的合并策略 ==> 渲染的时候,判断是组件, 去创建组件,就会new构造函数 ==> 就会调用init初始化, 然后拿到构造函数实例,放到虚拟节点 vnode.componentInstance上 还有手动调用$mount方法; 就会把真实dom放到实例上==> 最后渲染的时候 返回el即可
    
    // 所以父子组件渲染,是拿整个vnode去渲染,有子节点递归调用.生命周期执行顺序: 都是创建,先父后子,再挂载, 先子后父 最后 输出el

注意⚠️:
组件渲染 会调用当前组件对于的构造函数产生一个实例,
每个组件使用 都会调用Vue.extend,创建构造函数
实例化子组件,会将当前options 和用户定义选项合并 mergeOptions
通过创建实例,内部会调用 子类_init() 内部会创建渲染watcher 将渲染结果放到 vm.$el上 = 组件渲染结果

```

#### 数据劫持 && 依赖收集

```js

new Vue 的时候 内部会调用 _init方法,把options里传的data 进行initData 初始化
1. 对data上所有的key 进行代理,转移取值 把data 转移到_data上 这样直接访问vm.xxx

2. MVVM模式数据劫持,调用Object.defineProperty;  new Observer(data); 内部区别对象和数组进行数据劫持.
    a.对象情况下 直接调用 walk方法, 对对象每一个key进行深度遍历,如果对象下的值还是对象 需要进行递归调用observe 继续劫持. set方法也需要判断,新值是对象 也需要递归调用.

    b. new Dep() Vue里数据劫持 data里每一个对象对应一个dep,dep主要用来做发布订阅的, 在访问属性get时,收集watcher ,在修改时 调用wathcer update方法 更新视图.

    c. 当我们初始化渲染时候, 会 new Watcher  内部会创建一个watcher,存到栈当中, 当我们 访问vm实例任何属性时候, 都会走get方法, 判断 Dep.target 是否存在, 存在就需要调用 dep.depend方法:
    depend() {
        Dep.target.addDep(this) // this是dep实例 为后面用
    }
    这里的 Dep.target 就是watcher实例, 调用其addDep方法,顾名思义就是存dep, 在Watcher 类内部 也会去去重 存dep;最后调用dep 去存一个watcher; 

    d. 在只有一个组件实例情况下,相当于 dep是关联一个个不重复的属性,然后存放的一个watcher 俩者都避免重复,就会避免重复渲染; 而数据劫持在其中 冲当观察者,当依赖存好以后, 去set 更新属性时, 通知dep notify 发布, 就会调用watcher 去update; 

    e. 当我们 new Watcher 渲染页面的时候, 都会访问data里的属性, 那时候已经把依赖收集起来了, 这里的watcher用的是渲染watcher收集的, 当我们set 修改属性的时候, 就直接去拿出 watcher 去更新视图了
 

```





#### Vue2 Dom-diff

```js

Vue dom-diff 主要是平级比对,采用的是双指针 对旧vnode和新vnode进行比对, 准确说 是四个指针,四个节点, 旧头指针,尾指针, 新vnode的头和尾; 以及旧新的头尾节点.

patch方法,是一个把旧节点和新虚拟节点 对比 生成真实dom的方法
1.首先 if 判断 是否为组件, 如果没有旧vnode 那么认为是组件 会 空挂载 return dom
2. 如果是真实html标签,含有nodeType 就用 oldvnode 的parent.insertBefore 插入元素; 替换删除 老dom
3.如果不是真实标签 那继续走虚拟节点思路:
    第一判断 俩虚拟节点 标签是否一致,不一致 直接替换
    第二 判断是否为文本, 是文本 在内部对比, 文本不一样 替换掉文本
    第三 ,复用节点,vnode.el = oldVnode.el 去更新属性, 如果都有子节点,调用updateChildren,
    第四, 如果只有新节点有children, 旧节点没有, 直接循环新节点替换,转化为真实dom,  el.appendChild(createElm(child));
    第五, 如果老的有children, 新没有 直接全部置空
4.调用 updateChildren 方法步骤:
       // 第一个指针指向oldVnode 开头
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    // 第二个指针指向oldVnode 尾部
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    // 第三个指针指向 newVnode 开头
    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
     // 第四个指针指向 newVnode 尾部
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    A.优化向后插入元素情况,表示俩虚拟节点,开头节点相同 对比
     A B C D
     A B C E
     ++ oldStartIndex,++newStartIndex,指针直到D和E,发现节点不同,新旧头节点不同,尾节点也不同,头尾都不同, 所以采用暴力比对,发现E节点在旧vnode没有 直接在旧startIndex前插入元素(因为oldstartIndex 一直在移动循环), 最后while循环完, , oldStartIndex <= oldEndIndex 时,删除 不必要的oldChid 元素 D 即可


    B.优化向前插入元素情况,结尾节点相同 对比, 倒着比

    C. 头移尾 情况,表示开头,结尾都不相同,那旧vnode开头 和 新vnode 结尾对比, 当标签和key一样,就把A插入到后面,然后指针移动, ++oldStartIndex, 新vnode 尾指针 从右往左, --newEndIndex;主要是移动旧vnode;后续就是 B与B比对 一样 C与C比对一样 结束 只移动dom一次
       A B C
       B C A

     D.尾移头 一样;把旧vnode 最后一个D 移动到 旧vnode前面
       A B C D
       D A B C
    parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
    移动完以后 移动指针, --oldEndIndex; ++newStartIndex

    E.暴力对比 针对以上都不同的情况:
        现根据老节点key,做一个映射表,拿新的虚拟节点去映射表查找,如果可以查到,则进行移动(移到头指针前面位置)如果找不到就在头指针插入新元素)

        A B C E
        Q A C F

      过程表示: 
      1.新vnode里的Q在 旧vnode的keymap里找不到 直接 插入到startIndex指针也就是A之前:
      [Q]A B C E
        .. A C F
          ++ newStartIndex 为 1 指向A
      2. 发现A与A相同; 旧指针也++i 指向 B,新指针指向C
        [Q][A] B C E
             ..C F

       3. 如上发现,头与头节点,头与尾,尾与头都不同,走暴力对比, 且C能在 旧vnodekeyMap里找到; 所以要复用该vnode,就是moveVnode 走到了暴力对比else逻辑; 为了防范数组塌陷,把 C设置为undefined; 再把当前C 移动到旧指针之前,如果有子内容 比如text等 需要patch 比较子元素;最后 新指针,新节点指向下一个 F;
         [Q][A][C]B undefined E
                ..F
        4.F同理; 最后新vnode 循环完; 如果oldStartIndex <= oldEndIndex; 需要循环 oldChildren  去remove 那些child,得   Q A C F 

      // map是oldvnode 根据key做的映射对象, 拿到新vnode 去查找, 找不到 旧在oldvnode节点前插入
      let moveIndex = map[newStartVnode.key];
       if (!moveIndex) { 
           parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
       } 
       // 如果找的到 就复用该vnode
       else { 
            let moveVnode = oldChildren[moveIndex];
            // 为了避免循环塌陷,还要移动完以后, 设置为空
            oldChildren[moveIndex] = undefined;
            parent.insertBefore(moveVnode.el, oldStartVnode.el);// 放在头指针前面
            patch(moveVnode,newStartVnode)
         }
        // 最后 移动指针 准备下次循环
        newStartVnode = newChildren[++newStartIndex];   

#注在比对当中,因为避免循环塌陷,移动完以后设置为空的节点; 当俩vnode对比节点相同后移会遇到undefined的节点, 需要开头做判断 跳过 undefined节点; 还要考虑到反向操作;尾移头那种 即可;
    if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) { // 反向操作
            oldEndVnode = oldChildren[--oldEndIndex]
    } else ...


#最后在 lifecycle.js _update方法里;加入判断是否为初次渲染和非初次渲染需要在 实例vm上挂载一个 _vnode; 保证下次 vnode对比 即可:

Vue.prototype._update = function(vnode) {
    const vm = this;
    const prevVnode = vm._vnode; // 保存上一次虚拟节点为了实现对比
     vm._vnode = vnode; // 真实渲染内容 <div></div>...

    // 第一次 prevVnode没有值 走初次渲染
     if (!prevVnode) {
            // 通过虚拟节点 渲染真实的dom, 去替换 真实的el
            vm.$el = patch(vm.$el, vnode);
        }else {
            // 拿到保存的上一次 真实内容 去对比
            vm.$el =  patch(prevVnode, vnode);
     }
}

注:
vm._vnode.parent = vm.$vnode 
$vnode 是注册的组件, _vnode为组件真实渲染的内容 div ...





#key的重要性:
// 旧
<li>a</li>
<li>b</li>
<li>c</li>

// 变新
<li>c</li>
<li>b</li>
<li>a</li>

#没有key
如上, 没有key,会复用,会做3次dom操作,但是如果有key 就会在基于老的vdom上位移 元素 提高性能.

#key索引
如果key 有 用索引, 当dom 进行序列操作,比如倒叙操作等 但key还是按索引排列, 前后索引一样,标签一样就会去比对孩子children 就会去替换孩子,
但是key用唯一id 比如如上图, 他只需要移动dom2次位移 即可实现. dom-diff 是基于 旧vnode 去生成 dom,无需重新创建dom,操作去移动dom,多的dom删掉即可.


```


#### watcher的原理

本质是调用是基于$watch的 里的new Watcher 对数据改变进行响应
```js

第一 watch 监听数据变化 一般有几种写法

 watch:{
     name: [{
                handler: 'handler',
                sync: true
        }],
        name2(newVal,oldVal) {

        },
         name3: {
             handler(newVal,oldVal){

             },
            sync: true // 每次改变都会触发
        }
 }

 this.$watch('xx',()=>{})

有 数组型, 函数型, 对象型 还有直接调用$watch 

1: 是对参数的格式化操作 把其都转为 key handler的形式
如上 拿到 key为name, handler 为一个 callback

2. 调用 new Watcher(vm,key,cb,options)

给 user 调用的 wathcer 加上标识 表示 是user的wathcer 
options.user = true;

3. Watcher 类里


```