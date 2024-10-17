// 连接数据库
const { connectToDatabase } = require('../../mysqlConnection')
// 找到盐
async function findSalt(username) { // username: array
    const sql = `SELECT salt FROM users WHERE username = ?`
    const connection = await connectToDatabase()
    const [result] = await connection.query(sql, username)
    return result

}

// findSalt("gaoxiang")
// .then(response => {
//     if(response.length > 0) {
//         console.log(response[0].salt)
//     }else {
//         console.log("no user")
//     }
// })
// .catch(err=> console.log(err))

// 接收外部password然后加盐做哈希处理， 比较数据库中的哈希值



// 找到用户
async function hasUser(user) {
    try {
        const sql = `SELECT * FROM users WHERE username=? AND password=?`;
        const connection = await connectToDatabase()
        const [result] = await connection.query(sql, user); //user：Array
        console.log(result)
        if(result.length > 0) {
            return true
        }
    }catch(error) {
        console.log(error)
    }
}

module.exports = {
    hasUser
}