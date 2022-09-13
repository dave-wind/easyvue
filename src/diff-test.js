import { compileToFunction } from "./compiler/index";
import { createElm, patch } from "./vdom/patch";


export function diffDemo(Vue) {
    // dom 1
    let vm1 = new Vue({
        data: { name: 'hello' }
    })
    let render1 = compileToFunction(`<div id="app" a="1" style="background:blue">
        <div style="background:pink;" key="A">A</div>
        <div style="background:yellow;" key="B">B</div>
        <div style="background:green;" key="C">C</div>
    </div>`);
    let vnode = render1.call(vm1);


    let el = createElm(vnode);
    console.log("el 渲染结果:----", el)
    document.body.appendChild(el);


    //dom2

    let vm2 = new Vue({
        data: { name: 'world', age: 18 }
    })
    // let render2 = compileToFunction('<div id="aaa" b="2" style="color:red;">{{name}} {{age}}</div>');
    let render2 = compileToFunction(`<div id="aaa" b="2">
        <div style="background:pink;" key="A">A</div>
        <div style="background:yellow;" key="B">B</div>
        <div style="background:blue;" key="E">E</div>
    </div>`);
    let newVnode = render2.call(vm2);
    console.log("newVnode--", newVnode)

    //  dom2 替换 dom1
    setTimeout(() => {
        patch(vnode, newVnode)
    }, 1500)
}


/**
 *  <div style="background:red;" key="Q">Q</div>
        <div style="background:pink;" key="A">A</div>
        <div style="background:blue;" key="F">F</div>
        <div style="background:green;" key="C">C</div>
        <div style="background:#ccc;" key="N">N</div>
 */