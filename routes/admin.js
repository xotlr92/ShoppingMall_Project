var express = require('express');
var router = express.Router();
// model 모듈 불러오기
var ProductsModel = require('../models/ProductsModel');

router.get('/', function(req,res){
    res.send('admin app');
});
router.get('/products', function(req,res){
    ProductsModel.find(function(err, products){
        res.render('admin/products', {products:products});
    });
});
// 제품 등록 페이지 작성
router.get('/products/write', function(req,res){
    res.render('admin/form');
});
router.post('/products/write', function(req,res){
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    });
    product.save(function(err){
        res.redirect('/admin/products'); // 성공시 redirect
    });
});

module.exports = router;