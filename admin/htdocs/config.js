

; (function (KISP) {

    var $ = KISP.require('$');


    /**
   * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
   */
    // KISP 内部模块所需要的默认配置
    KISP.config({
        /**
        * Url 模块的默认配置。
        * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
        */
        'Url': {
            //注意：这里取 config.js 的路径作为根地址，发布后 config.js 必须独立存在。
            root: $('script[src*="config.js"]').get(0).src.split('config.js')[0],
            
        },

        'Seajs': {
            url: '{~}f/seajs/seajs.mod.{@}.js',
        },

        'API': {
            url: 'http://localhost:3000/',
        },
    });

    KISP.data({
        'demo': {
            //在 paper/list 用到
            url: '../../../../../demo/htdocs/index.html',
        },
    });




    /**
    * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
    *
    */
    KERP.config({

        // Web 站点的根地址
        Url: {
            'default': $('script[src*="config.js"]').get(0).src.split('config.js')[0],
        },

        //后台接口
        API: {
            codes: {
                success: 200,
            },
        },


        //代理到本地网站根目录下的文件。 
        //不指定时则请求后台的真实数据。
        //格式为 接口名称: 本地代理的处理文件名
        Proxy: {

            'portal/login': [ //当指定为一个数组时，则起作用的是最后一个
                'api/portal/login-action.js',
            ],
        },

        //简易分页器
        SimplePager: {
            container: '#div-pager-simple',
            current: 1,
            size: 10,
            hideIfLessThen: 0,
        },



        //动态加载模块的默认配置 (for seajs)
        Seajs: {
            base: '{~}f/seajs/',
            debug: true,
            alias: {
                juery: 'jquery/jquery.js',
                dialog: 'art-dialog/dialog.all.{@}.js?r=' + Math.random(),
            }
        },

        Loading: {
            text: '数据加载中...',
        },


        //弹出对话框默认配置 (artDialog)
        Dialog: {
            cssUri: '{~}lib/art-dialog/dialog.all.{@}.css#',
            backdropOpacity: 0.2,       //遮罩层不透明度(越小越透明)
            backdropBackground: '#000', //遮罩层背景色
            quickClose: false,          //是否支持快捷关闭(点击遮罩层自动关闭)
            fixed: true,                //是否固定定位
            draggable: true,            //是否可拖动 (by micty)
            zIndex: 1024,               // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        },


        Login: {
            api: 'portal/login',
            actions: {
                login: 'login',
                logout: 'logout',
            },

            files: {
                master: 'master.html',
                login: 'login.html',
            },
        },

       

    });




    KISP.require('Module').define('KERP', function () {
        return KERP;
    });


    /**grunt.debug.begin*/ //------------------------------------------------------------------------>


    // 开发过程中用到的配置，正式发布后可去掉
    KISP.config({  // KISP 内部模块所需要的默认配置

        'Proxy': {
            delay: {
                min: 500,
                max: 1500
            },
        },
    });



    //调试模式下使用。
    //使用 grunt 工具构建页面后，本区域的代码会给去掉。


    // 开发过程中用到的配置，发布后可去掉
    KISP.config({  // KISP 内部模块所需要的默认配置

        'API': {
            //在开发阶段，为了防止后台过快的返回数据而显示让某些需要显示
            //"数据加载中"的效果不明显， 这里强行加上一个随机延迟时间，
            //以模拟真实的慢速网络， 发布后，应该去掉该配置。
            delay: {
                min: 400,
                max: 1200,
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


    // <----------------------------------------------------------------------------------------
    /**grunt.debug.end*/


})(KISP);


