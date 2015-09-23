
; (function (KISP) {

    // KISP 内部模块所需要的默认配置
    KISP.config({
        'Seajs': {
            //字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
            url: '{~}f/seajs/seajs.mod.{@}.js',
        },

        'SSH.API': {
            prefix: 'kis.APP003177.uecrm.CRMController.'
        },

    });


    //业务端模块的默认配置
    KISP.data({
 
    });

    


    /**grunt.debug.begin*/
    //开发模式下使用。 使用 grunt 工具构建页面后，本区域的代码会给去掉。


    // 开发过程中用到的配置，正式发布后可去掉
    KISP.config({  // KISP 内部模块所需要的默认配置

        'SSH.API': {

            eid: '517531', //该值会给 Login 模块改写
            openid: '02669bc7-acb9-459c-8d04-9501be300239', //该值会给 Login 模块改写

            proxy: {
                
            },
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


    //构建后，grunt 会插入构建时间到下面。
    KISP.data('build-date-time', '会自动更新');


    /**grunt.debug.end*/



   


})(KISP);


