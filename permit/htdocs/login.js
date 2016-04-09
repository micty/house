


KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

 
    var MD5 = KISP.require('MD5');

    

    var LocalStorage = require('LocalStorage');
    var SessionStorage = require('SessionStorage');



    function login() {

        SessionStorage.remove('user');

        var name = $('#txt-name').val();
        var password = $('#txt-password').val();

        if (!name) {
            KISP.alert('请输入用户名');
            return;
        }

        if (!password) {
            KISP.alert('请输入密码');
            return;
        }


        post({
            'name': name,
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

        var api = KISP.create('API', 'Login.login');

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

                SessionStorage.set('user', data);
                LocalStorage.set('user', data);


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
            'name': data.name,
            'password': password,
        });

    }


    var user = LocalStorage.get('user');
    //debugger;
    var txtName = document.getElementById('txt-name');
    var txtPassword = document.getElementById('txt-password');

    if (user) {
        txtName.value = user.name;
        txtPassword.focus();
    }
    else {
        txtUser.focus();
    }



});


