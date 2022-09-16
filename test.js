const compiler = require("vue-template-compiler");

// r就是ast
let r = compiler.compile(`<div style="color:red" id ="app"> hello {{name}}</div>`)

// 指令
let t = compiler.compile(`<div v-show="true">dave</div>`)


console.log(r.render);
console.log(t.render);