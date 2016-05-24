/**
* 侧边菜单栏的数据模块
*/
define('/MenuData', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Script = MiniQuery.require('Script');

    var list = null;

    var home = {
        name: '首页',
        isHome: true,
        id: $.String.random(5),
        //id: '0-0',
        url: 'html/home/index.html',
        //url: 'html/welcome/index.html',
    };




    //加载数据。
    //这里采用异步方式，方便以后从服务器端加载。
    function load(fn) {

        if (list) {
            fn && fn(list);
            return;
        }

        var url = 'data/sidebar/Sidebar.js';

        Script.load(url, function () {

            list = window['__Sidebar__'] || [];

            $.Array.each(list, function (item, no) {

                var index = 0; //这里去掉了二维分组，相当于每个组只有一项

                $.Object.extend(item, {
                    'id': no + '-' + index,
                    'group': no,
                    'index': index
                });

            });

            fn && fn(list);
        });
        
    }


    //异步方式
    function getItem(id, fn) {

        //传入的是一个菜单项。
        if ($.Object.isPlain(id)) {
            var item = id;

            //传入的是一个在 Sidebar 里没有对应项的菜单项，
            //即自定义的菜单项，增加一个 id。
            if (!item.id) { 
                item.id = $.String.random();
            }

            fn && fn(item);
            return;
        }
     
        load(function (list) {

            var item = $.Array.findItem(list, function (item, i) {
                var cmd = item.cmd || [];
                return cmd.join('-') == id.join('-');
            });

            fn(item);

        });

    }


    //找出设置了 autoOpen: true 的项
    function getAutoOpens() {

        var items = $.Array.grep(list, function (item, index) {
            return !!item.autoOpen;
        });


        

        //首页要无条件打开。
        return [home].concat(items);

    }



    return {

        load: load,
        getItem: getItem,
        getAutoOpens: getAutoOpens,
    };
});
