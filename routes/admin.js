var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.send('admin app');
});
router.get('/products', function(req,res){
    res.render('admin/products', {message:"hello"});
});

module.exports = router;