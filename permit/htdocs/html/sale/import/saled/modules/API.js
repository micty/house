

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');
    var Logs = require('Logs');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;

    var LINE = '___________________________________________________________' +
        '__________________________________________________________';




    function post(list) {

        var api = new API('Saled.import');

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('提交中...');
            },
            'response': function () {
                loading.hide();
            },

            'fail': function (code, msg, json, xhr) {

            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('提交数据错误: 网络繁忙，请稍候再试');
            },
        });


        api.on('done', function (code, msg, json) {

            //由于状态码不同时，参数形式不同，这里用查找的方式。
            var data = json.data;
            if (!data) {
                KISP.alert('提交数据失败: {0} ', msg);
                return;
            }

            var msgs = [msg];

            debugger;

            Logs.render(msgs, function () {
                emitter.fire('success', []);
            });

        });

        debugger;
        //api.post(list);


    }



    return {
        'post': post,
        'on': emitter.on.bind(emitter),
    };


});