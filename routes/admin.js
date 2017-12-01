var express = require('express');
var router = express.Router();
// model 모듈 불러오기
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
//csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({cookie:true});//csrf 미들웨어 설정
//미들웨어 설정시 req.csrfToken()사용가능.

router.get('/', function(req,res){
    res.send('admin app');
});
router.get('/products', function(req,res){
    ProductsModel.find(function(err, products){
        res.render('admin/products', {products:products});
    });
});
// 제품 등록 페이지 작성
router.get('/products/write', csrfProtection, function(req,res){
    res.render('admin/form', {product:"", csrfToken:req.csrfToken()});
});
router.post('/products/write', csrfProtection, function(req,res){
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    });
    var validationError = product.validateSync();
    if(validationError){
        res.send(validationError);
    } else {
        product.save(function(err){
            res.redirect('/admin/products'); // 성공시 redirect
        });
    }
});
//제품 상세 라우터 작성
router.get('/products/detail/:id', function(req,res){
    ProductsModel.findOne({id:req.params.id}, function(err, product){
        CommentsModel.find({product_id:req.params.id}, function(err, comments){
            res.render('admin/productsDetail', {product:product, comments:comments});
        });
    });
});
//제품 수정 라우터 작성
router.get('/products/edit/:id', csrfProtection, function(req,res){
    ProductsModel.findOne({id:req.params.id}, function(err, product){
        res.render('admin/form', {product:product, csrfToken:req.csrfToken()});
    });
});
router.post('/products/edit/:id', csrfProtection, function(req,res){
    var query = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    }
    ProductsModel.update({id:req.params.id}, {$set:query}, function(err){
        res.redirect('/admin/products/detail/'+req.params.id);
    });
});
//제품 삭제 라우터 작성
router.get('/products/delete/:id', function(req,res){
    ProductsModel.remove({id:req.params.id}, function(err){
        res.redirect('/admin/products');
    });
});
//댓글 입력 라우터 작성
router.post('/products/ajax_comment/insert', function(req,res){
    var comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    comment.save(function(err, comment){
        res.json({
            comment_id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});
router.post('/products/ajax_comment/delete', function(req,res){
    CommentsModel.remove({id:req.body.comment_id}, function(err){
        res.json({message:"success"});
    });
});

module.exports = router;