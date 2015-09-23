

/**
* 级联导航模块
* 
*/
define('CascadeNavigator', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var Tree = require('Tree');
    var Url = require('Url');
    var CascadePath = require('CascadePath');
    var CascadeMenus = require('CascadeMenus');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    //默认配置
    var defaults = {};


    /**
    * 级联弹出菜单构造器。
    */
    function CascadeNavigator(config) {


        var id = $.String.random();
        this[guidKey] = 'CascadeNavigator-' + id;

        var containers = config.containers;
        var fields = $.Object.extend({}, defaults.fields, config.fields);

        var emitter = MiniQuery.Event.create();

        var meta = {
            'inited': false, //指示是否已经初始化
            'fields': fields,
            'selectedIndexes': config.selectedIndexes,
            'selectedValues': config.selectedValues,
            'emitter': emitter,
            'init': init,
            'data': config.data,

        };

        mapper.set(this, meta);

        //初始化
        function init(data) {

            data = meta.data = data || meta.data;

            var tree = new Tree(data, {
                'childKey': fields['child'],
                'valueKey': fields['value'],
            });

            var path = new CascadePath({
                'tree': tree,
                'container': containers['path'],
                'fields': fields,
                'selectedIndexes': config.selectedIndexes,
                'selectedValues': config.selectedValues,
            });

            var menus = new CascadeMenus({
                'tree': tree,
                'container': containers['menus'],
                'fields': fields,
            });


            path.on({
                'open': function (item, index, style) {
                    menus.render(item, [], style);
                },
                'close': function () {
                    menus.hide();
                },

                'change': function (list) {
                    menus.hide();
                    emitter.fire('change', [list]);
                },
            });


            var bodyHeight; //记录菜单弹出前的 body 高度

            menus.on({
                'change': function (item, no, index) {
                    var list = tree.getParents(item);
                    path.render(list);
                },

                'hide': function () {
                    if (bodyHeight) {
                        $(document.body).height(bodyHeight);
                        bodyHeight = null;
                    }
                },

                'show': function (top) {

                    var height = $(document.body).height();
                    if (!bodyHeight) {
                        bodyHeight = height;
                    }

                    if (top > height) {
                        $(document.body).height(top);
                    }


                },
            });

            $.Object.extend(meta, {
                'inited': true, //指示已经初始化
                'tree': tree,
                'path': path,
                'menus': menus,
            });

            $(document).off('click', hide).on('click', hide); //先移除之前绑定的，因为 init 方法可能多次执行

        }

        function hide() {
            meta.path.reset();
            meta.menus.hide('fade');
        }

        

    }


    //实例方法
    CascadeNavigator.prototype = {

        constructor: CascadeNavigator,

        /**
        * 渲染 UI，以在页面中呈现出组件。
        * @param Object} node 渲染所使用的树形数据节点。
        */
        render: function (data) {

            var meta = mapper.get(this);
           
            if (!meta.inited || data) { //未初始化 或 显示指定了 data，都要(重新)初始化
                meta.init(data);
            }

            var tree = meta.tree;

            var values = meta.selectedValues;

            var list = values ?
                    tree.getItemsByValues(values) : //优先按值来检索
                    tree.getItemsByIndexes(meta.selectedIndexes);

            meta.path.render(list);
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
            var meta = mapper.get(this);

            meta.tree.destroy();
            meta.path.destroy();
            meta.menus.destroy();

            mapper.remove(this);
        },
    };




    //静态方法
    return $.Object.extend(CascadeNavigator, {

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }

    });

});






