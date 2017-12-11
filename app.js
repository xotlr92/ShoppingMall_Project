var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // form에서 넘어온 데이터를 javascript 객체로 맵핑
var logger = require('morgan'); // post, get 요청시 console에 로깅
var cookieParser = require('cookie-parser');
//flash 설정
var flash = require('connect-flash');
//passport 설정
var passport = require('passport');
//session 사용하여 login
var session = require('express-session');

// mongoose 설정
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('connected mongodb');
});
var connect = mongoose.connect('mongodb://127.0.0.1:27017/shop', { useMongoClient: true });
autoIncrement.initialize(connect);

// 라우트 불러오기
var admin = require('./routes/admin');
var accounts = require('./routes/accounts');
var auth = require('./routes/auth');
var home = require('./routes/home');
var chat = require('./routes/chat');

var app = express();
var port = 3000;

// 확장자가 ejs로 끝나는 view engine 추가
// path.join : 현재 디렉토리 위치 + views 경로
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 설정 - 항상 라우팅 전에
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//upload path
app.use('/uploads', express.static('uploads'));

//session 관련 설정
//session을 저장하기위해 connect-mongo 사용
var MongoStore = require('connect-mongo')(session);
var sessionMiddleWare = session({ //socket에서 미들웨어로 사용하기위해 sessionMiddleWare로 따로뺌
    secret : 'shoppingMall',
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 2000*60*60 // 지속시간 2시간 설정
    },
    store : new MongoStore({
        mongooseConnection : mongoose.connection,
        ttl: 14*24*60*60    // 만료기간 설정
    })
});
app.use(sessionMiddleWare);


app.use(session({
    secret : 'shoppingMall',
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 2000*60*60 // 지속시간 2시간 설정
    }
}));

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//flash message 미들웨어
app.use(flash());

app.use(function(req,res,next){
    app.locals.isLogin = req.isAuthenticated();
    // locals : view에서만 전역변수로 isLogin을 셋팅
    next();
});

// 라우팅
app.use('/admin', admin);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/', home);
app.use('/chat', chat);

var server = app.listen(port, function(){
    console.log('connected', port);
});
var io = require('socket.io')(server);
io.use(function(socket, next){
    sessionMiddleWare(socket.request, socket.request.res, next);
    // socket에서 session에 접근할 수 있음.
});
require('./lib/socketConnection')(io);