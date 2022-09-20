const compiler = require("vue-template-compiler");

// r就是ast
let r = compiler.compile(`<div style="color:red" id ="app"> hello {{name}}</div>`)

// 指令
let t = compiler.compile(`<div v-if="false" v-for="i in 3"></div>`)



let ast = compiler.compile(`<component v-model="name" />`)

// console.log(r.render);
console.log(ast.render);