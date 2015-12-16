
var express = require('express');
var app = express();


var bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({
//    extended: false,
//}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.get('/', function (req, res) {
    res.send('Hello World!');
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});




//app.use('/admin', express.static('../../admin/htdocs'));
//app.use(express.static('../../demo/htdocs'));


function allow(res) {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });
}
    

//文章模块
var Paper = require('./modules/Paper');

app.post('/Paper.add',function (req, res) {
    allow(res);
    Paper.add(req.body, res);
});

app.post('/Paper.update', function (req, res) {
    allow(res);
    Paper.update(req.body, res);
});


app.get('/Paper.get', function (req, res) {
    allow(res);
    var query = req.query;
    Paper.get(query.type, query.id, res);
});

app.get('/Paper.remove', function (req, res) {
    allow(res);
    var query = req.query;
    Paper.remove(query.type, query.id, res);
});

app.get('/Paper.list', function (req, res) {
    allow(res);
    var query = req.query;
    Paper.list(query.type, res);
});





//报名模块
var Signup = require('./modules/Signup');

app.post('/Signup.add', function (req, res) {
    allow(res);
    Signup.add(req.body, res);
});

app.get('/Signup.remove', function (req, res) {
    allow(res);
    Signup.remove(req.query.id, res);
});

app.get('/Signup.list', function (req, res) {
    allow(res);
    Signup.list(res);
});



//活动报名模块
var ActivitySignup = require('./modules/ActivitySignup');

app.post('/ActivitySignup.add', function (req, res) {
    allow(res);
    ActivitySignup.add(req.body, res);
});


app.get('/ActivitySignup.remove', function (req, res) {
    allow(res);
    ActivitySignup.remove(req.query.id, res);

});

app.get('/ActivitySignup.list', function (req, res) {
    allow(res);
    ActivitySignup.list(res);

});





//焦点图片模块
var EventsPhoto = require('./modules/EventsPhoto');
app.get('/EventsPhoto.list', function (req, res) {
    allow(res);
    EventsPhoto.list(res);

});



//焦点资讯模块
var EventsNews = require('./modules/EventsNews');
app.get('/EventsNews.list', function (req, res) {
    allow(res);
    EventsNews.list(res);
});

app.post('/EventsNews.add', function (req, res) {
    allow(res);
    EventsNews.add(req.body, res);
});


app.post('/EventsNews.update', function (req, res) {
    allow(res);
    EventsNews.update(req.body, res);
});


app.get('/EventsNews.remove', function (req, res) {
    allow(res);
    EventsNews.remove(req.query.id, res);
});




//焦点图片模块
var EventsPhoto = require('./modules/EventsPhoto');
app.get('/EventsPhoto.list', function (req, res) {
    allow(res);
    EventsPhoto.list(res);
});

app.post('/EventsPhoto.add', function (req, res) {
    allow(res);
    EventsPhoto.add(req.body, res);
});


app.post('/EventsPhoto.update', function (req, res) {
    allow(res);
    EventsPhoto.update(req.body, res);
});


app.get('/EventsPhoto.remove', function (req, res) {
    allow(res);
    EventsPhoto.remove(req.query.id, res);
});




//楼盘推荐模块
var Recommend = require('./modules/Recommend');
app.get('/Recommend.list', function (req, res) {
    allow(res);
    Recommend.list(res);
});

app.post('/Recommend.add', function (req, res) {
    allow(res);
    Recommend.add(req.body, res);
});


app.post('/Recommend.update', function (req, res) {
    allow(res);
    Recommend.update(req.body, res);
});


app.get('/Recommend.remove', function (req, res) {
    allow(res);
    Recommend.remove(req.query.id, res);
});



//活动楼盘推荐模块
var ActivityRecommend = require('./modules/ActivityRecommend');
app.get('/ActivityRecommend.list', function (req, res) {
    allow(res);
    ActivityRecommend.list(res);
});

app.post('/ActivityRecommend.add', function (req, res) {
    allow(res);
    ActivityRecommend.add(req.body, res);
});


app.post('/ActivityRecommend.update', function (req, res) {
    allow(res);
    ActivityRecommend.update(req.body, res);
});


app.get('/ActivityRecommend.remove', function (req, res) {
    allow(res);
    ActivityRecommend.remove(req.query.id, res);
});




//登录
app.post('/login', function (req, res) {


    allow(res);

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