﻿
; (function (KISP) {

    // KISP 内部模块所需要的默认配置
    KISP.config({
        'Seajs': {
            //字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min
            url: '{~}f/seajs/seajs.mod.{@}.js',
        },
    });


    //业务端模块的默认配置
    KISP.data({
 
    });

    



    //开发模式下使用。 使用 grunt 工具构建页面后，本区域的代码会给去掉。

    /**grunt.debug.begin*/


    KISP.config({
        'Proxy': {
            delay: {
                min: 500,
                max: 1500
            },
        },
    });


    //开发阶段，把 define 变成全局变量
    window.define = KISP.require('Module').define;


    /**grunt.debug.end*/



   


})(KISP);


