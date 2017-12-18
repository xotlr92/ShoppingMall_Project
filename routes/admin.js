var express = require('express');
var router = express.Router();
// model 모듈 불러오기
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
var CheckoutModel = require('../models/CheckoutModel');
//csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({cookie:true});//csrf 미들웨어 설정
//미들웨어 설정시 req.csrfToken()사용가능.
var path = require('path');
var uploadDir = path.join(__dirname, '../uploads'); //uploads 폴더 경로
var fs = require('fs');
//multer 셋팅
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, uploadDir);
    },
    filename : function(req, file, cb){
        cb(null, 'product-'+Date.now()+'.'+file.mimetype.split('/')[1]);
    }
})
var upload = multer({storage:storage}); //미들웨어 설정
// 미들웨어 설정시 req.file 사용가능
var adminRequired = require('../lib/adminRequired');

router.get('/', function(req,res){
    res.send('admin app');
});
router.get('/products', function(req,res){
    ProductsModel.find(function(err, products){
        res.render('admin/products', {products:products});
    });
});
// 제품 등록 페이지 작성
router.get('/products/write', adminRequired, csrfProtection, function(req,res){
    res.render('admin/form', {product:"", csrfToken:req.csrfToken()});
});
router.post('/products/write', adminRequired, upload.single('thumbnail'), csrfProtection, function(req,res){
    var product = new ProductsModel({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "",
        price : req.body.price,
        description : req.body.description,
        username : req.user.username
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
    var getData = async () => ({
        product : await ProductsModel.findOne({id:req.params.id}).exec(),
        comments : await CommentsModel.find({product_id:req.params.id}).exec()
    });
    getData().then(function(result){
        res.render('admin/productsDetail', {product:result.product, comments:result.comments});
    });
});
//제품 수정 라우터 작성
router.get('/products/edit/:id', adminRequired, csrfProtection, function(req,res){
    ProductsModel.findOne({id:req.params.id}, function(err, product){
        res.render('admin/form', {product:product, csrfToken:req.csrfToken()});
    });
});
router.post('/products/edit/:id', adminRequired, upload.single('thumbnail'), csrfProtection, function(req,res){
    ProductsModel.findOne({id:req.params.id}, function(err, product){
        if(req.file){
            fs.unlinkSync(uploadDir + '/' + product.thumbnail);
            // req.file이 있다면 기존의 파일을 지운다.
        }
        var query = {
            name : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            // req.file이 없다면 기존의 파일 그대로 사용
            price : req.body.price,
            description : req.body.description
        }
        ProductsModel.update({id:req.params.id}, {$set:query}, function(err){
            res.redirect('/admin/products/detail/'+req.params.id);
        });
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

router.post('/products/ajax_summernote', adminRequired, upload.single('thumbnail'), function(req,res){
    res.send('/uploads/'+req.file.filename);
});

router.get('/order', adminRequired, function(req,res){
    CheckoutModel.find(function(err, orderList){
        res.render('admin/orderList', {orderList:orderList});
    });
});

router.get('/order/edit/:id', adminRequired, function(req,res){
    CheckoutModel.findOne({id:req.params.id}, function(err, order){
        res.render('admin/orderForm', {order:order});
    });
});

router.post('/order/edit/:id', adminRequired, function(req,res){
    var query = {
        status : req.body.status,
        song_jang : req.body.song_jang
    };
    CheckoutModel.update({id:req.params.id}, {$set:query}, function(err){
        res.redirect('/admin/order');
    });
});

router.get('/statistics', adminRequired, function(req,res){
    CheckoutModel.find(function(err, orderList){
        var barData = [];
        var pieData = [];
        orderList.forEach(function(order){
            var date = new Date(order.created_at);
            var monthDay = (date.getMonth()+1) + '-' + date.getDate();

            if(monthDay in barData){
                barData[monthDay]++;
            } else {
                barData[monthDay] = 1;
            }

            if(order.status in pieData){
                pieData[order.status]++;
            } else {
                pieData[order.status] = 1;
            }
        });
        res.render('admin/statistics', {barData:barData, pieData:pieData});
    });
});

module.exports = router;