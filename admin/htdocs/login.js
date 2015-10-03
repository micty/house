


KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var SessionStorage = MiniQuery.require('SessionStorage');
    var MD5 = KISP.require('MD5');

    var loading = null;
    var toast = null;


    $('#btn-login').on('click', function () {

        SessionStorage.remove('user');

        var user = $('#txt-user').val();
        var password = $('#txt-password').val();

        if (!user) {
            KISP.alert('请输入用户名');
            return;
        }

        if (!password) {
            KISP.alert('请输入密码');
            return;
        }


        post({
            'user': user,
            'password': password,
        });

    });




    function post(data) {

        loading = loading || KISP.create('Loading');
        loading.show('登录中...');


        var api = KISP.create('API', 'login');

        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
                    text: '登录成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                setTimeout(function () {
                    
                    SessionStorage.set('user', data);
                    location.href = 'index.html';

                }, 1500);

            },


            'fail': function (code, msg, json) {
                KISP.alert('登录失败: {0}({1})', msg, code);
            },

            'error': function () {
                KISP.alert('登录错误: 网络繁忙，请稍候再试');
            },
        });


        var password = MD5.encrypt(data.password);

        api.post({
            'user': data.user, 
            'password': password,
        });

    }

});


