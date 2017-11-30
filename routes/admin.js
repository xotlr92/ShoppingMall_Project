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
//제품 상세 페이지 작성
router.get('/products/detail/:id', function(req,res){
   ProductsModel.findOne({id:req.params.id}, function(err, product){
       res.render('admin/productsDetail', {product:product});
   });
});
//제품 수정 페이지 작성
router.get('/products/edit/:id', function(req,res){
    ProductsModel.findOne({id:req.params.id}, function(err, product){
        res.render('admin/form', {product:product});
    });
});
router.post('/products/edit/:id', function(req,res){
    var query = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    }
    ProductsModel.update({id:req.params.id}, {$set:query}, function(err){
        res.redirect('/admin/products/detail/'+req.params.id);
    });
});

module.exports = router;