



/**
* 加载中的提示类。
* @author micty
*/
define('Loading', function (require, exports, module) {

    var $ = require('$');
    var Samples = require('Samples');
    var Mapper = MiniQuery.require('Mapper');

    var mapper = new Mapper();
    var guidKey = Mapper.getGuidKey();
    var sample = Samples.get('Loading');

    var defaults = {};


    function Loading(config) {

        var self = this;
        this[guidKey] = 'Loading-' + $.String.random();

        var container = config.container;
        var text = config.text || defaults.text;

        var meta = {
            container: container,
            selector: config.selector,
            text: text,
            rendered: false,

        };

        mapper.set(this, meta);


    }


    Loading.prototype = {//实例方法

        constructor: Loading,

        render: function () {

            var meta = mapper.get(this);

            var html = $.String.format(sample, {
                'text': meta.text
            });

            $(meta.container).html(html);
            
            meta.rendered = true;
        },


        show: function () {
            
            var meta = mapper.get(this);

            if (!meta.rendered) {
                this.render();
            }

            var selector = meta.selector;
            if (selector) {
                $(selector).hide();
            }

            $(meta.container).show();

        },

        hide: function () {
            var meta = mapper.get(this);

            var selector = meta.selector;
            if (selector) {
                $(selector).show();
            }

            $(meta.container).hide();
        }
    };



    return $.Object.extend(Loading, { //静态方法
        create: function (config) {
            var loading = new Loading(config);
            loading.show();
            return loading;
        },

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }
    });

});

