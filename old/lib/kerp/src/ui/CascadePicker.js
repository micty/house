
/**
* 级联选择器。
*/
define('CascadePicker', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Url = require('Url');
    var Cache = require('Cache');


    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();

    var samples = $.String.getTemplates(top.document.body.innerHTML, [
        {
            name: 'list',
            begin: '<!--Samples.CascadePicker--!',
            end: '--Samples.CascadePicker-->',
        },
        {
            name: 'item',
            begin: '#--item.begin--#',
            end: '#--item.end--#',
            outer: '{items}'
        }
    ]);



    //缺省配置
    var defaults = {
        container: '',
        selectedIndexes: [],
        defaultTexts: [],
        defaultText: '--请选择--',
        hideNone: true,
        data: [],
        varname: '',
        fields: {
            text: '',
            child: ''
        }
    };

    //缓存数据
    var url$data = {};


    //根据给定的一组值，从级联数据中获取其对应的一组索引。
    function getIndexes(list, values, valueField, childField) {

        return $.Array.keep(values, function (value) {

            var index = $.Array.findIndex(list, function (item) {
                //注意，用的是全等。 
                //这暗示了 value 可以是任何类型的值
                return item[valueField] === value;
            });

            var item = list[index] || {};
            list = item[childField] || [];

            return index;
        });

    }


    /**
    * 构造器。
    */
    function CascadePicker(config) {

        this[guidKey] = 'CascadePicker-' + $.String.random();


        var emitter = new MiniQuery.Event(this);

        var meta = $.Object.extend({}, defaults, config, {
            'emitter': emitter,
        });

        mapper.set(this, meta);


        var change = meta.change;
        if (change) {
            this.on('change', change);
        }


        var self = this;

        $(meta.container).delegate('select', 'change', function (event) {

            var select = this;
            var level = +select.getAttribute('data-index');
            var selectedIndex = select.selectedIndex - 1;

            var list = meta.selectedIndexes;

            meta.selectedIndexes = $.Array.keep(list, function (item, index) {

                if (index < level) {
                    return item;
                }

                if (index == level) {
                    return selectedIndex;
                }

                return -1;
            });

            self.render();

            emitter.fire('change', [level, selectedIndex]);

        });

    }


    


    //实例方法
    CascadePicker.prototype = {
        constructor: CascadePicker,

        /**
        * 渲染本实例组件到 UI 层。
        */
        render: function () {

            var self = this;

            this.load(function (list) {

                var meta = mapper.get(self);
                var fields = meta.fields;

                var valueField = fields.value;
                var textField = fields.text;
                var childField = fields.child;

                var defaultTexts = meta.defaultTexts || [];

                var selectedValues = meta.selectedValues;
                if (selectedValues) { //如果指定了选中的值，则把值转成索引。
                    meta.selectedIndexes = getIndexes(list, selectedValues, valueField, childField);
                    meta.selectedValues = null; //置空，避免再次 render 时 selectedIndexes 无法应用。
                }


                var html = $.Array.map(meta.selectedIndexes, function (selectedIndex, level) {

                    //指定了隐藏空数据的级别，并且当前级别的不存在数据，则不渲染。
                    if (meta.hideNone && list.length == 0) {
                        return null;
                    }

                    var defaultItem = {};
                    defaultItem[textField] = defaultTexts[level] || meta.defaultText;

                    list = [defaultItem].concat(list);
                    selectedIndex = selectedIndex + 1;

                    var html = $.String.format(samples['list'], {
                        'index': level,
                        'not-selected': selectedIndex <= 0 ? 'not-selected' : '',

                        'items': $.Array.keep(list, function (item, index) {

                            return $.String.format(samples['item'], {
                                'text': item[textField],
                                'selected': index == selectedIndex ? 'selected="selected"' : ''
                            });

                        }).join('')
                    });

                    var item = list[selectedIndex] || {};
                    list = item[childField] || [];

                    return html;


                }).join('');

                $(meta.container).addClass('address-picker').html(html);

            });

        },

        /**
        * 加载数据源，并在加载成功后执行一个回调函数。
        * 该方法会使用缓存策略。
        * @param {function} fn 加载成功后要执行的回调函数。
            该函数会接受到一个数组作为其参数，表示加载到的数据源。
        */
        load: function (fn) {

            var meta = mapper.get(this);
            var data = meta.data;

            if (data instanceof Array) { //现成的数据。 针对实例内的多次调用
                fn && fn(data);
                return;
            }


            //此时 data 为 string，当成 url
            var url = Url.check(data) ? data : Url.root() + data;

            data = url$data[url]; //从当前页面的缓存中读取。 针对页面内的多次创建实例的调用
            if (data) {
                meta.data = data;
                fn && fn(data);
                return;
            }

            data = Cache.get(url); //从 top 页面的缓存中读取。 针对跨页面的调用
            if (data) {
                data = $.Array.parse(data); //跨页面时在IE下的数组会变成伪数组
                meta.data = data;
                url$data[url] = data;
                fn && fn(data);
                return;
            }



            //加上随机查询字符串，确保拿到最新版本。
            var uri = $.Url.setQueryString(url, $.String.random(), '');

            $.Script.load(uri, function () {

                data = window[meta.varname] || [];

                //缓存起来
                meta.data = data;
                url$data[url] = data;
                Cache.set(url, data);

                fn && fn(data);
            });

        },


        /**
        * 获取所有选中的项所对应的数据。
        */
        getSelectedItems: function () {

            var meta = mapper.get(this);
            var childField = meta.fields.child;
            var list = meta.data;

            return $.Array.map(meta.selectedIndexes, function (selectedIndex, level) {

                var item = list[selectedIndex];
                if (item) {
                    list = item[childField] || [];
                }

                return item;

            });
        },

        /**
        * 给当前实例绑定一个指定名称的事件回调函数。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments, 0);

            emitter.on.apply(emitter, args);
        },


    };




    //静态方法
    return $.Object.extend(CascadePicker, {

        /**
        * 使用指定的配置对象去设置默认配置。
        * 默认配置用于在创建级联选择器实例时提供缺省的配置字段。
        * @param {Object} config 配置对象。
            具体字段见构造函数中的参数说明。
        */
        config: function (config) {
            $.Object.extendDeeply(defaults, config);
        },


        /**
        * 使用指定的配置对象创建一个级联选择器，并且渲染出来。
        * @param {Object} config 配置对象。
            具体字段见构造函数中的参数说明。
        * @return {CascadePicker} 返回一个已创建好的级联选择器实例。
        */
        create: function (config) {
            var picker = new CascadePicker(config);
            picker.render();
            return picker;
        }

    });


});

