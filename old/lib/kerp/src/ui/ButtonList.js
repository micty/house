
/**
* 按钮组。
*/
define('ButtonList', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var Samples = require('Samples');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    //默认配置
    var defaults = {};

    //模板
    var samples = Samples.get('ButtonList', [
        {
            name: 'ul',
            begin: '#--ul.begin--#',
            end: '#--ul.end--#',
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
            name: 'group',
            begin: '#--group.begin--#',
            end: '#--group.end--#',
            outer: '{groups}',
            trim: true,
        },
        {
            name: 'group.item',
            begin: '#--group.item.begin--#',
            end: '#--group.item.end--#',
            outer: '{group.items}',
            trim: true,

        },

    ]);

    console.dir(samples);


    /**
    * 级联弹出菜单构造器。
    */
    function ButtonList(config) {

        var id = $.String.random();
        this[guidKey] = 'ButtonList-' + id;

        var container = config.container;
        var emitter = MiniQuery.Event.create();
        var fields = $.Object.extend({}, defaults.fields, config.fields);

        var childKey = fields.child;
        
        var list = config[childKey];
        var olId = 'ol-' + id + '-';
        var spanId = 'span-' + id + '-';

        var meta = {

            'container': container,
            'emitter': emitter,
            'list': list,
            'olId': olId,
            'spanId': spanId,
            'hasBind': false,
            'textKey': fields.text,
            'childKey': childKey,
            'callbackKey': fields.callback,
            'routeKey': fields.route,
            'autoClose': 'autoClose' in config ? config.autoClose : defaults.autoClose,
            'groupNo': -1, //当前展开的菜单组索引
            'hasManualOpened': false, //用来指示某分组菜单列表是否已补手动打开

            'bindEvents': bindEvents,
            'hideMenus': hideMenus,
            'showMenus': showMenus,

        };

        mapper.set(this, meta);


        var self = this;

        function bindEvents() {

            var $container = $(container);
            var childKey = meta.childKey;
            var callbackKey = meta.callbackKey;
            var routeKey = meta.routeKey;
            var autoClose = meta.autoClose;

            //点击下拉三角形按钮，弹出菜单
            $container.delegate('li[data-index]>span', 'click', function (event) {

                var span = this;
                var li = span.parentNode;

                var no = +li.getAttribute('data-index');
                self.toggle(no);
                meta.hasManualOpened = false;

                event.stopPropagation();

            });

            //点击按钮本身
            $container.delegate('ul>li[data-index]', 'click', function (event) {

                var li = this;

                var index = +li.getAttribute('data-index');
                var item = list[index];

                var args = [item, index];

                var fn = item[callbackKey];
                if (fn) {
                    fn.apply(null, args);
                }

                if (routeKey && (routeKey in item)) {
                    emitter.fire('click:' + item[routeKey], args);
                }

                emitter.fire('click', args);

                if (!meta.hasManualOpened) { //不是手动打开的，则关闭
                    hideMenus('fade');
                }

                event.stopPropagation();
                

            });

            //点击弹出的菜单项
            $container.delegate('ol>li[data-index]', 'click', function (event) {

                var li = this;

                var no = +li.getAttribute('data-no');
                var index = +li.getAttribute('data-index');

                var group = list[no];
                var items = group[childKey];
                var item = items[index];

                var args = [item, index, no];

                var fn = item[callbackKey];
                if (fn) {
                    fn.apply(null, args);
                }

                if (routeKey && (routeKey in item)) {
                    emitter.fire('click:' + item[routeKey], args);
                }

                emitter.fire('click', args);

                event.stopPropagation();

                if (autoClose) { //设置了点击后隐藏
                    hideMenus(no, 'fade');
                }
                
            });

            //点击其他地方，隐藏
            $(document).on('click', function (event) {
                hideMenus('slide');
            });

            $(top.document).on('click', function (event) {
                hideMenus('fade');
            });

        };

        function hideMenus(no, type) {
            if (typeof no == 'string') { //重载 hideMenus(type)
                type = no;
                no = meta.groupNo;
            }
            toggleMenus(no, type, false);
            meta.hasManualOpened = false;
        }

        function showMenus(no, type) {
            toggleMenus(no, type, true);
        }

        function toggleMenus(no, type, sw) {

            if (no < 0 || no >= list.length) { //越界
                return;
            }

            var activedClass = defaults.activedClass;
            var olId = meta.olId;
            var spanId = meta.spanId;

            var $ol = $('#' + olId + no);
            var $span = $('#' + spanId + no);

            switch (type) {
                case 'slide':
                    if (sw) {
                        $ol.addClass(activedClass);
                        $span.addClass(activedClass);
                        $ol.slideDown('fast');
                    }
                    else {
                        $ol.slideUp('fast', function () {
                            $ol.removeClass(activedClass);
                            $span.removeClass(activedClass);
                        });
                    }
                    break;

                case 'fade':
                    $ol[sw ? 'fadeIn' : 'fadeOut']('fast', function () {
                        $ol.toggleClass(activedClass, sw);
                        $span.toggleClass(activedClass, sw);
                    });
                    break;

                default:
                    $ol.toggle(sw);
                    $ol.toggleClass(activedClass, sw);
                    $span.toggleClass(activedClass, sw);
                    break;
            }

            meta.groupNo = sw ? no : -1;

        }

    }


    //实例方法
    ButtonList.prototype = {

        constructor: ButtonList,

        /**
        * 渲染 UI，以在页面中呈现出组件。
        * @param Object} node 渲染所使用的树形数据节点。
        */
        render: function () {
            var meta = mapper.get(this);

            var textKey = meta.textKey;
            var childKey = meta.childKey;
            var list = meta.list;

            var html = $.String.format(samples['ul'], {

                'items': $.Array.keep(list, function (item, no) {

                    var items = item[childKey];

                    //单个按钮
                    if (!items) {
                        return $.String.format(samples['item'], {
                            'index': no,
                            'text': item[textKey],
                        });
                    }

                    //按钮菜单
                    return $.String.format(samples['group'], {
                        'index': no,
                        'text': item[textKey],
                        'ol-id': meta.olId,
                        'span-id': meta.spanId,
                        'css-class': item.cssClass || '',

                        'group.items': $.Array.keep(items, function (item, index) {

                            return $.String.format(samples['group.item'], {
                                'no': no,
                                'index': index,
                                'text': item[textKey],
                            });

                        }).join(''),
                    });

                }).join(''),

                'groups': '', //这个清空，弹出菜单已在 items 里填充了
            });

            $(meta.container).html(html);

            if (!meta.hasBind) {
                meta.bindEvents();
            }

        },

        /**
        * 给本组件实例绑定事件。
        */
        on: function (name, key, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            //on({}) 或 on('', fn)
            if (typeof name == 'object' || typeof key == 'function') {
                var args = [].slice.call(arguments, 0);
                emitter.on.apply(emitter, args);
                return;
            }
            
            //暂时在这里实现二级事件。 以后会用 MiniQuery 库实现。
            if (typeof key == 'string') { //on('', '', fn)
                emitter.on(name + ':' + key, fn);
            }
            else if (typeof key == 'object') { //on('', {})
                $.Object.each(key, function (key, fn) {
                    emitter.on(name + ':' + key, fn);
                });
            }


            
        },

        /**
        * 销毁当前实例。
        */
        destroy: function () {
            mapper.remove(this);
        },

        /**
        * 弹出/关闭指定分组的菜单列表。
        * @param {number} no 菜单分组的索引值。
        */
        toggle: function (no) {

            var meta = mapper.get(this);
            var list = meta.list;

            var item = list[no];

            var groupNo = meta.groupNo;

            if (groupNo == no) {
                meta.hideMenus(no, 'slide');
                return;
            }

            if (groupNo >= 0) {
                meta.hideMenus('slide');
            }

            meta.showMenus(no, 'slide');
            meta.hasManualOpened = true;
        },

    };


    //静态方法
    return $.Object.extend(ButtonList, {

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }

    });

});
