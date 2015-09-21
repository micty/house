

/**
* 按钮菜单。
* 
*/
define('ButtonMenus', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var Samples = require('Samples');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    //默认配置
    var defaults = { };

    //模板
    var samples = Samples.get('ButtonMenus', [
        {
            name: 'li',
            begin: '#--li.begin--#',
            end: '#--li.end--#',
            trim: true,
        },
        {
            name: 'item',
            begin: '#--item.begin--#',
            end: '#--item.end--#',
            outer: '{items}',
            trim: true,

        },
       
    ]);



    /**
    * 级联弹出菜单构造器。
    */
    function ButtonMenus(config) {

        var id = $.String.random();
        this[guidKey] = 'ButtonMenus-' + id;


        var container = config.container;
        var fields = $.Object.extend({}, defaults.fields, config.fields);
        var emitter = MiniQuery.Event.create();
        var divId = 'div-' + id.toLowerCase();

        var meta = {
            
            'container': container,
            'fields': fields,
            'activedClass': defaults.activedClass,
            'leafClass': defaults.leafClass,
            'delay': 'delay' in config ? config.delay : defaults.delay,
            'list': [],
            'indexes': [],
            'node': null,
            'hasShown': false,
            'hasRendered': false,
            'emitter': emitter,
            'divId': divId,
            'div': '#' + divId,
            'style': {
                top: 0,
                left: 0,
            },
        };

        mapper.set(this, meta);


        var self = this;

        meta.bindEvents = function () {

        };



    }


    //实例方法
    ButtonMenus.prototype = {

        constructor: ButtonMenus,

        /**
        * 渲染 UI，以在页面中呈现出组件。
        * @param Object} node 渲染所使用的树形数据节点。
        */
        render: function (node, indexes, style) {

            var meta = mapper.get(this);

        },

        /**
        * 显示组件。
        */
        show: function (type) {

            var meta = mapper.get(this);
            
        },

        /**
        * 隐藏组件。
        */
        hide: function (type) {

            var meta = mapper.get(this);

            


        },


        /**
        * 给本组件实例绑定事件。
        */
        on: function () {

            var meta = mapper.get(this);

            var emitter = meta.emitter;
            var args = [].slice.call(arguments, 0);

            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁当前实例。
        */
        destroy: function () {
            
            mapper.remove(this);
        },

    };


    //静态方法
    return $.Object.extend(ButtonMenus, {

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }

    });

});






