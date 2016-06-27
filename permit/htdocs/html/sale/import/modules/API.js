

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var Logs = require('Logs');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;
    var LINE = '_____________________________________________________________________________________________________________________';

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




    function getLands(groups, lands) {
        lands = lands.map(function (land) {

            var license = land.license;
            var group = groups.find(function (group) {
                return group.land.license == license;
            });

            return '\t' + license + '\t' + group.sale.project;
        });

        return lands
    }



    function getLicenses(licenses) {

        licenses = licenses.map(function (license) {
            return '\t' + license.number + '\t' + license.date + '\t' + license.location;
        });

        return licenses
    }






    function post(type, list) {

        var groups = format(type, list);

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

            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('提交数据错误: 网络繁忙，请稍候再试');
            },
        });


        api.on('done', function (code, msg, json) {

            //由于状态码不同时，参数形式不同，这里用查找的方式。
            var data = json.data;
            if (!data) {
                top.KISP.alert('提交数据失败: {0} ', msg);
                return;
            }

            var msgs = [msg];
            var typeText = type == 0 ? '预售许可证' : '现售备案';

            var lands = data.lands || [];
            var plans = data.plans || [];
            var sales = data.sales || [];
            var licenses = data.licenses || [];
            var adds = data.adds || [];
            var edits = data.edits || [];

            if (lands.length > 0) {
                lands = getLands(groups, lands)

                msgs.push(LINE);
                msgs.push('无法关联的土地记录' + ' ' + lands.length + ' 条:');
                msgs = msgs.concat(lands);
            }

           

            if (plans.length > 0) {

                plans = getLands(groups, plans);

                msgs.push(LINE);
                msgs.push('无法关联的规划记录' + ' ' + plans.length + ' 条:');
                msgs = msgs.concat(plans);
            }


            if (sales.length > 0) {
                sales = sales.map(function (sale) {
                    return '\t' + sale.project;
                });

                msgs.push(LINE);
                msgs.push('新增导入的销售记录' + ' ' + sales.length + ' 条:');
                msgs = msgs.concat(sales);
            }


            if (licenses.length > 0) {
                licenses = getLicenses(licenses);

                msgs.push(LINE);
                msgs.push('无法导入的' + typeText + ' ' + licenses.length + ' 条:');
                msgs = msgs.concat(licenses);
            }

            if (adds.length > 0) {
                adds = getLicenses(adds);

                msgs.push(LINE);
                msgs.push('新增导入的' + typeText + ' ' + adds.length + ' 条:');
                msgs = msgs.concat(adds);
            }


            if (edits.length > 0) {
                edits = getLicenses(edits);

                msgs.push(LINE);
                msgs.push('覆盖导入的' + typeText + ' ' + edits.length + ' 条:');
                msgs = msgs.concat(edits);
            }


            Logs.render(msgs, function () {
                emitter.fire('success', 'post', [type]);
            });

        });


        var data = JSON.stringify(groups);
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