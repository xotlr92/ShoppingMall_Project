var express = require('express');
var router = express.Router();
var CheckoutModel = require('../models/CheckoutModel');
var request = require('request');
var cheerio = require('cheerio');
var removeEmpty = require('../lib/removeEmpty');

router.get('/', function(req,res){
    var totalAmount = 0;
    var cartList = {};
    if(typeof(req.cookies.cartList)!=='undefined'){
        var cartList = JSON.parse(unescape(req.cookies.cartList));
        for(let key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('checkout/index', {cartList:cartList, totalAmount:totalAmount});
});

router.post('/complete', (req,res)=> {
    var checkout = new CheckoutModel({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
     
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status
    });
    checkout.save(function(err){
        res.json({message:"success"});
    });
});

router.post('/mobile_complete', (req,res)=> {
    var checkout = new CheckoutModel({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
     
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status
    });
    checkout.save(function(err){
        res.json({message:"success"});
    });
});

router.get('/success', function(req,res){
    res.render('checkout/success');
});

router.get('/nomember', function(req,res){
    res.render('checkout/nomember');
});

router.get('/nomember/search', function(req,res){
    CheckoutModel.find({buyer_email : req.query.email}, function(err, checkoutList){
        res.render('checkout/search', {checkoutList:checkoutList});
    });
});

router.get('/shipping/:invc_no', (req,res)=>{
    var url = "https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no="+req.params.invc_no;
    var result = [];
    request(url, (error,response,body)=>{
        var $ = cheerio.load(body, {decodeEntities:false});
        var tdElements = $(".board_area").find("table.mb15 tbody tr td");
        
        for(var i=0; i<tdElements.length; i++){
            if(i%4===0){
                var temp = {};
                temp["step"] = removeEmpty(tdElements[i].children[0].data);
            } else if(i%4===1){
                temp["date"] = tdElements[i].children[0].data;
            } else if(i%4===2){
                temp["status"] = tdElements[i].children[0].data;
                if(tdElements[i].children.length>1){
                    temp["status"] += tdElements[i].children[2].data;
                }
            } else if(i%4===3){
                temp["location"] = tdElements[i].children[1].children[0].data;
                result.push(temp);
                temp = {};
            }
        }
        res.render('checkout/shipping', {result:result});
    });
});

module.exports = router;