

/**
* 顶部的提示控件
* @author micty
*/
define('Tips', function (require, exports, module) {


    var durationId;
    var delayId;




    function show(type, text, duration, delay) {


        if (typeof text == 'object' && text) { //show(type, config)

            var config = text;

            text = config.text;
            duration = config.duration;
            delay = config.delay;
        }


        //先清空之前可能留下的
        clearTimeout(durationId);
        clearTimeout(delayId);

        if (delay) { //指定了延迟开始
            delayId = setTimeout(start, delay);
        }
        else {
            start();
        }

        if (duration) {
            durationId = setTimeout(hide, duration);
        }

        //一个内部的共用方法
        function start() {

            var Tips = top.KERP.require('Tips');

            if (type) {
                Tips.add(window, type, text);
            }
            else {
                Tips.open(window);
            }
        }
    }


    function hide() {

        //先清空之前可能留下的
        clearTimeout(durationId);
        clearTimeout(delayId);

        top.KERP.require('Tips').close(window);
    }




    function success(text, duration, delay) {
        show('success', text, duration, delay);
    }

    function info(text, duration, delay) {
        show('info', text, duration, delay);
    }

    function warn(text, duration, delay) {
        show('warn', text, duration, delay);
    }

    function error(text, duration, delay) {
        show('error', text, duration, delay);
    }

    function loading(text, duration, delay) {
        show('loading', text, duration, delay);
    }

    function cancel() {
        clearTimeout(delayId);
    }




    return {
        show: show,
        hide: hide,
        success: success,
        info: info,
        warn: warn,
        error: error,
        loading: loading,
        cancel: cancel,

        //为了兼容直接在 top 页面打开
        add: function (window, type, text) {
            alert(type + ':' + text);
        },

        //为了兼容直接在 top 页面打开
        open: function () {

        },

        //为了兼容直接在 top 页面打开
        close: function () { }
    };

});
