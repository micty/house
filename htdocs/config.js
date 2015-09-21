

; (function ($, MiniQuery, KERP) {

 
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
            //后台接口的基础地址
            //url: 'http://172.19.113.112:8080/eshoperp/',  //内网
            url: 'http://172.20.131.250:8080/eshoperp/',    //外网
            codes: {
                success: 200,
            },
        },

        //代理到本地网站根目录下的文件。 
        //不指定时则请求后台的真实数据。
        //格式为 接口名称: 本地代理的处理文件名
        Proxy: {

            //控件示例
            'demo/1': 'api/demo/1.js',
            'demo/2': 'api/demo/2.js',
            'demo/3': 'api/demo/3.js',
            'demo/4': 'api/demo/4.js',


            'portal/login': [ //当指定为一个数组时，则起作用的是最后一个
                'api/portal/login.js',
                'api/portal/login-action.js',

            ],

            //'bos/baseitem': 'api/warehouse/baseitem.js',

            'warehouse/list': 'api/warehouse/list.js',

            'home/todo': 'api/home/todo.js',
            'home/flow': 'api/home/flow.js',
            'home/query': 'api/home/query.js',
            'home/message': 'api/home/message.js',
            //'bd/assistitem': 'api/bd/assistitem.js'



            'eshop/order': 'api/eshop/order.js'
        },

        //简易分页器
        SimplePager: {
            container: '#div-pager-simple',
            current: 1,
            size: 10,
            hideIfLessThen: 0,
        },

        //级联路径默认配置
        CascadePath: {
            activedClass: 'on',
            fields: {
                text: 'name',
                child: 'items',
            },
        },

        //级联弹出菜单默认配置
        CascadeMenus: {
            activedClass: 'actived',
            leafClass: 'leaf-item',
            delay: 100,
            fields: {
                text: 'name',
                child: 'items',
            },
        },

        //级联导航器默认配置
        CascadeNavigator: {
            containers: {
                path: '#div-cascade-path',
                menus: '#div-cascade-menus'
            },
            fields: {
                text: 'name',
                child: 'items',
            },
        },

        //级联选择器默认配置
        CascadePicker: {
            selectedIndexes: [-1, -1, -1],
            defaultTexts: [],
            defaultText: '--请选择--',
            hideNone: true,
            data: 'data/address/array.simple.js',
            varname: '__AddressData__',
            fields: {
                value: 0,
                text: 1,
                child: 2
            }
        },

        //动态加载模块的默认配置 (for seajs)
        Seajs: {
            base: '{~}lib/',
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

        

        DateTimePicker: {

        },

        Module: {

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

        //按钮组
        ButtonList: {
            activedClass: 'on',
            fields: {
                text: 'text',
                child: 'items',
                callback: 'fn',
                route: 'name',
            },
            autoClose: true,
        },


        Menu: {
            alias: {
                'abc': [0, 0],
            },
        }

    });






    //调试模式下使用。
    //使用 grunt 工具构建页面后，本区代码可以去掉
    if (KERP.require('Debug').check()) {

        var Module = KERP.require('Module');
        var define = Module.define;

        define('$', function () {
            return $;
        });

        define('MiniQuery', function () {
            return MiniQuery;
        });

        define('KERP', function () {
            return KERP;
        });

        window.define = define;
        window.require = Module.require;
    }
    
    

})(jQuery, MiniQuery, KERP);


