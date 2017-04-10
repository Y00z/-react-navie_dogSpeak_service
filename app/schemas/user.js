/**
 * Created by Yooz on 2016/11/24.
 */
'use strict'

//模式
var mongoose = require("mongoose")

//定义数据库的字段
var UserSchema = new mongoose.Schema({
    phoneNumber: {
        unique: true,        //唯一的
        type: String
    },
    verifyCode: String,     //验证码
    verified: {              //是否已经验证了
        type: Boolean,
        default: false
    },
    accessToken: String,
    mickname: String,       //名称
    gender: String,          //性别
    breed: String,           //品种
    age: String,             //年龄
    avatar: String,          //头像
    role: {                //用户权限
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})


//每存储的时候，都会调用一次这个方法。
UserSchema.pre('save', function (next) {
    if (this.isNew) { //数据是否新加的。
        this.meta.createAt = this.meta.updateAt = Date.now() //添加的时间，和修改时间，都改成当前时间
    } else {  //数据已经存在，就说明是修改更新数据，那么就只更新修改时间
        this.meta.updateAt = Date.now()
    }
    //执行该方法后，存储过程才会走下去。
    next();
})

UserSchema.statics = {
    //查询所有
    fatch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')   //排序
            .exec(cb)
    },
    //通过id查询
    findByid: function (id, cb) {
        return this
            .findOne({"_id": id})
            .exec(cb)
    },
}


module.exports = UserSchema