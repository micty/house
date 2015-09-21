

/**
* 级联路径模块
* 
*/
define('CascadePath', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var Samples = require('Samples');
    var Tree = require('Tree');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    //默认配置
    var defaults = {};

    //模板
    var samples = Samples.get('CascadePath', [
        {
            name: 'ol',
            begin: '#--ol.begin--#',
            end: '#--ol.end--#',
            trim: true,
        },
        {
            name: 'item',
            begin: '#--item.begin--#',
            end: '#--item.end--#',
            outer: '{items}',
            trim: true,

        },
        {
            name: 'leaf',
            begin: '#--leaf.begin--#',
            end: '#--leaf.end--#',
            outer: '{leaf}',
            trim: true,
        },
    ]);


    


    


    /**
    * 级联路径构造器。
    */
    function CascadePath(config) {

        var id = $.String.random();
        this[guidKey] = id;

        config = $.Object.extendDeeply({}, defaults, config); //深度合并

        var fields = $.Object.extend({}, defaults.fields, config.fields);
        var olId = 'ol-' + id.toLowerCase();
        var selector = '#' + olId + '>li[data-index]';

        //实例的私有数据
        var meta = {
            'tree': config.tree,
            'textKey': fields['text'],
            'container': config.container,
            'activedClass': defaults.activedClass,
            'index': -1, //当前展开的项的索引值。
            'hasBind': false,
            'list': [],
            'self': this,
            'olId': olId,
            'emitter': MiniQuery.Event.create(),
            'span': selector + '>span',
            'a': selector + '>a',
        };

        mapper.set(this, meta);



        meta.bindEvents = function () {

            var tree = meta.tree;
            var container = meta.container;
            var self = meta.self;
            var emitter = meta.emitter;

            var $container = $(container);

            //单击下拉三角形
            $container.delegate(meta.span, 'click', function (event) {

                var span = this;
                var li = span.parentNode;

                var index = +li.getAttribute('data-index');
                if (index == meta.index) { //当前项是展开的状态
                    self.reset(); //重置，回到关闭状态
                    emitter.fire('close');
                    return;
                }

                var item = meta.list[index];
                if (tree.isLeaf(item)) { //叶子结点
                    return;
                }

                self.reset(); //先重置，回到初始状态
                $(span).addClass(meta.activedClass);
                meta.index = index;

                var style = {
                    left: $(li).position().left,
                    top: $container.position().top + $container.height(),
                };

                event.stopPropagation();
                emitter.fire('open', [item, index, style]);
                


            });

            //单击回退节点
            $container.delegate(meta.a, 'click', function (event) {

                var a = this;
                var li = a.parentNode;

                var index = +li.getAttribute('data-index');
                var item = meta.list[index];

                if (tree.isLeaf(item)) {
                    return;
                }

                var items = tree.getParents(item);
                self.render(items);

            });

            meta.hasBind = true;
        };


    }


    //实例方法
    CascadePath.prototype = { 

        constructor: CascadePath,

        /**
        * 渲染 UI，以在页面中呈现出组件。
        * @param {Array|Object} data 渲染所使用的数据。
        */
        render: function (data) {

            var meta = mapper.get(this);

            var list = (data instanceof Array) ? data : [data];
            if (Tree.same(list, meta.list)) { //数据一样，不重复渲染
                return;
            }

            meta.list = list;

            
            var textKey = meta.textKey;
            var tree = meta.tree;

            var html = $.String.format(samples['ol'], {

                'ol-id': meta.olId,

                'items': $.Array.keep(list, function (item, index) {

                    var sample = tree.isLeaf(item) ? samples['leaf'] : samples['item'];

                    return $.String.format(sample, {
                        'index': index,
                        'name': item[textKey],
                    });
                }).join(''),

                'leaf': '', //这里清空即可，因为叶子结点统一在 'items' 里处理了

            });

            $(meta.container).html(html);
            this.reset(); //回归到关闭状态

            if (!meta.hasBind) { //只需要绑定一次
                meta.bindEvents();
            }

            meta.emitter.fire('change', [list]);

        },

        reset: function () {
            var meta = mapper.get(this);
            var span = meta.span;
            var activedClass = meta.activedClass;
            $(span).removeClass(activedClass);

            meta.index = -1;
        },

        /**
        * 给本控件实例绑定事件。
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
            mapper.remove(this);
        },

    };



    //静态方法
    return $.Object.extend(CascadePath, { 

        create: function (data, config) {
            var cp = new CascadePath(config);
            cp.render(data);
            return cp;
        },

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }

    });

});






    