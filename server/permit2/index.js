

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
var PlanLicense = require('./modules/PlanLicense');
app.get('/PlanLicense.get', function (req, res) {
    PlanLicense.get(res, req.query.id);
});
app.post('/PlanLicense.add', function (req, res) {
    PlanLicense.add(res, req.body);
});
app.post('/PlanLicense.update', function (req, res) {
    PlanLicense.update(res, req.body);
});
app.get('/PlanLicense.remove', function (req, res) {
    PlanLicense.remove(res, req.query.id);
});
app.get('/PlanLicense.list', function (req, res) {
    PlanLicense.list(res, req.query.planId);
});



//建设许可模块
var Construct = require('./modules/Construct');
app.get('/Construct.get', function (req, res) {
    Construct.get(res, req.query.id);
});
app.post('/Construct.add', function (req, res) {
    Construct.add(res, req.body);
});
app.post('/Construct.update', function (req, res) {
    Construct.update(res, req.body);
});
app.get('/Construct.remove', function (req, res) {
    Construct.remove(res, req.query.id);
});
app.get('/Construct.list', function (req, res) {
    Construct.list(res);
});
app.get('/Construct.all', function (req, res) {
    Construct.all(res);
});





//预售许可模块
var Sale = require('./modules/Sale');
app.get('/Sale.get', function (req, res) {
    Sale.get(res, req.query.id);
});
app.post('/Sale.add', function (req, res) {
    Sale.add(res, req.body);
});
app.post('/Sale.update', function (req, res) {
    Sale.update(res, req.body);
});
app.get('/Sale.remove', function (req, res) {
    Sale.remove(res, req.query.id);
});
app.get('/Sale.list', function (req, res) {
    Sale.list(res);
});
app.get('/Sale.all', function (req, res) {
    Sale.all(res);
});
app.post('/Sale.import', function (req, res) {
    Sale.import(res, req.body);
});


//预售许可证模块
var SaleLicense = require('./modules/SaleLicense');
app.get('/SaleLicense.get', function (req, res) {
    SaleLicense.get(res, req.query.id);
});
app.post('/SaleLicense.add', function (req, res) {
    SaleLicense.add(res, req.body);
});
app.post('/SaleLicense.update', function (req, res) {
    SaleLicense.update(res, req.body);
});
app.get('/SaleLicense.remove', function (req, res) {
    SaleLicense.remove(res, req.query.id);
});
app.get('/SaleLicense.list', function (req, res) {
    SaleLicense.list(res, req.query.saleId);
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