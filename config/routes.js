/**
 * Created by Yooz on 2017/4/7.
 */
var User = require('../app/controllers/user')

//接收传进来的app，然后抛出
module.exports = function (app) {
    //预处理,请求之前都会先走这个方法，都会先走这个方法。
//用来判断每一个页面，用户是否登录。
//     app.use(function (req, res, next) {
//         //如果持久化了，就把user给全局变量，在前端也可以拿到。
//         var _user = req.session.user
//         //如果user是空的，就把空的赋值给locals
//         app.locals.user = _user
//         //继续往下面执行
//         next()
//     })

    //签名
    app.post('/api/signature',User.signature)
    //登录
    app.post('/api/u/signup',User.signup)
    //验证码
    app.post('/api/u/verify',User.verify)
    //更新
    app.post('/api/u/update',User.update)
}