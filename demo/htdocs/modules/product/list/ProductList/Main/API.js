

define('/ProductList/Main/API', function (require, module, exports) {

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

        'skey': '',     //搜索关键字
        'type': '',     //商品类别或类目id
        'customer': 0,  //客户 id，不能为空字符串
    };




    function normalize(opt) {

      
        if (typeof opt == 'number') { //重载 normalize(pageNo)
            opt = { 'pageNo': opt };
        }
        


        //注意，这里有记忆功能，上次的值会给记录下
        opt = $.Object.extend(defaults, opt); 

        return {

            pageNo: opt['pageNo'],
            pageSize: opt['pageSize'],

            customer: opt['customer'], 
            key: opt['skey'],           
            type: opt['type'],       
        };

    }


    //获取数据
    function post(opt, fn) {


        opt = normalize(opt);


        var pageNo = opt.pageNo;

        var api = new KISP.create('SSH.API', 'GetProductList', {
            proxy: 'api/GetProductList.js',
        });



        api.post(opt);


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
                        'code': item['code'],
                        'name': item['name'],
                        'unit': item['unit'],
                        'price': item['price'],
                        'img': item['image'],
                        'count': item['qty'],
                    };

                });

                var pageCount = json['TotalPage'];
                list = pageNo <= 1 ? a : list.concat(a);


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

    }



    return {
        post: post,
        on: emitter.on.bind(emitter),
    };


});