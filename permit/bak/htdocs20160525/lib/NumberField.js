
/**
* 数值型输入框类。
* https://github.com/BobKnothe/autoNumeric
*/
define('NumberField', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Mapper = MiniQuery.require('Mapper');

    var mapper = new Mapper();


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
    var defaults = {
        groupSign: ',',         //分组的分隔符号
        groupCount: 3,          //分组的位数
        decimalSign: '.',       //小数点的符号
        decimalKey: null,       //输入小数点的代替键，一般不需要用到
        currencySign: '',       //货币的符号，如 '$'|'¥'|'€' 之类的
        currencyPlace: 'left',  //货币的符号所处的位置，前面或后面，取值: 'left'|'right'
        min: '0.00',            //允许的最小值，必须用字符串
        max: '9999999999999.99',//允许的最大值，必须用字符串，且比 min 要大
        decimalCount: 2,        //小数的位数
        round: 'S',             //四舍五入
        padded: false,           //是否用 "0" 填充小数位，取值: true|false
        bracket: null,          //输入框失去焦点后，负数的代替展示括号，不指定则原样展示

        /** Displayed on empty string
        * 'empty', - input can be blank
        * 'zero', - displays zero
        * 'sign', - displays the currency sign
        */
        empty: 'empty',         //输入框为空时的显示行为

        /** controls leading zero behavior
        * 'allow', - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
        * 'deny', - allows only one leading zero on values less than one
        * 'keep', - allows leading zeros to be entered. on fousout zeros will be retained.
        */
        leadingZero: 'allow',   //前缀 "0" 的展示行为
        formatted: true,        //控制是否在页面就绪时自动格式化输入框的值，取值: true|false
    };



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

        config = $.Object.extend({}, defaults, config);
        config = normalizeObject(config);

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

        update: function (options) {
            if (options) { //如果指定了，则需要转成原始控件的格式。
                arguments[0] = normalizeObject(options);
            }

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



    var input = null;
    var nf = null;

    /**
    * 静态方法。
    */
    return $.Object.extend(NumberField, {

        config: function (obj) {
            //get
            if (arguments.length == 0) {
                return defaults;
            }
            //set
            $.Object.extend(defaults, obj);
        },

       

        create: function (el, options) {
            return new NumberField(el, options);
        },

        update: function (el, options) {
            new NumberField(el).update(options);
        },

        value: function (txt) {
           
            var nf = new NumberField(txt);
            var value = nf.get();
            value = Number(value);

            return value;
        },

        text: function (value, options) {

            options = $.Object.extend(defaults, {
                min: '-9999999999999.99',   //允许的最小值，必须用字符串
                currencySign: '',   //这个是必须的，否则可能会受 money() 方法的影响。

            }, options);


            if (!input) {

                input = document.createElement('input');
                input.type = 'text';
                nf = new NumberField(input, options);
            }


            input.value = value;
            nf.update(options);

            return input.value;

        },

        money: function (value, options) {
    
            options = $.Object.extend({}, options, {
                currencySign: '¥',
            });

            return NumberField.text(value, options);
        },

    });


});

