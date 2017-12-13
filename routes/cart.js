var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    var totalAmount = 0;
    var cartList = {};

    if(typeof(req.cookies.cartList) !== 'undefined'){
        var cartList = JSON.parse(unescape(req.cookies.cartList));

        for(var key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('cart/index', {cartList:cartList, totalAmount:totalAmount});
});

module.exports = router;