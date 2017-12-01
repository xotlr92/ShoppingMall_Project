var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ProductsSchema = new Schema({
    name : {
        type : String,
        required : [true, '제목은 입력해 주세요.']
        // 비어있는 필드인지 required 로 체크
    },
    price : Number,
    description : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

ProductsSchema.virtual('getDate').get(function(){
    //가상 변수를 만들어준다. mongoose 내장 메서드 virtual
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    }
    //getDate.year과 같이 사용가능.
});
ProductsSchema.plugin(autoIncrement.plugin, {
    model:'products', field:'id', startAt:1
});

module.exports = mongoose.model('products', ProductsSchema);