/*
* 视图导航器
*/

define('/Nav', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Navigator = KISP.require('Navigator');


    var mask = KISP.create('Mask', {
        opacity: 0,
        duration: 500,
        'z-index': 99999,
    });



    mask.render(); //提前渲染但不显示，避免在视图切换时来不及创建 DOM 节点。
    mask.show();
    mask.hide();

    var nav = new Navigator({
        hash: function (current) {
            //为了让 url 中的 hash 可读性更好，有助于快速定位到相应的模块。
            return [current, $.String.random(8)].join('-');
        },
    });


    //跳转到目标视图之前触发，先隐藏当前视图
    nav.on('before-to', function (current, target) {
        //避免上一个视图的点透
        mask.show();
    });



    //后退时触发
    nav.on('back', function (current, target) {
        //避免上一个视图的点透
        mask.show();
    });


   


    /**
    * 跳转(或延迟跳转)到指定的视图，并传递一些参数。
    */
    function to(delay, name, arg0, argN) {

        var args = [].slice.call(arguments);

        if (typeof delay == 'string') { //重载 to(name, arg0, argN)
            name = delay;
            delay = false;
        }
        else {
            args = args.slice(1);
        }


        if (delay) {
            setTimeout(function () {
                nav.to.apply(nav, args);
            }, delay);
        }
        else {
            nav.to.apply(nav, args);
        }
    }



    return {
        to: to,
        back: nav.back.bind(nav),
        on: nav.on.bind(nav),
        remove: nav.remove.bind(nav),
        removeLast: nav.removeLast.bind(nav),
        count: nav.count.bind(nav),
    };




});



