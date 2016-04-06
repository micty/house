
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
    


app.get('/', function (req, res) {
 
});



//登录
app.post('/login', function (req, res) {


    var name$user = {
        'admin1': {
            text: '国土局管理员',
            level: 1,
            password: '47bce5c74f589f4867dbd57e9ca9f808', //aaa
        },
        'admin2': {
            text: '规划局管理员',
            level: 2,
            password: '08f8e0260c64418510cefb2b06eee5cd', //bbb
        },
    };

    allow(res);

    var data = req.body;
    var name = data.user;
    var password = data.password;


    var user = name$user[name];
    if (user && user.password == password) {
        res.send({
            code: 200,
            msg: 'ok',
            data: {
                'name': name,
                'text': user.text,
                'level': user.level,
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