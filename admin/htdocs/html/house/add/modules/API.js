
define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();

    var loading = top.KISP.create('Loading', {
        mask: 0,
    });

    var toast = null;




    function post(data) {


        var id = data.id;
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'House2.' + name);


        api.on({


            'request': function () {
                loading.show('提交中...');
            },


            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || top.KISP.create('Toast', {
                    text: '提交成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                setTimeout(function () {
                    emitter.fire('success', 'post', [data]);

                }, 1500);

            },
 

            'fail': function (code, msg, json) {
                alert('提交失败: {0}({1})', msg, code);
            },

            'error': function () {
                alert('提交错误: 网络繁忙，请稍候再试');
            },
        });

        //取封面图的第一张作楼盘封面。
        var cover = $.Array.findItem(data.photos, function (item) {
            return item.album == '封面图';
        });


        data = $.Object.extend({}, data, {
            //安全起见
            'content': encodeURIComponent(data.content),

            'cover': cover ? cover.url : '',
        });

        api.post({
            'data': data,
        });


    }




    //获取数据
    function get(id) {

        var api = KISP.create('API', 'House2.get', {
            //proxy: 'api/HouseDetail.js',
        });


        api.on({

            'request': function () {
                loading.show('加载中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                data = $.Object.extend(data, {
                    'ads': data.ads || 'style/img/ad-001.jpg', //默认广告图
                    'content': decodeURIComponent(data.content),
                });


                emitter.fire('success', 'get', [data]);
            },



            'fail': function (code, msg, json, xhr) {

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });


    }



    return {
        get: get,
        post: post,
        on: emitter.on.bind(emitter),
    };


});