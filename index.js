let data = [
    {
      "question": "什么是JavaScript中的闭包（closure）？",
      "answer": "闭包是指函数可以记住并访问其词法作用域，即使在函数执行完成后，仍然能够访问外部函数的变量。"
    },
    {
      "question": "JavaScript中的`var`, `let`, `const`有什么区别？",
      "answer": "`var`声明的变量存在变量提升，作用域是函数作用域；`let`和`const`声明的变量没有提升，作用域是块级作用域。`const`声明的变量值不能被重新赋值。"
    },
    {
      "question": "解释一下事件冒泡和事件捕获的区别？",
      "answer": "事件捕获是从最外层元素开始，逐层向内触发事件；事件冒泡是从最内层元素开始，逐层向外触发事件。"
    },
]
// 我要写一个简单的单词卡
class Cards {
    constructor() {
        this.list = null
        this.initData()
        this.counter = 0
    }
    
    // 初始化data
    initData() {
        try {
            this.list = data
        } catch(error) {
            console.error("错误 ",error)
        }
        return this.list
    }

    hasQuestions() {
        return this.list.length > 0
    }

    next(){
        this.counter++
        let next = this.list[this.counter]
        return next
    }

}








