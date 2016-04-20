
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json({
    limit: '50mb',
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));

app.all('/*', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });

    next();
});



var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});




//文章模块
var Paper = require('./modules/Paper');

app.post('/Paper.add',function (req, res) {
    Paper.add(req.body, res);
});

app.post('/Paper.update', function (req, res) {
    Paper.update(req.body, res);
});

app.get('/Paper.get', function (req, res) {
    var query = req.query;
    Paper.get(query.type, query.id, res);
});

app.get('/Paper.remove', function (req, res) {
    var query = req.query;
    Paper.remove(query.type, query.id, res);
});

app.get('/Paper.list', function (req, res) {
    var query = req.query;
    Paper.list(query.type, res);
});


//报名模块
var Signup = require('./modules/Signup');

app.post('/Signup.add', function (req, res) {
    Signup.add(req.body, res);
});

app.get('/Signup.remove', function (req, res) {
    Signup.remove(req.query.id, res);
});

app.get('/Signup.list', function (req, res) {
    Signup.list(res);
});



//活动报名模块
var ActivitySignup = require('./modules/ActivitySignup');

app.post('/ActivitySignup.add', function (req, res) {
    ActivitySignup.add(req.body, res);
});

app.get('/ActivitySignup.remove', function (req, res) {
    ActivitySignup.remove(req.query.id, res);
});

app.get('/ActivitySignup.list', function (req, res) {
    ActivitySignup.list(res);
});


//活动奖品模块
var ActivityPrize = require('./modules/ActivityPrize');

app.post('/ActivityPrize.add', function (req, res) {
    ActivityPrize.add(req.body, res);
});

app.get('/ActivityPrize.list', function (req, res) {
    ActivityPrize.list(res);
});

app.get('/ActivityPrize.get', function (req, res) {
    ActivityPrize.get(req.query.phone, res);
});



//焦点图片模块
var EventsPhoto = require('./modules/EventsPhoto');
app.get('/EventsPhoto.list', function (req, res) {
    EventsPhoto.list(res);
});



//焦点资讯模块
var EventsNews = require('./modules/EventsNews');
app.get('/EventsNews.list', function (req, res) {
    EventsNews.list(res);
});

app.post('/EventsNews.add', function (req, res) {
    EventsNews.add(req.body, res);
});


app.post('/EventsNews.update', function (req, res) {
    EventsNews.update(req.body, res);
});


app.get('/EventsNews.remove', function (req, res) {
    EventsNews.remove(req.query.id, res);
});




//焦点图片模块
var EventsPhoto = require('./modules/EventsPhoto');
app.get('/EventsPhoto.list', function (req, res) {
    EventsPhoto.list(res);
});

app.post('/EventsPhoto.add', function (req, res) {
    EventsPhoto.add(req.body, res);
});


app.post('/EventsPhoto.update', function (req, res) {
    EventsPhoto.update(req.body, res);
});


app.get('/EventsPhoto.remove', function (req, res) {
    EventsPhoto.remove(req.query.id, res);
});


//楼盘推荐模块
var Recommend = require('./modules/Recommend');
app.get('/Recommend.list', function (req, res) {
    Recommend.list(res);
});

app.post('/Recommend.add', function (req, res) {
    Recommend.add(req.body, res);
});

app.post('/Recommend.update', function (req, res) {
    Recommend.update(req.body, res);
});


app.get('/Recommend.remove', function (req, res) {
    Recommend.remove(req.query.id, res);
});


//活动楼盘推荐模块
var ActivityRecommend = require('./modules/ActivityRecommend');
app.get('/ActivityRecommend.list', function (req, res) {
    ActivityRecommend.list(res);
});

app.post('/ActivityRecommend.add', function (req, res) {
    ActivityRecommend.add(req.body, res);
});

app.post('/ActivityRecommend.update', function (req, res) {
    
    ActivityRecommend.update(req.body, res);
});


app.get('/ActivityRecommend.remove', function (req, res) {
    ActivityRecommend.remove(req.query.id, res);
});



//楼盘模块
var House2 = require('./modules/House2');
app.get('/House2.list', function (req, res) {
    House2.list(res);
});

app.get('/House2.get', function (req, res) {
    House2.get(res, req.query.id);
});

app.post('/House2.add', function (req, res) {
    House2.add(res, req.body);
});

app.post('/House2.update', function (req, res) {
    House2.update(res, req.body);
});

app.get('/House2.remove', function (req, res) {
    House2.remove(res, req.query.id);
});


//楼盘分类模块
var HouseCatalog = require('./modules/HouseCatalog');
app.get('/HouseCatalog.list', function (req, res) {
    HouseCatalog.list(res);
});




//登录
app.post('/login', function (req, res) {
    var data = req.body;
    if (data.user == 'administrator' &&
        data.password == 'f679caa51cd04655e6574cbb4aa47f42') {

        res.send({
            code: 200,
            msg: 'ok',
            data: {
                name: 'administrator',
                messageCount: 0,
            },
        });
    }
    else {
        res.send({
            code: 201,
            msg: '用户名或密码错误',
        });
    }

});