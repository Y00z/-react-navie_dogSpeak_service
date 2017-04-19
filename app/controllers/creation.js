/**
 * Created by Yooz on 2016/12/1.
 */
var Creation = require('../models/creation')
var xss = require('xss')
var uuid = require('uuid')
var sms = require('./../service/sms')
var conf = require('./../../config/conf')
var rebot = require('./../service/rebot')

exports.video = function (req, res) {
    var body = req.body
    var videoData = body.video
    var accessToken = body.accessToken
    if(!accessToken){
        res.json({
            success: false,
            err: '请登录'
        })
        return
    }
    if (!videoData || !videoData.key) {
        res.json({
            success: false,
            err: '视频没有上传成功'
        })
        return
    }
    var user = req.session.user
    Creation.findOne({qiniu_key: videoData.key}, function (err, creation) {
        if (err) console.log(err)
        if (!creation) {
            creation = new Creation({
                author: user._id,
                qiniu_key: videoData.key,
                persistentId: videoData.persistentId
            })
            creation.save(function (err, creation) {
                if (err) console.log(err)
            })
        }

        res.json({
            success: true,
            data: Creation._id
        })
    })


}