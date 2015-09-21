
/**
* 数值型输入框类。
* @author micty
*/
define('NumberField', function (require, exports, module) {

    var $ = require('$');
    var Seajs = require('Seajs');



    var mapper = new $.Mapper();

    var key$key = {

        groupSign: 'aSep',      //分组的分隔符号，默认为逗号 ","
        groupCount: 'dGroup',   //分组的位数，默认为 3
        decimalSign: 'aDec',    //小数点的符号，默认为点号 "."
        decimalKey: 'altDec',   //输入小数点的代替键，一般不需要用到
        currencySign: 'aSign',  //货币的符号
        currencyPlace: 'pSign', //货币的符号所处的位置，前面或后面，取值: "left"|"right"
        min: 'vMin',            //允许的最小值
        max: 'vMax',            //允许的最大值
        decimalCount: 'mDec',   //小数的位数，默认为 3
        round: 'mRound',        //四舍五入
        padded: 'aPad',         //是否用 "0" 填充小数位，取值: true|false
        bracket: 'nBracket',    //输入框失去焦点后，负数的展示括号
        empty: 'wEmpty',        //输入框为空时的显示行为
        leadingZero: 'lZero',   //前缀 "0" 的展示行为
        formatted: 'aForm',     //控制是否在页面就绪时自动格式化输入框的值
    };

    var key$value$value = {

        currencyPlace: {
            left: 'p', //前缀
            right: 's' //后缀
        }
    };

    //默认配置
    var defaults = {};



    //把配置对象归一化成原始控件所需要的格式
    function normalizeObject(config) {

        var obj = {};

        $.Object.each(config, function (key, value) {

            var oldKey = key$key[key];

            if (oldKey) {

                var value$value = key$value$value[key];
                if (value$value) {
                    value = value$value[value];
                }
                obj[oldKey] = value;
            }
            else {
                obj[key] = value;
            }

        });

        return obj;

    }

    //调用原始控件的方法
    function invoke(self, name, $argumetns) {

        var meta = mapper.get(self);
        var $this = meta.$this;

        var args = [].slice.call($argumetns, 0);
        args = [name].concat(args);

        return $this.autoNumeric.apply($this, args);

    }


    /**
    * 构造函数。
    */
    function NumberField(selector, config) {

        if ($.Object.isPlain(selector)) { // 重载 NumberField( config )
            config = selector;
            selector = config.selector;
            delete config.selector; //删除，避免对原始造成不可知的副作用
        }

        config = config ? normalizeObject(config) : {};
        config = $.Object.extend({}, defaults, config);

        var $this = $(selector).autoNumeric(config);

        var meta = {
            $this: $this,
        };

        mapper.set(this, meta);

    }



    NumberField.prototype = { //实例方法
        constructor: NumberField,

        init: function () {
            invoke(this, 'init', arguments);
        },

        destroy: function () {
            invoke(this, 'destroy', arguments);
        },

        update: function () {
            invoke(this, 'update', arguments);
        },

        set: function () {
            invoke(this, 'set', arguments);
        },

        get: function () {
            return invoke(this, 'get', arguments);
        },

        getString: function () {
            return invoke(this, 'getString', arguments);
        },

        getArray: function () {
            return invoke(this, 'getArray', arguments);
        },

        getSettings: function () {
            return invoke(this, 'getSettings', arguments);
        },
    };





    return {

        use: function (fn) {
            Seajs.use('autoNumeric', function () {
                fn && fn(NumberField);
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

