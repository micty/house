/**
*
*/
define('/Login', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var CloudHome = KISP.require('CloudHome');


    var Emitter = MiniQuery.require('Emitter');//事件驱动器
    var emitter = new Emitter();



    function render() {

        var Loading = require(module, 'Loading');
        var UserInfo = require(module, 'UserInfo');


        Loading.show();


        UserInfo.get(function (data) {

            UserInfo.set(data, true);

            var obj = {
                'eid': data.eid,
                'openid': data.openId, // i 为大写
            };

            //获取完成，设置配置数据
            KISP.config('SSH.API', obj);


            var api = KISP.create('SSH.API', data.isVisitor ? 'GetUserInfo3' : 'GetUserInfo2');
           


            api.on('done', function () {
                Loading.hide(); 
                emitter.fire('done', [obj]);
            });


            api.on('success', function (data, json, xhr) {
                if (!data || !data.id) {
                    KISP.alert('获取用户信息失败', function () {
                        CloudHome.close();
                    });

                    return;
                }

                UserInfo.set(data, false);

                // 遮盖多次的页面切换过程
                KISP.create('Mask', {
                    duration: 500,
                    background: '#fff',
                    bottom: 0,
                    top: 0,
                    'z-index': 1021,
                    opacity: 1,
                }).show();

                emitter.fire('done', [obj]);
            });

            api.on('fail', function (code, msg, json, xhr) {
                if (code != 203) {
                    KISP.alert(msg, function () {
                        CloudHome.close();
                    });
                }
            });


            api.on('code', 203, function (msg, json, xhr) {
                //Dialog.render(data, json);
                KISP.alert(msg, function () {
                    CloudHome.close();
                });
            });


            api.on('error', function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }
               
                KISP.alert(msg, function () {
                    CloudHome.close();
                });

            });
            api.post();

        });
    }



    return {
        render: render,
        on: emitter.on.bind(emitter)
    }

});