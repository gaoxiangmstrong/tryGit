const fs = require('fs').promises;
const { connectToDatabase } = require('../../mysqlConnection')

// 我要写一个简单的单词卡
class Cards {
    constructor() {
        this.list = []
        this.counter = 0
    }
    
    // 请求本地文件json
    async initData() {
        try {
            let data = await fs.readFile('./data.json', 'utf-8')
            this.list = JSON.parse(data)
        } catch(error) {
            console.error("错误 ",error)
        }
    }

    // 数据库请求数据
    async queryDataAll() {
        try {
            const sql = 'SELECT * FROM quizs'
            const connection = await connectToDatabase()
            const [results] = await connection.query(sql)
            console.log(results)
            this.list = results
        }catch (error) {
            console.log(error)
        }
    }
    async getCardId(count) {
        return this.list[count].id
    }

    // 插入数据
    async insertData(param) {
        try {
            const sql = 'INSERT INTO quizs(`question`, `answer`) VALUES (?, ?)'
            const connection = await connectToDatabase() 
            const [results] = await connection.query(sql, param) // param: 数组
            if(results) {
                return {
                    ok: 1
                }
            }
        }catch(error) {
            console.log(error)
        }
    }

    // 删除ID指定的数据
    async delete(id) {
        const sql = `DELETE FROM quizs WHERE id = ?`
        const connection = await connectToDatabase()
        const [result] = await connection.query(sql, id) // param: 数组
        if(result) {
            return {
                ok: 1,
                method:'delete',
                query:'deleteRequest',
                delete_id: id,
                result: result
            }
        }
        return {
            ok: 0
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
  


