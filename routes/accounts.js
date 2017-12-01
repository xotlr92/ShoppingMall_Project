var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var transPassword = require('../lib/transPassword');

router.get('/join', function(req,res){
    res.render('accounts/join');
});
router.post('/join', function(req,res){
    var user = new UserModel({
        username : req.body.username,
        password : transPassword(req.body.password),
        displayName : req.body.displayName
    });
    user.save(function(err){
        res.send('<script>alert("회원가입 성공"); location.href="/accounts/login";</script>')
    });
});
router.get('/login', function(req,res){
    res.render('accounts/login');
});

module.exports = router;