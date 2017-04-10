/**
 * Created by Yooz on 2016/12/1.
 */
var User = require('../models/user')
var xss = require('xss')
var uuid = require('uuid')
var sms = require('./../service/sms')

exports.signup = function (req, res) {
    //var phoneNumber = xss(req.body.phoneNumber.trim())
    var phoneNumber = xss(req.body.phoneNumber.trim())
    console.log(phoneNumber)
    //通过phoneNumber来查找用户
    User.findOne({phoneNumber: phoneNumber}, function (err, user) {
        if (err) console.log(err)

        var verifyCode = sms.getCode()
        //如果用户不存在，就新建一个用户
        if (!user) {
            var accessToken = uuid.v4()
            user = new User({
                nikename: '悠哉狗',
                phoneNumber: phoneNumber,
                verifyCode: verifyCode,
                accessToken: accessToken
            })
        } else {  //如果用户存在，就来更新验证码，
            user.verifyCode = verifyCode
        }
        //最后保存
        user.save(function (err, user) {
            if (err) console.log(err)

            var msg = "您的验证码是：" + verifyCode
            try {
                sms.send(phoneNumber, msg)
            } catch (e) {
                console.log(e)
                res.json({
                    success: false
                })
            }
            res.json({
                success: true
            })
        })
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