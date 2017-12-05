var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var secretInfo = require('../lib/secretInfo');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: secretInfo.$clientID,
    clientSecret: secretInfo.$clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    UserModel.findOne({username:"fb_"+profile.id}, function(err, user){
        if(!user){
            var regData = {
                username : "fb_"+profile.id,
                password : "facebook_login",
                displayName : profile.displayName
            };
            var user = new UserModel(regData);
            user.save(function(err){
                done(null, regData);
            });
        } else {
            done(null, user);
        }
    });
  }
));

router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect: '/',
        failureRedirect: '/auth/facebook/fail' 
    })
);

router.get('/facebook/success', function(req,res){
    res.send(req.user);
});
router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});

module.exports = router;