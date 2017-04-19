/**
 * Created by Yooz on 2017/4/18.
 */
'use strict'

var mongoose = require('mongoose')
var rebot = require('./../service/rebot')
var User = require('../models/user')


//检验是否登录
exports.hasToken = function (req, res,next) {
    var accessToken = req.body.accessToken || req.query.accessToken
    if (!accessToken) {
        res.json({
            success: false,
            err: '钥匙丢了'
        })
        return
    }

    User.findOne({accessToken: accessToken}, function (err, user) {
        if (!user) {
            res.json({
                success: false,
                err: '没登陆'
            })
            return
        }
        //把用户保存到全局
        req.session = req.session || {}
        req.session.user = user
        //如果已经登录了就执行下一步操作。
        next()
    })

}