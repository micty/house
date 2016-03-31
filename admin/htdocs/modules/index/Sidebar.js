


/**
* 侧边菜单栏模块
*/
define('/Sidebar', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var Template = KISP.require('Template');
    var Tabs = require('Tabs');



    var ul = document.getElementById('ul-sidebar');
    var div = ul.parentNode;

    var emitter = new Emitter();
    var tabs = null;
    var list = [];

    function bindEvents() {

        tabs = new Tabs({

            container: ul,
            selector: '>li',
            indexKey: 'data-index',
            current: null,
            event: 'click',
            activedClass: 'hover',
        });


        //每次都会触发，不管当前项是否高亮
        tabs.on('change', function (index, item) {

            var item = list[index];
            emitter.fire('click', [item]);
           
        });

    }





    function active(item) {
        tabs.active(item.group);
    }




    function render(data) {

        list = data;


        Template.fill(ul, list, function (item, index) {

            return {
                'index': index,
                'name': item.name,
                'icon': item.icon,
                'class': item.border ? 'group' : '',
            };

        });


        bindEvents();

    }





    return {
        render: render,
        active: active,
        on: emitter.on.bind(emitter),
    };

});





    