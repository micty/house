
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


var fs = require('fs');


app.post('/Paper/Add', function (req, res) {

    res.set({
        'Access-Control-Allow-Origin': '*',
    });


    var Paper = require('./modules/Paper');
    Paper.add(req, res);


});



