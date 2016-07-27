

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var list = null; //暂时实现前端分页


    var defaults = {
        'keyword': '',
    };


    function getPageList(options) {

        //注意，这里有记忆功能，上次的值会给记录下
        options = $.Object.extend(defaults, options);

        var items = list;
        var town = options.town;

        if (town) {
            items = items.filter(function (item) {
                return item.town == town;
            });
        }

        var keyword = options.keyword;
        if (keyword) {
            items = items.filter(function (item) {
                return item.number.indexOf(keyword) >= 0;
            });
        }

        var total = items.length;  //总记录数，以过滤后的为准。
        var pageNo = options.pageNo || 1;
        var pageSize = options.pageSize;

        var begin = (pageNo - 1) * pageSize;
        var end = begin + pageSize;

        items = items.slice(begin, end);
      

        emitter.fire('success', 'get', [items, {
            'no': pageNo,
            'size': pageSize,
            'total': total,
        }]);

    }




    //获取数据
    function get(options) {

        if (options && list) {
            getPageList(options);
            return;
        }

        options = options || { pageNo: 1 };


        var api = KISP.create('API', 'Land.list', {
            
        });


        api.on({

            'request': function () {

                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });

                loading.show('加载中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                list = data;
                getPageList(options);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get();


    }



    function remove(id) {

        var api = KISP.create('API', 'Land.remove');

        api.on({

            'request': function () {

                loading = loading || KISP.create('Loading', {

                });

                loading.show('删除中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                var list = data;
                
                emitter.fire('success', 'remove', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('删除数据失败: {0} ({1})', msg, code);
            },
            'error': function (code, msg, json, xhr) {
                KISP.alert('删除数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });

    }



    return {
        get: get,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});