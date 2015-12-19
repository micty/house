


/**
* 侧边菜单栏模块
*/
define('/Sidebar', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Emitter = MiniQuery.require('Emitter');


    var KERP = require('KERP');



    var ul = document.getElementById('ul-sidebar');
    var div = ul.parentNode;

    var emitter = new Emitter();
    var tabs = null;
    var list = [];
    var activedItem = null;
    var tid = null;


    //函数 fixed(y)
    var fixed = (function () {

        var hasFixed = false; //指示是否已经 fixed

        var max = 50;   //初始时的 top 值，也是最大的
        var min = -10;  //允许的最小的 top 值，即 fixed 后的 top 值

        //fixed = 
        return function (y) {

            if (typeof y == 'boolean') { // 重载 fixed(true|false)
                $(div).toggleClass('side-bar-fixed', y);
                return;
            }

            //y 是滚动实际数值

            var top = max - y; //要设置的 top 值

            //已经 fixed 了，并且要设置的 top 值比最小的还要小，则忽略。
            //避免重复去设置同一个值。
            if (hasFixed && top <= min) {
                return;
            }

            div.style.top = Math.max(top, min) + 'px';
            hasFixed = top <= min; //要设置的 top 值比最小的还要小，则表示已经 fixed。
        };

    })();




    function fill() {



        KERP.Template.fill(ul, list, function (item, index) {

            return {
                'index': index,
                'name': item.name,
                'icon': item.icon,
                'class': item.border ? 'group' : '',
            };

        });



    }


    function bindEvents() {

        tabs = KERP.Tabs.create({

            container: ul,
            selector: '>li',
            indexKey: 'data-index',
            current: null,
            event: 'click',
            activedClass: 'hover',
            change: function (index, item) { //这里的，如果当前项是高亮，再次进入时不会触发
                //console.log(index);
            }
        });


        //每次都会触发，不管当前项是否高亮
        tabs.on('change', function (index, item) {

            var item = list[index];
            emitter.fire('click', [item]);
           
        });


    }





    function active(item) {

        if (!item) { //active()
            item = activedItem;
        }

        if (!item) {
            return;
        }

        activedItem = item;
        tabs.active(item.group);
    }

    function activeAfter(delay) {

        if (!activedItem) {
            return;
        }

        tid = setTimeout(function () {
            active(activedItem);
        }, delay);
    }







    function render(data) {

        list = data;

        fill();
        bindEvents();

    }





    return {
        render: render,
        active: active,
        activeAfter: activeAfter,
        fixed: fixed,
        on: emitter.on.bind(emitter),
    };

});





    