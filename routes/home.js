var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');

router.get('/', function(req,res){
    ProductsModel.find(function(err, products){
        res.render('home', {products:products});
    });
});

module.exports = router;