

var express = require('express')
var path = require("path")
var morgan = require('morgan')      //日志 原名称logger
var dbUrl = "mongodb://localhost/dog"
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var cookieSession = require("cookie-session");
var app = express()
var port = process.env.PORT || 3000
//连接数据库
mongoose.connect(dbUrl);
app.use(cookieParser())
//提交数据转换对象中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(port);
console.log("成功启动:" + port)

//在开发环境的时候
if ("development" === app.get('env')) {
    //在控制台输出信息
    app.set('showStackError', true);
    //想看到的信息， 请求的类型， 请求的url路径，   请求的状态。
    app.use(morgan(':method :url :status'))
    //格式化代码。
    app.locals.pretty = true
    mongoose.set('debug', true)
}

//需要放在最后面
//导入路由，传入app
require('./config/routes')(app)
