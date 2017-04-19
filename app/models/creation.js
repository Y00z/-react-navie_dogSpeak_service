/**
 * Created by Yooz on 2016/11/24.
 */
//模型
var mongoose = require("mongoose");
var CreationSchema = require("../schemas/creation");
var Creation = mongoose.model('Creation',CreationSchema);


module.exports = Creation