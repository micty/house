﻿
var express = require('express');
var app = express();


app.get('/', function (req, res) {
    res.send('Hello World!');
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server listening at http://localhost:%s/', port);
});


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false,
}));



//app.use('/admin', express.static('../../admin/htdocs'));
//app.use(express.static('../../demo/htdocs'));


function allow(res) {
    res.set({
        'Access-Control-Allow-Origin': '*',
    });
}
    

//文章模块
var Paper = require('./modules/Paper');

app.post('/Paper.add', function (req, res) {
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
    Paper.remove(req.query.id, res);

});

app.get('/Signup.list', function (req, res) {

    allow(res);
    Signup.list(res);

});



//焦点图片模块
var EventsPhoto = require('./modules/EventsPhoto');
app.get('/EventsPhoto.list', function (req, res) {

    allow(res);
    EventsPhoto.list(res);

});

