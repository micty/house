
/**
* 日期时间选择器类。
* @author micty
*/
define('DateTimePicker', function (require, exports, module) {

    var $ = require('$');
    var Seajs = require('Seajs');



    var mapper = new $.Mapper();


    //默认配置
    var defaults = {};




    //调用原始控件的方法
    function invoke(self, name, $argumetns) {

        var meta = mapper.get(self);
        var $this = meta.$this;

        var args = [].slice.call($argumetns, 0);
        args = [name].concat(args);

        return $this.datetimepicker.apply($this, args);

    }


    /**
    * 构造函数。
    */
    function DateTimePicker(selector, config) {

        if ($.Object.isPlain(selector)) { // 重载 DateTimePicker( config )
            config = selector;
            selector = config.selector;
            delete config.selector; //删除，避免对原始造成不可知的副作用
        }

        config = $.Object.extend({}, defaults, config);

        var $this = $(selector).datetimepicker(config);

        var meta = {
            $this: $this,
        };

        mapper.set(this, meta);

    }



    DateTimePicker.prototype = { //实例方法
        constructor: DateTimePicker,

        on: function (name, fn) {
            var meta = mapper.get(this);
            var $this = meta.$this;

            $this.on(name, fn);
        },

        remove: function () {
            invoke(this, 'remove', arguments);
        },

        show: function () {
            invoke(this, 'show', arguments);
        },

        hide: function () {
            invoke(this, 'hide', arguments);
        },

        update: function () {
            invoke(this, 'update', arguments);
        },

        setStartDate: function () {
            invoke(this, 'setStartDate', arguments);
        },

        setEndDate: function () {
            invoke(this, 'setEndDate', arguments);
        },

        setDaysOfWeekDisabled: function () {
            invoke(this, 'setDaysOfWeekDisabled', arguments);
        },
    };





    return {

        use: function (fn) {

            Seajs.use([
                'datetimepicker-css',
                'datetimepicker-js',
            ], function () {

                fn && fn(DateTimePicker);
            });
        },


        config: function (obj) {
            //get
            if (arguments.length == 0) {
                return defaults;
            }
            //set
            $.Object.extend(defaults, obj);
        },

    };


});

