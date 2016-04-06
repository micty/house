
; (function (KISP) {

    // KISP 内部模块所需要的默认配置
    KISP.config({
        'Url': {
            //注意：这里取 `config.js` 路径作为根地址，
            //只适用于构建后引用 `config.js` 的 script 标签不会给删掉的情况。
            root: function () {
                var $ = KISP.require('$');
                var script = $('script[src*="config.js"]').get(0);
                var href = script.getAttribute('src');
                return script.src.split(href)[0];
            },
        },
        'Tabs': {
            eventName: 'click',
        },
        'API': {
            //对外正式地址
            url: 'http://120.24.89.223:3000/',
        },
    });


    /**weber.debug.begin*/
    //开发模式下使用。 使用 weber 工具构建页面后，本区域的代码会给去掉。

    KISP.config({
        'API': {
            //内部地址
            //url: 'http://localhost:3000/',
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
    window.$ = KISP.require('$');

    /**weber.debug.end*/


})(KISP);


