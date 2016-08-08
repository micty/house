

define('/Land/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;



    //获取数据
    function get() {

        var api = new API('Land.page');

        api.on({

            //'request': function () {

            //    loading = loading || top.KISP.create('Loading', {
            //        mask: 0,
            //    });

            //    loading.show('加载中...');
            //},

            //'response': function () {
            //    loading.hide();
            //},

            'success': function (data, json, xhr) {
                var list = data.list;
                emitter.fire('success', 'get', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.post({
            'pageNo': 1,
            'pageSize': 5,
        });


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});