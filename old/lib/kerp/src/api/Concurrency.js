
/**
* 并发请求后台 API 的接口类
* @namespace
* @author micty
*/
define('Concurrency', function (require, exports, module) {

    var $ = require('$');
    


    

    function init(list) {

        return $.Array.keep(list, function (item, index) {
            return false;
        });
    }

    function checkReady(list, fn) {

        var isReady = list && list.length > 0;

        if (!isReady) {
            return;
        }

        $.Array.each(list, function (item, index) {

            if (!item) {
                isReady = false;
                return false; //相当于 break
            }
        });

        if (isReady) {
            fn && fn(list);
        }

    }
    

    /**
    * 启动并发任务。
    */
    function startTasks(list, fn) {

        var dones = init(list);

        $.Array.each(list, function (item, index) {

            item(function (data, json) {
                dones[index] = data;
                checkReady(dones, fn);
            });

        });


    }

    /**
    * 启动并发 API 请求。
    */
    function startAPIs(list, fnSuccess, fnFail, fnError) {

        var API = require('API');

        var dones = init(list);

        $.Array.each(list, function (item, index) {

            var name = item.name;
            var data = item.data || null;
            var method = item.method.toLowerCase();
            

            API[method](name, data, function (data, json) {

                dones[index] = data;
                checkReady(dones, fnSuccess);

            }, fnFail, fnError);

        });

    }


    /**
    * 启动并发。
    */
    function start(list, fnSuccess, fnFail, fnError) {

        var item0 = list[0];
        if (typeof item0 == 'function') {
            startTasks(list, fnSuccess);
        }
        else {
            startAPIs(list, fnSuccess, fnFail, fnError);
        }

    }






    return {
        start: start,
    };

});


