var express = require('express');

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

// 라우팅
app.use('/admin', admin);

app.get('/', function(req,res){
    res.send('first app');
});

app.listen(port, function(){
    console.log('connected', port);
});