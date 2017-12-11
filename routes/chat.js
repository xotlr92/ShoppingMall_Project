var express = require('express');
var router = express.Router();
var loginRequired = require('../lib/loginRequired');

router.get('/', loginRequired, function(req,res){
    res.render('chat/index');
});

module.exports = router;