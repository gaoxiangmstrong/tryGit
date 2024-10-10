const fs = require('fs').promises;

// 我要写一个简单的单词卡
class Cards {
    constructor() {
        this.list = []
        this.counter = 0
    }
    
    // 初始化data
    async initData() {
        try {
            let data = await fs.readFile('./data.json', 'utf-8')
            this.list = JSON.parse(data)
        } catch(error) {
            console.error("错误 ",error)
        }
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


module.exports = {
    Cards
  }
  


