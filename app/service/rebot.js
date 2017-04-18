/**
 * Created by Yooz on 2017/4/13.
 */

var qiniu = require('qiniu');
var conf = require('./../../config/conf')
var sha1 = require('sha1')
var uuid = require('uuid')

qiniu.conf.ACCESS_KEY = conf.qiniu.Ak
qiniu.conf.SECRET_KEY = conf.qiniu.SK

//要上传的空间
bucket = 'tupian'

//构建上传策略函数
// function uptoken(bucket, key) {
//     return putPolicy.token();
// }


exports.getQiniuToken = function (body) {
    var type = body.type
    var key = uuid.v4()
    var options = {
        persistentNotifyUrl :conf.notify
    }
    if (type === 'avatar') {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        key += '.jpeg'
    } else if (type === 'video') {
        key += '.mp4'
        options.scope = 'tupian:' + key
        options.persistentOps = 'avthumb/mp4/an/1'
        putPolicy = new qiniu.rs.PutPolicy2(options);
    } else if (type === 'autio') {

    }
    var token = putPolicy.token();
    return {
        token :token,
        key : key
    }
}

exports.getCloudinary = function (body) {
    var timestamp = body.timestamp
    var type = body.type
    var folder
    var tags
    if (type === 'avatar') {
        folder = 'avatar'
        tags = 'app,avatar'
    } else if (type === 'video') {
        folder = 'video'
        tags = 'app,video'
    } else if (type === 'audio') {
        folder = 'audio'
        tags = 'app,autio'
    }
    var signature = 'folder=' + folder + "&tags=" + tags +
        '&timestamp=' + timestamp + conf.cloudinary.api_secret
    signature = sha1(signature)
    return signature
}

