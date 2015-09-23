

define('/ClientList/Main/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var pageSize = 10;
    var list = [];


    var defaults = {
        'pageNo': 1,
        'pageSize': pageSize,
        'skey': '',     //搜索关键词

    };




    function normalize(opt) {

        if (typeof opt == 'string') { //重载 normalize(skey)
            opt = {
                'skey': opt,
                'pageNo': 1,    //设置了新的 skey，页码重置为 1
            }; 
        }
        else if (typeof opt == 'number') { //重载 normalize(pageNo)
            opt = { 'pageNo': opt };
        }
        else {
            opt = {
                'skey': '',
                'pageNo': 1,    
            };
        }



        //注意，这里有记忆功能，上次的值会给记录下
        opt = $.Object.extend(defaults, opt);


        return {

            'pageNo': opt['pageNo'],
            'pageSize': opt['pageSize'],
            'key': opt['skey'] || '',     //搜索关键字

        };

    }


    //获取数据
    function post(opt, fn) {

        opt = normalize(opt);

        var pageNo = opt.pageNo;

        var api = new KISP.create('SSH.API', 'GetCustomerList', {
            //proxy: 'api/GetCustomerList.js',
        });



        api.on({

            'response': function () {
                var args = [].slice.call(arguments, 0);
                emitter.fire('response', args);
                fn && fn();
            },

            'success': function (data, json, xhr) {


                var a = $.Array.keep(data['list'], function (item, index) {

                    return {
                        'id': item['id'], 
                        'name': item['name'],
                        'code': item['code'],
                    };

                });


                var pageCount = json['TotalPage'];

                list = pageNo == 1 || pageCount == 0 ? a : list.concat(a);

                emitter.fire('success', [list, {
                    'no': pageNo,
                    'count': pageCount,
                    'size': pageSize,
                }]);

            },

            'fail': function (code, msg, json, xhr) {

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });


        api.post(opt);


    }



   

    return {
        post: post,
        on: emitter.on.bind(emitter),

    };


});