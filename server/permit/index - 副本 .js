

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

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});



//var sid$data = {};

app.all('/*', function (req, res, next) {

    res.set({
        'Access-Control-Allow-Origin': '*',
    });

    next();
});




//登录模块
var Login = require('./modules/Login');
app.post('/Login.login', function (req, res) {
    Login.login(res, req.body);
});


//土地出让模块
var Land = require('./modules/Land');
app.get('/Land.get', function (req, res) {
    Land.get(res, req.query.id);
});
app.post('/Land.add', function (req, res) {
    Land.add(res, req.body);
});
app.post('/Land.update', function (req, res) {
    Land.update(res, req.body);
});
app.get('/Land.remove', function (req, res) {
    Land.remove(res, req.query.id);
});
app.get('/Land.list', function (req, res) {
    Land.list(res);
});

//规划许可模块
var Plan = require('./modules/Plan');
app.get('/Plan.get', function (req, res) {
    Plan.get(res, req.query.id);
});
app.post('/Plan.add', function (req, res) {
    Plan.add(res, req.body);
});
app.post('/Plan.update', function (req, res) {
    Plan.update(res, req.body);
});
app.get('/Plan.remove', function (req, res) {
    Plan.remove(res, req.query.id);
});
app.get('/Plan.list', function (req, res) {
    Plan.list(res);
});
app.get('/Plan.all', function (req, res) {
    Plan.all(res);
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
