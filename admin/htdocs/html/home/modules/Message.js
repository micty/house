
/**
* 最新消息模块。
*/
define('/Message', function (require, module, exports) {


    var $ = require('$');
    var KERP = require('KERP');

    var div = document.getElementById('div-message');
    var list = [];
    var hasBind = false; //指示是否已绑定了事件，避免重复绑定。
    var maxCount = 1;


    var loading = new KERP.Loading({
        selector: div,
        container: '#div-loading-message',
    });


    function load(fn) {


        var api = new KISP.create('API', 'home/message', {
            proxy: 'api/home/message.js',
        });


        api.on({
            'success': function (data, json) { //success
                fn && fn(data);
            },

            'fail': function (code, msg, json) {
                ul.innerHTML = '<li>加载失败: ' + msg + '</li>';
            },

            'error': function () {
                ul.innerHTML = '<li>加载失败，请稍候再试!</li>';
            },
        });

        api.get();



    }


    function render() {

        loading.show();

        load(function (data) {

            list = data;

            var index = 0;

            data = $.Object.extend({
                count: list.length,
                index: index,

            }, list[index]);


            KERP.Template.fill(div, data);
            
            loading.hide();

            bindEvents();
        });
    }


    function bindEvents() {

        if (hasBind) {
            return;
        }

        $(div).delegate('[data-index]', 'click', function (event) {

            var div = this;
            var index = +div.getAttribute('data-index');
            console.log(index);
        });

        hasBind = true;
    }



    return {
        render: render
    };

});