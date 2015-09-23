

/**
* 级联弹出菜单模块
* 
*/
define('CascadeMenus', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var Samples = require('Samples');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    //默认配置
    var defaults = { };

    //模板
    var samples = Samples.get('CascadeMenus', [
        {
            name: 'div',
            begin: '#--div.begin--#',
            end: '#--div.end--#',
            trim: true,
        },
        {
            name: 'group',
            begin: '#--group.begin--#',
            end: '#--group.end--#',
            outer: '{groups}',
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
            outer: '{leafs}',
            trim: true,

        },
    ]);


    /**
    * 根据给定的索引值集合获取所对应的 CSS 类的 topN 编号。
    * @param {Array} indexes 索引值列表。
    * @return {Array} 返回对应的 topN 编号数组。
    */
    function getTopNos(indexes) {

        //完整的路径 index 数组。 第 0 级(顶级)的 index 总是 0
        indexes = [0].concat(indexes);

        return $.Array.keep(indexes, function (index, level) {
            var parents = indexes.slice(0, level + 1);
            return $.Array.sum(parents);

        });
    }

    /**
    * 从一棵树中获取指定了索引值集合所对应的分组。
    * @param {Object} tree 树形结构的数据对象。
    * @param {Array} indexes 索引值列表。
    *   如 [0, 2, 1], 表示: 
    *   第 0 级的第 0 个节点下的子结点(即分组);
    *   第 1 级的第 2 个节点下的子结点(即分组);
    *   第 2 级的第 1 个节点下的子结点(即分组);
    * @return {Array} 返回对应的节点分组。
    */
    function getGroups(tree, indexes, key) {

        //完整的路径 index 数组。 第 0 级(顶级)的 index 总是 0
        var fullIndexes = [0].concat(indexes);

        var items = [tree];

        var groups = $.Array.keep(fullIndexes, function (index, level) {

            var node = items[index];
            items = node[key];


            return $.Array.keep(items, function (item, i) {
                return $.Object.extend({}, item); //浅拷贝
            });
        });

        $.Array.each(indexes, function (index, level) {

            var group = groups[level];
            var item = group[index];

            item.actived = true;
        });

        return groups;

    }


    /**
    * 级联弹出菜单构造器。
    */
    function CascadeMenus(config) {

        var id = $.String.random();
        this[guidKey] = 'CascadeMenus-' + id;


        var container = config.container;
        var fields = $.Object.extend({}, defaults.fields, config.fields);
        var emitter = MiniQuery.Event.create();
        var divId = 'div-' + id.toLowerCase();

        var meta = {
            'tree': config.tree,
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

            var tree = meta.tree;
            var div = meta.div;
            var activedClass = meta.activedClass;

            var selector = div + ' li[data-index]';

            var $container = $(container);


            //在菜单项上滑动鼠标时
            $container.delegate(selector, 'mouseover', function (event) {

                //隐藏有个动画延迟，为避免在隐藏的动画过程中又 mousever 而导致的重新显示。
                //重现方法: 移除下面的代码，点击菜单项后又在上面移动鼠标，可以看到菜单又给显示出来了。
                if (!meta.hasShown) {
                    return;
                }

                var li = this;
                var ol = li.parentNode;
                var no = +ol.getAttribute('data-index');    //组号

                var index = +li.getAttribute('data-index'); //项号
                var group = meta.list[no];
                var item = group[index];

                var indexes = meta.indexes;

                if (tree.isLeaf(item)) { //叶子结点

                    //把当前叶子结点所在的组的所有下级组隐藏
                    $(div).find('ol[data-index]:gt(' + no + ')').hide();

                    var activedIndex = indexes[no]; //当前组的激活项的索引
                    $(ol).find('li[data-index="' + activedIndex + '"]').removeClass(activedClass);

                    return;
                }

                indexes = indexes.slice(0, no);
                indexes[no] = index;

                self.render(meta.node, indexes);


                

            });

            //单击菜单项时
            $container.delegate(selector, 'click', function (event) {

                self.hide();

                var li = this;
                var ol = li.parentNode;

                var no = +ol.getAttribute('data-index');    //组号
                var index = +li.getAttribute('data-index'); //项号

                var group = meta.list[no];
                var item = group[index];

                event.stopPropagation();
                emitter.fire('change', [item, no, index]);


            });
        };



    }


    //实例方法
    CascadeMenus.prototype = {

        constructor: CascadeMenus,

        /**
        * 渲染 UI，以在页面中呈现出组件。
        * @param Object} node 渲染所使用的树形数据节点。
        */
        render: function (node, indexes, style) {

            var meta = mapper.get(this);

            var currentIndexes = meta.indexes;

            //避免对同样的数据进行重复渲染。
            if (currentIndexes.length > 0 &&
                indexes.join('') == currentIndexes.join('')) {
                this.show();
                return;
            }

      
            var isFromInner = !style; //不指定参数 style 时，认为是内部的调用，如 mouseover 导致的

            style = style || meta.style;

            var tree = meta.tree;
            var fields = meta.fields;
            var groups = getGroups(node, indexes, fields['child']);
            var topNos = getTopNos(indexes);

            $.Object.extend(meta, {
                'list': groups,
                'node': node,
                'indexes': indexes,
                'style': style,
            });

            this.hide();

            var textKey = fields['text'];

            //分组对应的 html
            var html = $.Array.keep(groups, function (group, no) {

                return $.String.format(samples.group, {
                    'index': no,
                    'topN': topNos[no],
                    'leafs': '',
                    'items': $.Array.keep(group, function (item, index) {

                        var sample = tree.isLeaf(item) ? samples['leaf'] : samples['item'];

                        return $.String.format(sample, {
                            'index': index,
                            'name': item[textKey],
                            'actived': item.actived ? meta.activedClass : '',
                        });

                    }).join(''),

                    
                });

            }).join('');

            if (meta.hasRendered) { //非首次渲染，外层容器 div 已创建，直接填充即可
                $(meta.div).html(html).css({
                    'left': style.left,
                    'top': style.top,
                });
            }
            else { //首次渲染
                //外层容器 div 的 html
                html = $.String.format(samples['div'], {
                    'div-id': meta.divId,
                    'div-class': meta.containerClass,
                    'left': style.left,
                    'top': style.top,
                    'groups': html,
                });

                $(meta.container).html(html);
                meta.bindEvents(); //首次渲染时需要绑定事件
                meta.hasRendered = true;
            }

            this.show(isFromInner ? '' : 'fade');
        },

        /**
        * 显示组件。
        */
        show: function (type) {

            var meta = mapper.get(this);
            meta.hasShown = true;

            var div = meta.div;

            switch (type) {
                
                case 'fade':
                    $(div).fadeIn();
                    break;

                case 'slide':
                    $(div).slideDown('fast');
                    break;

                default:
                    $(div).show();
                    break;
            }


            var lis = $(div).find('ol').find('li:last').toArray();

            var tops = $.Array.keep(lis, function (li, index) {
                var $li = $(li);
                return $li.offset().top + $li.outerHeight();
            });

            var max = $.Array.max(tops);

            meta.emitter.fire('show', [max]);
        },

        /**
        * 隐藏组件。
        */
        hide: function (type) {

            var meta = mapper.get(this);

            meta.hasShown = false; //相当于个信号，先锁定，再动画延迟隐藏

            var div = meta.div;
            var emitter = meta.emitter;

            switch (type) {
                
                case 'fade':
                    $(div).fadeOut(function () {
                        emitter.fire('hide');
                    });
                    break;

                case 'slide':
                    $(div).slideUp(function () {
                        emitter.fire('hide');
                    });
                    break;

                default:
                    $(div).hide();
                    emitter.fire('hide');
                    
                    break;
            }


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
    return $.Object.extend(CascadeMenus, {

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }

    });

});






