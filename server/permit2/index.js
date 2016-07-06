

var $ = require('./lib/MiniQuery');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json({
    limit: '50mb',
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));

app.use(cookieParser());

//在政府的某些机子里，3001、3030端口会给屏蔽了。 经过测试 8080 是可以的。
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});


app.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });
    next();
});



var Router = require('./lib/Router');

//土地出让模块
Router.use(app, {
    module: require('./modules/Land'),
    base: '/Land.',
    get: [
        'get',
        'remove',
        'list',
    ],
    post: [
        'add',
        'update',
    ],
});


//规划许可模块
Router.use(app, {
    module: require('./modules/Plan'),
    base: '/Plan.',
    get: [
        'get',
        'remove',
        'list',
        'all',
    ],
    post: [
        'add',
        'update',
    ],
});

//规划许可证模块
Router.use(app, {
    module: require('./modules/PlanLicense'),
    base: '/PlanLicense.',
    get: [
        'get',
        'remove',
        'list',
    ],
    post: [
        'add',
        'update',
    ],
});

//建设许可模块
Router.use(app, {
    module: require('./modules/Construct'),
    base: '/Construct.',
    get: [
        'get',
        'remove',
        'list',
        'all',
    ],
    post: [
        'add',
        'update',
    ],
});


//预售许可模块
Router.use(app, {
    module: require('./modules/Sale'),
    base: '/Sale.',
    get: [
        'get',
        'remove',
        'list',
        'all',
    ],
    post: [
        'add',
        'update',
        'import',
    ],
});


//预售许可证模块
Router.use(app, {
    module: require('./modules/SaleLicense'),
    base: '/SaleLicense.',
    get: [
        'get',
        'remove',
        'list',
    ],
    post: [
        'add',
        'update',
    ],
});




//统计模块
var Stat = require('./modules/Stat');
app.get('/Stat.get', function (req, res) {
    Stat.get(res);
});





//用户模块
var User = require('./modules/User');
app.get('/User.get', function (req, res) {
    User.get(res, req.query.id);
});
app.post('/User.add', function (req, res) {
    User.add(res, req.body);
});
app.post('/User.update', function (req, res) {
    User.update(res, req.body);
});
app.get('/User.remove', function (req, res) {
    User.remove(res, req.query.id);
});
app.get('/User.list', function (req, res) {
    User.list(res);
});
app.post('/User.login', function (req, res) {
    User.login(res, req.body);
});