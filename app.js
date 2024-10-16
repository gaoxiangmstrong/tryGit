const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const { Cards } = require('./public/javascripts/Cards')
const { hasUser } = require('./public/javascripts/user')
const cookieSession = require('express-session')
const parseurl = require('parseurl')


// 环境配置中间件
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(cookieSession({
    secret: "this is an ID",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000 * 1000 } // 10000秒后cookie失效
}))

// 中间件
app.use(function (req, res, next) {
    if(!req.session.views) {
        req.session.views = {}
    }
    var pathname = parseurl(req).pathname
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
    next()
})

function restrict(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
}

app.get('/',restrict, async(req, res) => {
    try {
        let cards = new Cards()
        await cards.queryDataAll()
        let list = cards.list //[]
        res.json(list)
    } catch(err) {
        console.log(err)
    }
}),

app.get('/createQuiz', (req, res) => {
    res.render('createQuiz')
})

app.post('/createQuiz', async(req, res) => {
    let oneQuiz = [req.body.question, req.body.answer]
    console.log(oneQuiz)
    let cards = new Cards()
    try {
        let response = await cards.insertData(oneQuiz)
        if (response.ok === 1) {
            return res.json({ok: 1, redirectUrl: '/quiz'})
        }
    } catch(error) {
        console.log(error)
    }
    res.json({ok: 0})
})


app.get('/jsonData', async(req, res) => {
    let cards = new Cards()
    await cards.initData()
    let list = cards.list //数组
    let counter = 0
    res.render('home', {list, counter})
})

app.get('/quiz', async(req, res) => {
    res.render('quiz')
})

// 中间件：作用为测试是否有user字段
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else next('route')
}

// 测试cookie-session
app.get('/login',isAuthenticated, function (req, res) {
    const {username, password} = req.session.user
    res.send('hello, ' + username + '!' +
    ' <a href="/logout">Logout</a>')
})

// 第一次请求
app.get('/login', function(req, res) {
    res.render('login')
})

app.post('/loginAuth',async function(req, res) {
    // db中查找user:Array
    let user = [req.body.username, req.body.password]
    let userExists = await hasUser(user) // 返回真
    if(userExists) {
        // 生成session
        req.session.regenerate(function() {
            req.session.user = req.body
            req.session.save(function() {
                res.json({
                    ok:1,
                    redirectUrl: '/login'
                })
            })
        })
    } else {
        res.json({ok: 0})
    }
})

app.get('/shoppingCart', function(req, res) {
    // hasUser 
    if(req.session.user) {
        req.session.cart = ["鸡蛋", "牛奶", "面包"]
        const cart = req.session.cart
        const username = req.session.user.username
        res.render('shoppingCart', {cart, username})
    } else {
        res.send('no user')
    }
})

app.get('/logout', function(req, res, next) {
    // 删除session并重定向到login页面
    req.session.user = null
    req.session.regenerate(function() {
        res.redirect('login')
    })
})

app.get('/foo', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

// app.delete
app.delete('/delete', async function(req, res, next) {
    let card = new Cards();
    // 拿到ID
    let id = req.body.id
    let deleteReq = await card.delete([id])
    if(deleteReq.ok && deleteReq.ok === 1) {
        res.json({
            ok: 1,
            message: "你成功了去重定向吧"
        })
    }

})


app.listen(port, ()=> {
    console.log("server begin")
})