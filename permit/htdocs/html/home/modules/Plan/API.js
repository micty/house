

define('/Plan/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get() {

        var api = KISP.create('API', 'Plan.all', {
            
        });


        api.on({


            'success': function (data, json, xhr) {

                var list = data.list;
                var lands = data.lands;

                var landId$item = {};

                list.forEach(function (item) {
                    landId$item[item.landId] = item;
                });


                var id$land = {};
                lands.forEach(function (item) {
                    id$land[item.id] = item;
                });

                var dones = $.Array.map(list, function (item) {

                    var land = id$land[item.landId];
                    if (!land) {
                        return null;
                    }

                    var planId = item.id;

                    var licenses = $.Array.grep(data.licenses, function (item) {
                        return item.planId == planId;
                    });

                    return $.Object.extend({}, item, {
                        'land': land,
                        'licenses': licenses,
                    });

                });


                emitter.fire('success', 'get', [dones.slice(0, 5)]);
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



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});