


KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var MD5 = KISP.require('MD5');
    var User = require('User');

   


    function login() {

        var number = $('#txt-number').val();
        var password = $('#txt-password').val();

        if (!number) {
            KISP.alert('请输入用户名');
            return;
        }

        if (!password) {
            KISP.alert('请输入密码');
            return;
        }


        post({
            'number': number,
            'password': password,
        });
    }

    $('#btn-login').on('click', function () {
        login();
    });


    $(document).on('keyup', function (event) {
        if (event.keyCode == 13) { //回车键
            login();
        }

    });




    function post(data) {

        var api = KISP.create('API', 'User/login');

        var loading = null;

        api.on({

            'request': function () {
                loading = KISP.create('Loading');
                loading.show('登录中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                User.set(data);

                var toast = KISP.create('Toast', {
                    text: '登录成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                setTimeout(function () {

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
            'number': data.number,
            'password': password,
        });

    }


    var user = User.get(true);

    var txtNumber = document.getElementById('txt-number');
    var txtPassword = document.getElementById('txt-password');

    if (user) {
        txtNumber.value = user.number;
        txtPassword.focus();
    }
    else {
        txtNumber.focus();
    }



});


