/**
 * Created by Yooz on 2016/12/1.
 */
var User = require('../models/user')
var xss = require('xss')
var uuid = require('uuid')
var sms = require('./../service/sms')
var conf = require('./../../config/conf')
var rebot = require('./../service/rebot')

exports.signature = function (req, res) {
    var body = req.body
    var cloud = body.cloud
    var token
    var key
    //如果cloud是qiniu就说明是走的七牛
    if (cloud == 'qiniu') {
        key = uuid.v4() + '.jpeg'
        token = rebot.getQiniuToken(key)
    } else {
        token = rebot.getCloudinary(body)
    }
    res.json({
        success: true,
        data: {
            token: token,
            key: key
        }
    })
    return
}

exports.signup = function (req, res) {
    var phoneNumber = req.body.phoneNumber
    if (!phoneNumber) {
        res.json({
            success: false,
            err: "电话号码不能为空"
        })
        return;
    }
    phoneNumber = xss(phoneNumber.trim())
    console.log(phoneNumber+"::")
    //通过phoneNumber来查找用户
    User.findOne({phoneNumber: phoneNumber}, function (err, user) {
        if (err) console.log(err)
        var verifyCode = sms.getCode()
        //如果用户不存在，就新建一个用户,第一次登录。
        if (!user) {
            var accessToken = uuid.v4()
            user = new User({
                nickname: '悠哉狗',
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
            // var msg = "您的验证码是：" + verifyCode
            var msg = verifyCode
            try {
                sms.sendVoice(phoneNumber, msg)
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
}

//验证
exports.verify = function (req, res) {
    var phoneNumber = req.body.phoneNumber
    var verifyCode = req.body.verifyCode
    if (!phoneNumber || !verifyCode) {
        res.json({
            success: false,
            err: "验证未通过。"
        })
        return;
    }
    verifyCode = verifyCode.trim()
    phoneNumber = phoneNumber.trim()
    console.log(phoneNumber+"::" + verifyCode)
    User.findOne({phoneNumber: phoneNumber, verifyCode: verifyCode}, function (err, user) {
        if (!user) {
            res.json({
                success: false,
                err: "验证未通过。"
            })
            return;
        } else {        //用户登录成功后，更改验证状态并保存，然后返回给用户的数据
            user.verified = true;
            user.save(function (err, user) {
                if (err) console.log(err)
            })
            res.json({
                success: true,
                data: {
                    nickname: user.nickname,
                    accessToken: user.accessToken,
                    gender: user.gender,
                    breed: user.breed,
                    age: user.age,
                    avatar: user.avatar,
                    _id: user._id
                }
            })
        }
    })
}

//更新用户信息
exports.update = function (req, res) {
    var body = req.body;
    var accessToken = body.accessToken;
    User.findOne({accessToken: accessToken}, function (err, user) {
        if (!user) {
            res.json({
                success: false,
                err: "用户不见了"
            })
            return;
        } else {    //如果用户提交了这些字段信息
            var fields = ['avatar', 'gender', 'age', 'nickname', 'breed']
            //就遍历这些信息，并且把提交的信息都赋值给user
            fields.forEach(function (field) {
                user[field] = body[field]
            })
            //赋值之后保存新的user，并且返回新的user数据
            user.save(function (err, user) {
                if (err) console.log(err)
                res.json({
                    success: true,
                    data: {
                        nickname: user.nickname,
                        accessToken: user.accessToken,
                        gender: user.gender,
                        breed: user.breed,
                        age: user.age,
                        avatar: user.avatar,
                        _id: user._id
                    }
                })
            })
        }
    })
}