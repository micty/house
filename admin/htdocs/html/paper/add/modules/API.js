

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();

    var loading = null;
    var toast = null;



    //获取数据
    function post(data) {


        loading = loading || KISP.create('Loading', {
            mask: 0,
            
        });

        loading.show('提交中...');


        var id = data.id;
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'Paper.' + name);


        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
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


        var type = data.type;
        //var title = data.title;
        //var content = data.content;

        //安全起见
        var title = encodeURIComponent(data.title);
        var content = encodeURIComponent(data.content);

        api.post({
            'id': id, //当为 add 时，该参数会给忽略
            'title': title,
            'content': content,
            'type': type,
        });


    }




    function get(type, id) {

        loading = loading || KISP.create('Loading', {
            mask: 0,
        });

        loading.show('读取中...');


        var api = KISP.create('API', 'Paper.get');

        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                data.title = decodeURIComponent(data.title);
                data.content = decodeURIComponent(data.content);

                emitter.fire('success', 'get', [data]);

            },


            'fail': function (code, msg, json) {
                alert('读取失败: {0}({1})', msg, code);
            },

            'error': function () {
                alert('读取错误: 网络繁忙，请稍候再试');
            },
        });


        api.get({
            'id': id, 
            'type': type,
        });

    }



    return {
        get: get,
        post: post,
        on: emitter.on.bind(emitter),
    };


});