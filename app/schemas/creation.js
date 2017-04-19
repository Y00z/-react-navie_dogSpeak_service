/**
 * Created by Yooz on 2016/11/24.
 */
'use strict'

//模式
var mongoose = require("mongoose")
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var Mixed = Schema.Types.Mixed

//定义数据库的字段
var CreationSchema = new Schema({
    aythor: {                //视频作者
        type: ObjectId,      //值是User的ID
        ref: 'User'
    },
    qiniu_key: String,      //七牛原始的key
    persistentId: String,    //上传时的任务id
    qiniu_final_key: String, //七牛转码之后生成新的key
    qiniu_detail: Mixed,    //存储视频的其他信息，如宽高等，可能是对象，可能是数组，用混合类型

    public_id : String,        //cloudinary,也就是和qiniu_key一样的
    detail:Mixed,               //cloudinary,和上面qiniu_detail一样的

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
CreationSchema.pre('save', function (next) {
    if (this.isNew) { //数据是否新加的。
        this.meta.createAt = this.meta.updateAt = Date.now() //添加的时间，和修改时间，都改成当前时间
    } else {  //数据已经存在，就说明是修改更新数据，那么就只更新修改时间
        this.meta.updateAt = Date.now()
    }
    //执行该方法后，存储过程才会走下去。
    next();
})

CreationSchema.statics = {
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


module.exports = CreationSchema