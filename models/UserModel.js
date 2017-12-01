var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new Schema({
    username : {
        type : String,
        required : [true, '아이디는 필수입니다.']
    },
    password : {
        type : String,
        required : [true, '비밀번호는 필수입니다.']
    },
    displayName : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

UserSchema.plugin(autoIncrement.plugin, {
    model:"user", field:"id", startAt:1
});

module.exports = mongoose.model("user", UserSchema);