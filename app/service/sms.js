/**
 * Created by Yooz on 2017/4/7.
 */
'use strict'
var https = require('https');
var querystring = require('querystring');
var Promise = require('bluebird')
var speakeasy = require('speakeasy');

//生成验证码
exports.getCode = function () {
    var code = speakeasy.totp({
        secret: 'yoozooy',
        digits: 4
    })
    return code
}

//发送验证码
exports.send = function (phoneNumber, msg) {
    return new Promise(function (resolve, reject) {
        if (!phoneNumber)
            return reject(new Error('手机号为空了'))
    })

    var postData = {
        mobile: phoneNumber,
        message: msg + "【悠哉说】"
    };

    var content = querystring.stringify(postData);

    var options = {
        host: 'sms-api.luosimao.com',
        path: '/v1/send.json',
        method: 'POST',
        auth: 'api:key-2e19948b1ff1888e5d98555543b3db9e',
        agent: false,
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };

    var str = ''
    var req = https.request(options, function (res) {
        if (res.statusCode === 404) {
            return reject(new Error('服务器没有响应'))
        }
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk
            console.log(JSON.parse(chunk));
        });
        res.on('end', function () {
            var data
            console.log('over');
            try {
                data = JSON.parse(str)
            } catch (e) {
                reject(e)
            }

            if (data.error === 0) {
                reject(data)
            } else {
                var errorMap = {
                    '-10': '验证信息失败',
                    '-20': '短信余额不足',
                    '-30': '短信内容为空',
                    '-31': '短信内容存在敏感词',
                    '-32': '短信内容缺少签名信息',
                    '-40': '错误的手机号',
                    '-41': '号码在黑名单中',
                    '-42': '验证码类短信发送频率过快',
                    '-50': '请求发送IP不在白名单内'
                }
                reject(new Error(errorMap[data.error]))
            }
        });
    });

    req.write(content);
    req.end();
}


