var express = require('express');

var admin = require('./routes/admin');

var app = express();
var port = 3000;

app.use('/admin', admin);

app.get('/', function(req,res){
    res.send('first app');
});

app.listen(port, function(){
    console.log('connected', port);
});