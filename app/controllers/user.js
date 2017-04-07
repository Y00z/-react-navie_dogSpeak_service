/**
 * Created by Yooz on 2016/12/1.
 */
var User = require('../models/user');

exports.signup = function (req, res) {

    res.json({
        success:true
    })
    // var _user = req.body.user
    //通过用户名查询是否有该用户。
    // User.findOne({name: _user.name}, function (err, user) {
    //     if (err) console.log(err)
    //     if (user) {
    //         res.redirect("/admin/user/list")
    //     } else {
    //         var user = new User(_user)
    //         user.save(function (err, user) {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 res.redirect("/login")
    //             }
    //         })
    //     }
    // })
}

exports.verify = function (req, res) {

}

exports.update = function (req, res) {

}