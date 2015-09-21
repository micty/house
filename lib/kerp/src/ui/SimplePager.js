

/**
* 简单分页控件
* @author micty
*/
define('SimplePager', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Samples = require('Samples');

    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();
    var sample = Samples.get('SimplePager');


    var defaults = {};


    /**
    * 根据指定配置信息创建一个分页器实例。
    * @param {Object} config 传入的配置对象。 其中：
    * @param {string|DOMElement} container 分页控件的 DOM 元素容器。
    * @param {number} [current=1] 当前激活的页码，默认从 1 开始。
    * @param {number} size 分页大小，即每页的记录数。
    * @param {number} total 总的记录数。
    * @param {function} change 页码发生变化时的回调函数。
        该函数会接受到当前页码的参数；并且内部的 this 指向当前 Pager 实例。
    * @param {function} error 控件发生错误时的回调函数。
        该函数会接受到错误消息的参数；并且内部的 this 指向当前 Pager 实例。
    */
    function SimplePager(config) {

        var id = $.String.random().toLowerCase();
        var suffixId = '-simple-pager-' + id;

        this[guidKey] = 'SimplePager-' + id;


        var container = config.container || defaults.container;
        var current = config.current || defaults.current;   //当前页码，从 1 开始
        var size = config.size || defaults.size;            //分页的大小，即每页的记录数

        var total = config.total;           //总记录数
        var count = Math.ceil(total / size);//总页数

        var ulId = 'ul' + suffixId;
        var txtId = 'txt' + suffixId;

        var emitter = new MiniQuery.Event(this);

        var meta = {
            'ulId': ulId,
            'txtId': txtId,
            'container': container,
            'current': current,
            'size': size,
            'count': count,
            'hideIfLessThen': config.hideIfLessThen || defaults.hideIfLessThen,
            'emitter': emitter,
        };

        mapper.set(this, meta);


        var self = this;

        $.Array.each(['change', 'error'], function (name, index) {

            var fn = config[name];
            if (fn) {
                self.on(name, fn);
            }
        });


        var selector = '#' + ulId + ' [data-button]:not(.disabled)';

        $(container).delegate(selector, 'click', function (event) {

            var li = this;
            var name = li.getAttribute('data-button');
            self[name](true);

        });


        $(container).delegate('#' + txtId, {

            'focusin': function (event) {
                var txt = this;
                txt.value = meta.current;

            },

            'focusout': function (event) {
                jump(this);
            },

            'keydown': function (event) {
                if (event.keyCode == 13) { //回车键
                    jump(this);
                }
            }

        });

        //
        function jump(txt) {

            var no = +txt.value;
            if (no != meta.current) {
                self.to(no, true);
            }
            else {
                self.render();
            }
        }



    }




    SimplePager.prototype = { //实例方法

        constructor: SimplePager,

        render: function () {

            var meta = mapper.get(this);
            var container = meta.container;

            var count = meta.count; //总页数
            if (count < meta.hideIfLessThen) {
                $(container).hide();
                return;
            }

            //当前页码，不能超过总页数 (考虑到 count==0)
            var current = Math.min(count, meta.current);

            var html = $.String.format(sample, {
                'ul-id': meta.ulId,
                'txt-id': meta.txtId,

                current: current,
                count: count,

                'first-disabled-class': current == Math.min(1, count) ? 'disabled' : '',
                'final-disabled-class': current == count ? 'disabled' : '',
            });


            $(container).html(html).show(); //要重新显示出来，之前可能隐藏了


        },

        /**
        * 跳转到指定页码的分页。
        */
        to: function (no, fireEvent) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;


            var isValid = (/^\d+$/).test(no)

            if (!isValid) {
                if (fireEvent) {
                    emitter.fire('error', ['输入的页码必须是大于 0 的数字']);
                }
                return false;
            }

            no = parseInt(no);
            var count = meta.count;

            if (no < 1 || no > count) {
                if (fireEvent) {
                    emitter.fire('error', ['输入的页码值只能从 1 到 ' + count]);
                }
                return false;
            }


            meta.current = no;
            this.render();

            if (fireEvent) {
                emitter.fire('change', [no]);
            }

            return true;

        },

        focus: function () {
            var meta = mapper.get(this);
            $(meta.container).find('input').get(0).focus();
        },


        previous: function (fireEvent) {
            var meta = mapper.get(this);
            this.to(meta.current - 1, fireEvent);
        },

        next: function (fireEvent) {
            var meta = mapper.get(this);
            this.to(meta.current + 1, fireEvent);
        },

        first: function (fireEvent) {
            this.to(1, fireEvent);
        },

        final: function (fireEvent) {
            var meta = mapper.get(this);
            this.to(meta.count, fireEvent);
        },

        refresh: function (fireEvent) {
            var meta = mapper.get(this);
            this.to(meta.current, fireEvent);
        },

        on: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments, 0);

            emitter.on.apply(emitter, args);
        },
        /**
        * 销毁本控件实例。
        */
        destroy: function () {

            var meta = mapper.get(this);

            meta.emitter.off();

            var container = meta.container;
            $(container).html('').undelegate();

            mapper.remove(this);

        },
    };





    return $.Object.extend(SimplePager, { //静态方法

        create: function (config) {

            var pager = new SimplePager(config);
            pager.render();

            return pager;
        },

        config: function (obj) {

            $.Object.extend(defaults, obj);
        }
    });


});
