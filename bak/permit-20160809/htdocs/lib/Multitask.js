
/**
* 多任务队列模块
* @namespace
* @author micty
*/
define('Multitask', function (require, exports, module) {

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
    function concurrency(list, done) {

        var dones = init(list);

        $.Array.each(list, function (item, index) {

            if (typeof item == 'function') { //简单情形， item 是 fn，直接调用

                item(function (data, json) {
                    dones[index] = data;
                    checkReady(dones, done);
                });
            }
            else { //复杂情形，用于需要传递一些参数给 fn 的情形

                var fn = item.fn;
                var args = item.args || [];
                var context = item.context || null;

                //fn 中的最后一个参数必须是成功的回调函数
                args.push(function (data, json) {
                    dones[index] = data;
                    checkReady(dones, done);
                });

                fn.apply(context, args);
            }
            

        });

    }

    /**
    * 启动串行执行任务队列。
    * @param {Array} list 任务队列, 即函数队列。
    *   函数队列中的每个函数，第一个参数必须是回调函数。
    */
    function serial(list, fn) {

        var dones = init(list);

        var index = 0;
        var len = list.length;

        (function () {

            var next = arguments.callee;
            var item = list[index];

            item(function (data) {
                dones[index] = data;

                index++;

                if (index < len) {
                    next();
                }
                else { //最后一个
                    fn && fn(dones);
                }
            });
        })();

    }



    return {
        concurrency: concurrency,
        serial: serial,
    };

});


