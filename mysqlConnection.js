const mysql = require('mysql2/promise');
async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'quizCard',
    });
    return connection
}


module.exports =  {
    connectToDatabase
}