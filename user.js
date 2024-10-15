// 连接数据库
const { connectToDatabase } = require('./mysqlConnection')
// 找到用户
async function hasUser(user) {
    const sql = `SELECT * FROM users WHERE username=? AND password=?`;
    const connection = await connectToDatabase()
    const [result] = await connection.query(sql, user); //user：Array
    console.log(result)
    if(result) {
        return true
    }
}

module.exports = {
    hasUser
}