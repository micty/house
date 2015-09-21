
/**
* 登录模块。
* @namespace
* @author micty
*/
define('Login', function (require, exports, module) {

    var $ = require('$');
    var API = require('API');
    var MD5 = require('MD5');
    var Dialog = require('Dialog');
    var Tips = require('Tips');
    var Samples = require('Samples');

    var key = 'KERP.Login.user.F5F2BA55218E';
    var sample = Samples.get('Login');


    //默认配置
    var defaults = {};

    /**
    * 检查是否已经登录。
    */
    function check(jump) {

        var user = get();
        var valid = !!(user && user.userID);

        if (!valid && jump) {

            var url = top.location.href;

            var files = defaults.files;

            var master = '/' + files.master;
            var login = '/' + files.login;

            if (top === window && url.indexOf(master) < 0) { //直接打开的是 iframe
                var a = url.split('/html/');
                url = a[0] + login;
            }
            else { //master 页面或嵌套在 master 页面中的 iframe
                url = url.replace(master, login);

            }

            top.location.href = url;
        }

        return valid;

    }





    /**
    * 显示登录提示对话框。
    */
    function show() {

        Dialog.use(function (Dialog) {

            var txtUser;
            var txtPassword;

            var user = get();

            function submit(dialog) {

                var btn = dialog.find('[data-id="ok"]');
                var html = btn.html();

                btn.html('登录中...').attr('disabled', true);

                var span = dialog.find('[data-field="msg"]').hide();

                login({
                    'user': txtUser.value,
                    'password': txtPassword.value

                }, function (data, json) {

                    
                    Tips.success('登录成功', 2000);
                    dialog.close();

                }, function (code, msg, json) {
                    span.html(msg).show();
                    btn.html(html).attr('disabled', false);
                    txtPassword.value = '';
                    txtPassword.focus();

                }, function () {
                    span.html('网络繁忙，登录失败，请稍候再试!').show();
                    btn.html(html).attr('disabled', false);
                    txtPassword.value = '';
                    txtPassword.focus();
                });
            }

            var dialog = new Dialog({

                width: 240,
                height: 100,
                skin: 'login-box',
                title: '重新登录',
                content: $.String.format(sample, {
                    user: user ? user['number'] || '' : ''
                }),

                okValue: '立即登录',

                ok: function () {
                    submit(this);
                    return false;
                },

                onshow: function () {

                    var self = this;

                    txtUser = this.find('[data-field="user"]').get(0);
                    txtPassword = this.find('[data-field="password"]').get(0);

                    $(txtUser).on('keydown', function (event) {
                        if (event.keyCode == 13) {
                            submit(self);
                        }
                    });

                    $(txtPassword).on('keydown', function (event) {
                        if (event.keyCode == 13) {
                            submit(self);
                        }
                    });
                },

                onfocus: function () {
                    setTimeout(function () {
                        if (user) {
                            txtPassword.focus();
                        }
                        else {
                            txtUser.focus();
                        }
                    }, 100);
                }
            });

            dialog.showModal();

        });
    }


    /**
    * 获取当前已登录的用户信息。
    * 如果不存在，则返回 null。
    */
    function get() {
        var user = $.SessionStorage.get(key);
        return user || null;
    }

    /**
    * 获取最近曾经登录过的用户信息。
    * 如果不存在，则返回 null。
    */
    function getLast() {
        var user = $.LocalStorage.get(key);
        return user || null;
    }


    /**
    * 调用登录接口进行登录。
    */
    function login(data, fnSuccess, fnFail, fnError) {

        var api = new API(defaults.api);

        api.get({
            'action': defaults.actions['login'],
            'user': data.user,
            'pwd': MD5.encrypt(data.password),
        });

        api.on('success', function (data, json) { //成功

            var user = $.Object.extend({}, data, {

                messageCount: data.messageCount || 0,
                companyList: [
                    //{ name: '蓝海机电有限公司' },
                    //{ name: '蓝海机电有限公司演示账套' },
                    //{ name: '金蝶国际有限公司' },
                    //{ name: 'KIS 移动应用产品' }
                ]
            });

            $.SessionStorage.set(key, user); //把用户信息存起来，以便跨页使用
            $.LocalStorage.set(key, user);

            fnSuccess && fnSuccess(user, data, json);


        });

        api.on({
            'fail': fnFail,
            'error': fnError,
        });

    }


    /**
    * 调用注销接口进行注销。
    */
    function logout(fnSuccess, fnFail, fnError) {

        var api = new API(defaults.api);

        api.on({
            'fail': fnFail,
            'error': fnError,
        });

        api.get({
            action: defaults.actions['logout']
        });

        api.on('success', function (data, json) { //成功

            $.SessionStorage.remove(key); //只移除会话级的

            var user = get();
            fnSuccess && fnSuccess(user, data, json);

        });
    }



    return {
        check: check,
        get: get,
        getLast: getLast,
        show: show,
        login: login,
        logout: logout,
        config: function (obj) {
            $.Object.extend(defaults, obj);
        },
    };


});

