// node ./test/nodejsbase.js 运行测试代码


let h
let a = 1;
let b = "hello world";
const c = {
    a,b
};
const d = [1,2,3];

const e = false;
const n = null
const n1=Object.create(null) //独一无二的null
const n2 =null
const f =function(){
    console.log("hello world!!")
}
console.log(typeof (h)) //underfined 尚未初始化
console.log(typeof (a)) //number
console.log(typeof (b))//string
console.log(typeof (c))//object
console.log(typeof (d))//object
console.log(typeof (e))//boolean
console.log(typeof (f))//function
console.log(typeof (n))//object  js 有名的坑  null也是object
console.log(typeof (n1))//object  js 有名的坑  null也是object

console.log(n===n1)//false
console.log(n===n2)//true
console.log(n1===Object.create(null))//false   两个不同的对象



console.log(d instanceof Array )//true
