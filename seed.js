// 这个文件用来插入json数据
const mysql = require('mysql2/promise');
const hash = require('pbkdf2-password')()
const data = [
    {
      question: "什么是JavaScript中的闭包（closure）？",
      answer: "闭包是指函数可以记住并访问其词法作用域，即使在函数执行完成后，仍然能够访问外部函数的变量。"
    },
    {
      question: "JavaScript中的`var`, `let`, `const`有什么区别？",
      answer: "`var`声明的变量存在变量提升，作用域是函数作用域；`let`和`const`声明的变量没有提升，作用域是块级作用域。`const`声明的变量值不能被重新赋值。"
    },
    {
      question: "解释一下事件冒泡和事件捕获的区别？",
      answer: "事件捕获是从最外层元素开始，逐层向内触发事件；事件冒泡是从最内层元素开始，逐层向外触发事件。"
    },
    {
      question: "如何在JavaScript中实现继承？",
      answer: "可以通过原型链（`prototype`）实现继承，也可以通过ES6的`class`关键字和`extends`来实现类继承。"
    },
    {
      question: "什么是Promise，它是如何工作的？",
      answer: "Promise 是用于处理异步操作的对象。它有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。可以通过`then`和`catch`方法来处理成功和失败的情况。"
    },
    {
      question: "JavaScript中如何避免回调地狱？",
      answer: "可以通过使用Promise或async/await来避免回调地狱，使代码更加简洁和可读。"
    },
    {
      question: "什么是箭头函数，和普通函数的区别是什么？",
      answer: "箭头函数是一种更简洁的函数表达式。它不会创建自己的`this`，而是从定义时的上下文中继承`this`，不能用作构造函数，没有`arguments`对象。"
    },
    {
      question: "解释一下浅拷贝和深拷贝的区别？",
      answer: "浅拷贝只复制对象的第一层属性，对于嵌套对象，只复制引用；深拷贝则递归复制整个对象，包括嵌套对象。"
    },
    {
      question: "JavaScript中的`==`和`===`有什么区别？",
      answer: "`==`是宽松的相等比较，会在比较前进行类型转换；`===`是严格相等比较，要求值和类型都相同。"
    },
    {
      question: "如何检查数组是否包含某个值？",
      answer: "可以使用`Array.prototype.includes()`方法检查数组是否包含某个值，或者使用`indexOf()`方法判断返回值是否为`-1`。"
    }
  ]

// 创建连接
async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'quizCard'
    });

    try {
        // 插入data：数组数据
        // data.forEach(async ({question, answer}) => {
        //     try {
        //         const sql = `INSERT INTO quizs (question, answer) VALUES (?, ?)`;
        //         let [result, field] = await insertData(sql, [question, answer]);
        //         console.log(result);
        //         console.log(field);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // });

        // async function insertData(sql, params) {
        //     const [result, field] = await connection.query(sql, params);
        //     console.log(result, field)
        //     return [result, field];
        // }

        // 插入一个用户
        const sql = `INSERT INTO users(username, password, password_hash, salt) VALUES(?, ?, ?,?)`;
        function createUser(username, password) {
          return {
            username: username,
            password: password
          }
        }
        let user = createUser("gaoxiang", "123456") // user: obj
        function hashPassword(userPassword) {
          return new Promise((resolve, reject) => {
            hash({password: user.password}, function(err, pass, salt, hash) {
              if(err) return reject(err);
              resolve({hash, salt})
            })
          })
        }

        const { salt, hash: password_hash } = await hashPassword(user.password);
        user.salt = salt;
        user.password_hash = password_hash
        const {username, password, password_hash:hashValue, salt:saltValue} = user;
        console.log(user); // 查看user是否存在
        const column  = [username, password, hashValue, saltValue]
        const [result, fields] = await connection.query(sql, column)
        console.log(result);
        console.log(fields)
    } finally {
        // 结束连接
        await connection.end();  // 使用 await
        console.log('Connection closed');
    }
}

main().catch(err => {
    console.error(err);
});
  
