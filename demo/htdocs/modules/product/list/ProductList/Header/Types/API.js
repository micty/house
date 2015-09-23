

define('/ProductList/Header/Types/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();



    function tree(list) {

        var id$item = {}; 
        var children = []; //叶子结点数组

        var parents = $.Array.grep(list, function (item, index) {

            var id = item.id;
            id$item[id] = item;

            if (item.parentid == 0) { //顶级结点

                //分配一个数组
                item.items = [{
                    id: id,
                    name: '全部',
                }]; 

                return true;
            }

            children.push(item); //叶子结点

        });



        $.Array.each(children, function (item, index) {

            var parentId = item.parentid;
            var parent = id$item[parentId];
            parent.items.push(item);

        });

        return parents;
    }



    //获取数据
    function post() {


        var api = new KISP.create('SSH.API', 'GetProductTypeList', {
            proxy: 'api/GetProductTypeList.js',
        });


        api.post();


        api.on({

            'response': function () {

            },

            'success': function (data, json, xhr) {

                
                var list = [
                    {
                        id: '1',
                        name: '日用百货',
                        items: [
                            { id: '101', name: '厨房', },
                            { id: '102', name: '居家', },
                            { id: '103', name: '日用品', },
                            { id: '104', name: '男装', },
                            { id: '105', name: '女装', },
                            { id: '106', name: '珠宝', },
                            { id: '107', name: '手机', },
                        ],
                    },
                    {
                        id: '2',
                        name: '家用电器',
                        items: [
                            { id: '201', name: '风扇', },
                            { id: '202', name: '空调', },
                            { id: '203', name: '收音机', },
                            { id: '204', name: '电饭煲', },
                            { id: '205', name: '电灯', },
                            { id: '206', name: '洗衣机', },
                            //{ id: '207', name: '插座', },
                        ],
                    },
                    {
                        id: '3',
                        name: '办公用品',
                        items: [
                            { id: '301', name: '鼠标', },
                            { id: '302', name: '键盘', },
                            { id: '303', name: '显示器', },
                            { id: '304', name: '主机', },
                            { id: '305', name: '硬盘', },
                            { id: '306', name: 'USB', },
                            //{ id: '307', name: '数据线', },
                        ],
                    },
                    {
                        id: '4',
                        name: '美容护理',
                        items: [
                            { id: '401', name: '洗发水', },
                            { id: '402', name: '沐浴露', },
                            { id: '403', name: '护肤水', },
                            { id: '404', name: '洗手液', },
                            { id: '405', name: '口红', },
                         
                        ],
                    },
                    //{
                    //    id: '5',
                    //    name: '运动户外',
                    //    items: [
                    //        { id: '101', name: '厨房', },
                    //        { id: '102', name: '居家', },
                    //        { id: '103', name: '日用品', },
                    //        { id: '104', name: '男装', },
                    //        { id: '105', name: '女装', },
                    //        { id: '106', name: '珠宝', },
                    //        { id: '107', name: '手机', },
                    //    ],
                    //},

                ];


                //console.dir(data);
                //var list = tree(data.list);
                //console.dir(list);

                emitter.fire('success', [list]);

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