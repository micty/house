

var $ = require('./lib/MiniQuery');
var Router = require('./lib/Router');
var Session = require('./lib/Session');

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var compression = require('compression');

var app = express();

app.use(bodyParser.json({
    limit: '50mb',
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));

app.use(cookieParser());
app.use(compression());     //使用 gzip 压缩。


//在政府的某些机子里，3001、3030端口会给屏蔽了。 经过测试 8080 是可以的。
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});


app.use(function (req, res, next) {

    res.set({
        'Access-Control-Allow-Origin': '*',
    });

    //if (!req.url.startsWith('/User/login?')) {
    //    var valid = Session.check(req, res);
    //    if (!valid) {
    //        return;
    //    }
    //}

    next();
});




//用户模块
Router.use(app, {
    module: require('./modules/User'),
    base: '/User.',
    get: [
        'get',
        'remove',
        'list',
    ],
    post: [
        'add',
        'update',
        'login',
    ],
});

//土地出让模块
Router.use(app, {
    module: require('./modules/Land'),
    base: '/Land.',
    get: [
        'get',
        'remove',
    ],
    post: [
        'add',
        'update',
        'page',
    ],
});

//规划模块
Router.use(app, {
    module: require('./modules/Plan'),
    base: '/Plan.',
    get: [
        'get',
        'remove',
    ],
    post: [
        'add',
        'update',
        'page',
        'todos',
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

//建设模块
Router.use(app, {
    module: require('./modules/Construct'),
    base: '/Construct.',
    get: [
        'get',
        'remove',
    ],
    post: [
        'add',
        'update',
        'page',
        'todos',
    ],
});

//预售模块
Router.use(app, {
    module: require('./modules/Sale'),
    base: '/Sale.',
    get: [
        'get',
        'remove',
    ],
    post: [
        'add',
        'update',
        'page',
        'todos',
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





