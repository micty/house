

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var Logs = require('Logs');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;



    function get(license) {

        var api = KISP.create('API', 'Land.list');

        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('读取中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                var list = data;
                var item = list.find(function (item) {
                    return item.license == license;
                });

                if (!item) {
                    top.KISP.alert('不存在该土地记录');
                    return;
                }

                emitter.fire('success', 'get', [item]);
            },

            'fail': function (code, msg, json) {
                top.KISP.alert('读取失败: {0}', msg, code);
            },

            'error': function () {
                top.KISP.alert('读取错误: 网络繁忙，请稍候再试');
            },
        });


        api.get();

    }



    function post(type, list) {

        var api = KISP.create('API', 'Sale.import');

        api.on({

            'request': function () {

                loading = loading || top.KISP.create('Loading', {
                    mask: 0,
                });

                loading.show('提交中...');
            },

            'response': function () {
                loading.hide();
            },

            'fail': function (code, msg, json, xhr) {
                var data = json.data;

                var msgs = [msg];

                switch (code) {

                    case 201:

                        break;

                    case 301:
                        data.forEach(function (item) {
                            msgs.push('【' + item.number + '】');
                        });
                        Logs.render(msgs);
                        break;

                    case 302:
                        var lands = data.lands.map(function (land) {
                            return '【' + land.license + '】';
                        });

                        if (lands.length > 0) {
                            msgs.push('无法关联的土地记录:');
                            msgs = msgs.concat(lands);
                        }

                        var plans = data.plans.map(function (land) {
                            return '【' + land.license + '】';
                        });

                        if (plans.length > 0) {
                            msgs.push('无法关联的规划记录:');
                            msgs = msgs.concat(plans);

                        }
                        Logs.render(msgs);
                        break;


                    default:
                        top.KISP.alert('提交数据失败: {0} ', msg, code);
                        break;

                }

              


            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('提交数据错误: 网络繁忙，请稍候再试');
            },
        });





        api.on('success', function (data, json, xhr) {


            toast = toast || top.KISP.create('Toast', {
                text: '提交成功',
                duration: 1500,
                mask: 0,
            });

            toast.show();

            setTimeout(function () {
                emitter.fire('success', 'post', [type]);

            }, 1500);

        });

        var data = format(type, list);
        data = JSON.stringify(data);
        data = encodeURIComponent(data);

        api.post({'data': data});


    }

    function format(type, list) {

        var land$sale = {};
        var land$licenses = {};

        list.forEach(function (item) {

            var land = item.land;

            var sale = land$sale[land];
            if (!sale) {
                land$sale[land] = {
                    'project': item.project,
                };
            }

            var licenses = land$licenses[land];
            if (!licenses) {
                licenses = land$licenses[land] = [];
            }

            var license = $.Object.remove(item, ['land', 'project']);
            license.type = type;

            licenses.push(license);


        });


        return Object.keys(land$sale).map(function (land) {

            return {
                'land': { 'license': land, },
                'sale': land$sale[land],
                'licenses': land$licenses[land],
            };
        });


    }


    return {
        get: get,
        post: post,
        on: emitter.on.bind(emitter),
    };


});