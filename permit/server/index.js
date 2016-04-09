
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(bodyParser.json({
    limit: '50mb',
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));


var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});


function allow(res) {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });
}
    


app.all('/*', function (req, res, next) {
    allow(res);
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