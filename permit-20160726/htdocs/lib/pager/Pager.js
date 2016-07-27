
/**
* 标准分页控件
*/
define('Pager', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Mapper = MiniQuery.require('Mapper');
    var Emitter = MiniQuery.require('Emitter');

    var Helper = module.require('Helper');

    var guidKey = Mapper.getGuidKey();
    var mapper = new Mapper();

    var samples = $.String.getTemplates(document.body.innerHTML, [
        {
            name: 'ul',
            begin: '<!--Samples.Pager--!',
            end: '--Samples.Pager-->',
        },
        {
            name: 'item',
            begin: '#--item.begin--#',
            end: '#--item.end--#',
            outer: '{items}'
        },
        {
            name: 'more',
            begin: '#--more.begin--#',
            end: '#--more.end--#',
            outer: ''
        },
    ]);


    /**
    * 填充指定区间的一个区域页码。
    * @param {number} current 当前激活的页码。
    * @param {nmuber} from 要填充的起始页码。
    * @param {nmuber} to 要填充的结束页码。
    * @param {boolean} more 指示是否生成"更多"样式。
    * @return {string} 返回填充好的 html 字符串。
    */
    function fillRegion(current, from, to, more) {

        if (typeof from == 'object') { // fillRegion(current, {  });
            var obj = from;
            from = obj.from;
            to = obj.to;
            more = obj.more;
        }


        var pageNos = $.Array.pad(from, to + 1);

        var html = $.Array.keep(pageNos, function (no, index) {


            var isCurrent = no == current;

            return $.String.format(samples.item, {

                'no': no,
                'active': isCurrent ? 'active' : '',
                'data-no': isCurrent ? '' : 'data-no="' + no + '"',
            });
        }).join('');

        if (more) {
            html += samples.more;
        }

        return html;

    }


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
    function Pager(config) {

        var id = $.String.random().toLowerCase();
        this[guidKey] = 'Pager-' + id;


        var container = config.container;

        var current = config.current || 1;  //当前页码，从 1 开始
        var size = config.size;             //分页的大小，即每页的记录数

        var total = config.total;           //总记录数
        var count = Math.ceil(total / size);//总页数

        var ulId = 'ul-pager-' + id;
        var txtId = 'txt-pager-' + id;

        var emitter = new Emitter(this);

        var meta = {
            ulId: ulId,
            txtId: txtId,
            container: container,
            current: current,
            size: size,
            count: count,
            total: total,
            hideIfLessThen: config.hideIfLessThen || 0,
            emitter: emitter,
            last: 0, //上一次的页码
        };

        mapper.set(this, meta);


        var self = this;

        $.Array.each(['change', 'error'], function (name, index) {

            var fn = config[name];
            if (fn) {
                self.on(name, fn);
            }
        });



        function jump() {
            var txt = document.getElementById(txtId);
            var no = txt.value;
            self.to(no, true);
        }


        //委托控件的 UI 事件
        var delegates = {
            no: '#' + ulId + ' [data-no]',
            button: '#' + ulId + ' [data-button]:not(.disabled)',
            txt: '#' + txtId,
        };



        $(container).delegate(delegates.no, 'click', function (event) { //点击分页的页码按钮

            var li = this;
            var no = +li.getAttribute('data-no');
            self.to(no, true);

        }).delegate(delegates.button, 'click', function (event) { //点击"上一页"|"下一页"|"确定"

            var li = this;
            var name = li.getAttribute('data-button');

            if (name == 'to') { //点击 "确定"
                jump();
            }
            else { // previous 或 next
                self[name](true);
            }

        }).delegate(delegates.txt, 'keydown', function (event) { //回车确定
            if (event.keyCode == 13) {
                jump();
            }
        });


    }




    Pager.prototype = { //实例方法

        constructor: Pager,

        render: function () {

            var meta = mapper.get(this);

            var count = meta.count; //总页数
            if (count < meta.hideIfLessThen) {
                $(meta.container).hide();
                return;
            }

            //当前页码，不能超过总页数 (考虑到 count==0)
            var current = Math.min(count, meta.current);
            var regions = Helper.getRegions(count, current);

            var itemsHtml = $.Array.keep(regions, function (item, index) {

                return fillRegion(current, item);

            }).join('');

            var toNo = Helper.getJumpNo(count, current, meta.last);

            var html = $.String.format(samples.ul, {
                'ul-id': meta.ulId,
                'txt-id': meta.txtId,

                current: current,
                count: count,
                total: meta.total,
                toNo: toNo,
                'first-disabled-class': current == Math.min(1, count) ? 'disabled' : '',
                'final-disabled-class': current == count ? 'disabled' : '',
                'jump-disabled-class': count == 0 ? 'disabled' : '',
                'txt-disabled': count == 0 ? 'disabled' : '',
                items: itemsHtml
            });


            $(meta.container).html(html).show(); //要重新显示出来，之前可能隐藏了


        },

        /**
        * 跳转到指定页码的分页。
        * @param {number} no 要跳转的页码。
        *   指定的值必须为从 1-max 的整数，其中 max 为本控件最大的页码值。
        *   如果指定了非法值，则会触发 error 事件。
        * @param {boolean} [fireEvent=false] 指示是否要触发事件。
        *   该参数仅供内部使用，外部调用时可忽略它。
        */
        to: function (no, fireEvent) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;


            var isValid = (/^\d+$/).test(no)

            if (!isValid) {
                if (fireEvent) {
                    emitter.fire('error', ['输入的页码必须是大于 0 的数字']);
                }
                return;
            }

            no = parseInt(no);
            var count = meta.count;

            if (no < 1 || no > count) {
                if (fireEvent) {
                    emitter.fire('error', ['输入的页码值只能从 1 到 ' + count]);
                }
                return;
            }

            meta.last = meta.current;
            meta.current = no;

            this.render();

            if (fireEvent) {
                emitter.fire('change', [no]);
            }

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



    return $.Object.extend(Pager);

});

