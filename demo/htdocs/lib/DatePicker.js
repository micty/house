
//日期选择控件。 试用，到时可能会封装到 KISP 里
define('DatePicker', function (require, module, exports) {

    var $ = require('$');
    var maxDate = new Date(2020, 12, 30, 23, 59, 59);



    var MiniQuery = require('MiniQuery');
    var Mapper = MiniQuery.require('Mapper');
    var Emitter = MiniQuery.require('Emitter');

    var mapper = new Mapper();


    var defaults = {

        'theme': 'android-ics',
        'lang': 'zh',
        'maxDate': maxDate,
        'display': 'bottom',
        'mode': 'scroller',
        'dateFormat': "yy-mm-dd",
        'inputDateFormat': "yy-mm-dd",
        'showLabel': false,
        'dateOrder': 'yymmdd',
        'cancelText': "取消",
        'setText': "确定",
        'rows': 5,
    };


    function DatePicker(el, config) {



        Mapper.setGuid(this);


        var value = typeof config == 'string' ? config :
                config instanceof Date ? $.Date.format(config, 'yyyy-MM-dd') :
                '';


        var meta = {
            'el': el,
            'emitter': new Emitter(this),
        };

        mapper.set(this, meta);
        
        if (value) {
            $(el).val(value);
        }


    }



    DatePicker.prototype = {
        constructor: DatePicker,

        render: function () {

            var meta = mapper.get(this);
            var el = meta.el;
            var emitter = meta.emitter;


            var obj = $.Object.extend({}, defaults, {

                //点击确定按钮时
                'onSelect': function (value) {
                    emitter.fire('ok', [value]);
                },

                //当时间选择的内容发生变化时
                'onChange': function (value) {
                    emitter.fire('change', [value]);
                },

                //点击取消按钮时
                'onCancel': function () {
                    emitter.fire('cancel');
                },

                'onShow': function () {
                    emitter.fire('show');
                },

            });

            el = $(el);
            


            el.mobiscroll().date(obj);
            
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);

            var emitter = meta.emitter;
            emitter.destroy();
            mapper.remove(this);
        },

       

    };

    return DatePicker;

});