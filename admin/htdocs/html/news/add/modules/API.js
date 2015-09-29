

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();

    var loading = null;
    var toast = null;



    //获取数据
    function post(type, title, content) {


        loading = loading || KISP.create('Loading', {
            text: '提交中...',
            mask: 0,
        });

        loading.show();



        var api = KISP.create('API', 'Paper/Add');


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
                    emitter.fire('success', [data]);

                }, 1500);


            },
 

            'fail': function (code, msg, json) {
                alert('提交失败: {0}({1})', msg, code);
            },

            'error': function () {
                alert('提交错误: 网络繁忙，请稍候再试');
            },
        });



        title = encodeURIComponent(title);
        content = encodeURIComponent(content);

        api.post({
            'title': title,
            'content': content,
            'type': type,
        });


    }



    return {
        post: post,
        on: emitter.on.bind(emitter),
    };


});