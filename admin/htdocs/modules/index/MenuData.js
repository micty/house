/**
* 侧边菜单栏的数据模块
*/
define('/MenuData', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = KISP.require('Url');

    var list = [];
    var ready = false;

    var homeItem = {
        name: '首页',
        isHome: true,
        id: $.String.random(5),
        //url: 'html/home/index.html',
        url: 'html/welcome/index.html',
    };



    //加载数据。
    //这里采用异步方式，方便以后从服务器端加载。
    function load(fn) {

        if (ready) {
            fn && fn(list);
            return;
        }


        var base = Url.root() + 'data/sidebar/';

        $.require('Script').load({
            url: [
                base + 'Sidebar.js',
            ],

            onload: function () {

                list = window['__Sidebar__'];


                $.Array.each(list, function (item, no) {

                    var index = 0; //这里去掉了二维分组，相当于每个组只有一项

                    $.Object.extend(item, {
                        'id': no + '-' + index,
                        'group': no,
                        'index': index
                    });

                });

                ready = true;
                fn(list);
            }
        });


    }

    function getItem(no, index, fn) {

        if (fn) { //异步方式

            load(function (list) {

                var item = null;

                if (typeof no == 'string') { // 把 [no, index] 看成字符串的 cmd 命令去查找

                    item = $.Array.findItem(list, function (item, i) {

                        var cmd = item.cmd;
                        return (cmd instanceof Array) && cmd[0] == no && cmd[1] == index;
                    });
                }
                else {
                    item = list[no];
                }

                fn(item);

            });

            return;

        }

    }


    //找出设置了 autoOpen: true 的项
    function getAutoOpens(data) {

        data = data || list;

        return $.Array.grep(data, function (item, index) {

            return !!item.autoOpen;
        });

    }



    return {

        load: load,

        getHomeItem: function () {
            return homeItem;
        },

        getItem: getItem,
        getAutoOpens: getAutoOpens,
    };
});
