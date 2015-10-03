

define('/Recommend/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();





    function format(all) {

        var belong$list = {};

        $.Array.each(all, function (item, index) {

            var belong = item.belong;
            var list = belong$list[belong];
            if (!list) {
                list = belong$list[belong] = [];
            }

            list.push(item);

        });

        var groups = [];

        $.Object.each(belong$list, function (belong, list) {

            list.sort(function (a, b) {
                a = a.prioriy || 0;
                b = b.prioriy || 0;

                return a - b;
            });

            groups.push({
                'name': belong,
                'items': list,
            });
        });


        return groups;

    }


    //获取数据
    function get() {


        var api = KISP.create('API', 'Recommend.list', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({

            'response': function () {
                
            },

            'success': function (data, json, xhr) {


                var list = format(data);

                //增加一个 '全部' 的虚拟分类
                list = [{
                    name: '全部',
                    items: data,

                }].concat(list);

                emitter.fire('success', 'get', [list]);

            },



            'fail': function (code, msg, json, xhr) {

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.get();


    }


    var loading2 = null;
    var toast2 = null;

    function post(data) {

        loading2 = KISP.create('Loading', {
            text: '提交中...',
            mask: 0.35,
        });

        loading2.show();


        var api = KISP.create('API', 'Signup.add', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({
            'response': function () {
                loading2.hide();
            },

            'success': function (data, json, xhr) {

                toast2 = toast2 || KISP.create('Toast', {
                    text: '提交成功',
                    duration: 1500,
                    mask: 0.35,
                });

                toast2.show();

                emitter.fire('success', 'post', [data]);

            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('提交数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '提交数据错误: 网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.post(data);


    }



    return {
        get: get,
        post: post,
        on: emitter.on.bind(emitter),
    };


});