const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const { Cards } = require('./controller')

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/',async(req, res) => {
    let cards = new Cards()
    await cards.initData()
    let list = cards.list //[]
    res.json(list)
}),

app.get('/home', async(req, res) => {
    let cards = new Cards()
    await cards.initData()
    let list = cards.list //数组
    let counter = 0
    res.render('home', {list, counter})
})

// 计数器测试
app.get('/counter', (req,res) => {
    let counter = 0
    
    res.render('counter',{counter})
})

app.listen(port, ()=> {
    console.log("server begin")
})