

; (function (KISP) {

    var $ = KISP.require('$');
    var MiniQuery = KISP.require('MiniQuery');
    var Url = MiniQuery.require('Url');

    var qs = Url.getQueryString(window) || {};


    /**
    * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
    */
    // KISP 内部模块所需要的默认配置
    KISP.config({

        'Url': {
            //注意：这里取 `config.js` 路径作为根地址，
            //只适用于构建后引用 `config.js` 的 script 标签不会给删掉的情况。
            root: function () {
                var $ = KISP.require('$');
                var script = $('script[src*="config.js"]').get(0);
                var href = script.getAttribute('src');
                var url = script.src.split('/').slice(0, -1).join('/');
                return url + '/';
            },
        },

        'API': {
            //对外正式地址
            //url: 'http://120.24.89.223:8080/',
            url: 'http://120.24.89.223:8081/',
            
        },
        'Alert': {
            //mask: 0,
        },
    });

    KISP.data({
        'pager': {
            size: qs.pageSize || (top.KISP.data('pager') || {}).size || 20,    //分页大小,
            size: 2,    //分页大小,
        },
     
    });




    


    /**weber.debug.begin*/ //------------------------------------------------------------------------>

    // 开发过程中用到的配置，正式发布后可去掉
    KISP.config({  // KISP 内部模块所需要的默认配置
        'API': {
            //url: 'http://localhost:8080/',
            url: 'http://localhost:8081/',

            //在开发阶段，为了防止后台过快的返回数据而显示让某些需要显示
            //"数据加载中"的效果不明显， 这里强行加上一个随机延迟时间，
            //以模拟真实的慢速网络， 发布后，应该去掉该配置。
            delay: {
                min: 400,
                max: 1200,
            },
        },
        'Proxy': {
            delay: {
                min: 500,
                max: 1500
            },
        },
    });

    KISP.data({
        'demo': {
            //在 paper/list 用到
            url: '../../../../../demo/htdocs/index.html',
        },
    });



    //开发阶段，把 define 变成全局变量
    window.define = KISP.require('Module').define;

    //window.onerror = function (msg, a, b) {
    //    alert([msg, a, b].join(', '));
    //};


    var alert = window.alert;
    window.alert = function () {
        var $ = KISP.require('$');
        var args = [].slice.call(arguments, 0);
        args = $.Array.keep(args, function (item, index) {
            if (typeof item == 'object') {
                return JSON.stringify(item, null, 4);
            }

            return String(item);
        });

        alert(args.join(', '));

    };


    // <----------------------------------------------------------------------------------------
    /**weber.debug.end*/


})(KISP);


