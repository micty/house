

define('/Recommend/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();





    //function format(all) {

    //    var belong$list = {};

    //    $.Array.each(all, function (item, index) {

    //        var belong = item.belong;
    //        var list = belong$list[belong];
    //        if (!list) {
    //            list = belong$list[belong] = [];
    //        }

    //        list.push(item);

    //    });

    //    var groups = [];

    //    $.Object.each(belong$list, function (belong, list) {

    //        list.sort(function (a, b) {
    //            a = a.prioriy || 0;
    //            b = b.prioriy || 0;

    //            return a - b;
    //        });

    //        groups.push({
    //            'name': belong,
    //            'items': list,
    //        });
    //    });


    //    return groups;

    //}



    function format(all) {

        var belong$list = {};

        $.Array.each(all, function (item, index) {

            var belong = item.belong;
            var list = belong$list[belong];
            if (!list) {
                list = belong$list[belong] = [];
            }

            list.push(item);

        });

        var groups = [];

        $.Object.each(belong$list, function (belong, list) {
            groups.push({
                'name': belong,
                'items': list,
            });
        });

        //按这个数组中的顺序对 groups 进行排序。
        var belongs = [
            '价格待定楼盘',
            '8000元/平米以下楼盘',
            '8000-10000元/平米楼盘',
            '10000-12000元/平米楼盘',
            '12000元/平米以上楼盘',
        ];


        groups = $.Array.map(belongs, function (belong) {

            return $.Array.findItem(groups, function (group) {
                return group.name == belong;
            });
        });


        return groups;

    }


    //获取数据
    function get() {


        //var api = KISP.create('API', 'Recommend.list', {
        //    //proxy: 'api/GetRecommedList.js',
        //});

        var api = KISP.create('API', 'House2.list', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({

            'response': function () {
                
            },

            'success': function (data, json, xhr) {


                var list = format(data);

                //增加一个 '全部' 的虚拟分类
                list = [{
                    name: '全部',
                    items: data,

                }].concat(list);

                emitter.fire('success', 'get', [list]);

            },



            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get();


    }





    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});