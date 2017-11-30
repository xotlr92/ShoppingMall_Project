var express = require('express');
var path = require('path');

// mongoose 설정
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('connected mongodb');
});
var connect = mongoose.connect('mongodb://127.0.0.1:27017/shop', { useMongoClient: true });
autoIncrement.initialize(connect);

// 라우트 불러오기
var admin = require('./routes/admin');

var app = express();
var port = 3000;

// 확장자가 ejs로 끝나는 view engine 추가
// path.join : 현재 디렉토리 위치 + views 경로
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 라우팅
app.use('/admin', admin);

app.get('/', function(req,res){
    res.send('first app');
});

app.listen(port, function(){
    console.log('connected', port);
});