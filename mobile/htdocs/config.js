
; (function (KISP) {

    //业务端模块的默认配置
    KISP.data({
        'demo': {
            //在 house/detail 用到
            map: '../html/map/index.html',
        },

    });


    // KISP 内部模块所需要的默认配置
    KISP.config({
        'Url': {

        },

        'API': {
            //对外正式地址
            url: 'http://120.24.89.223:3000/',

        },
        'LocalStorage': {
            name: 'house-mobile-675F18792485D1A8',
        },
        'SessionStorage': {
            name: 'house-mobile-675F18792485D1A8',
        },
        'App': {
            type: 'standard',
            animation: true,
        },
        'View': {
            background: '#EFEFF4',
        },
        'Proxy': {
            base: 'api/',
        },
        
    });

    
    /**grunt.test.begin*/


    /**grunt.test.end*/




    /**grunt.debug.begin*/

    KISP.data({
        'demo': {
            //在 house/detail 用到
            map: '../../demo/htdocs/html/map/index.html',
        },
    });


    KISP.config({
        'API': {
            //内部地址
            url: 'http://localhost:3000/',
            //url: 'http://172.20.131.111:3000/',

            
        },

        'Proxy': {
            delay: {
                min: 500,
                max: 1500
            },
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
 
    KISP.data('build-time', '会自动更新');

    /**grunt.debug.end*/




})(KISP);


