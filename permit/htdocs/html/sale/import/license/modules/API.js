

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');
    var Logs = require('Logs');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;
    var LINE = '___________________________________________________________' +
        '__________________________________________________________';


    function get(land) {

        var api = new API('Land.get');

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
                emitter.fire('success', 'get', [data]);
            },

            'fail': function (code, msg, json) {
                KISP.alert('读取失败: {0}', msg, code);
            },

            'error': function () {
                KISP.alert('读取错误: 网络繁忙，请稍候再试');
            },
        });

        api.post({
            'license': land.license,
        });

    }




    function getLands(groups, lands) {
        lands = lands.map(function (land) {

            var license = land.license;
            var group = groups.find(function (group) {
                return group.land.license == license;
            });

            return '    ' + license + '    ' + group.sale.project;
        });

        return lands
    }










    function post(type, list) {

        function getLicenses(licenses) {

            licenses = licenses.map(function (license) {
                var number = license.number;
                var item = list.find(function (item) {
                    return item.license.number == number;
                })


                return [
                    '',
                    item.land.license,
                    item.sale.project,
                    number,
                    license.date,
                    license.location,

                ].join('    ');
            });

            return licenses
        }


        var groups = format(type, list);

        var api = new API('Sale.import');
    

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {
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
                KISP.alert('提交数据错误: 网络繁忙，请稍候再试');
            },
        });


        api.on('done', function (code, msg, json) {

            //由于状态码不同时，参数形式不同，这里用查找的方式。
            var data = json.data;
            if (!data) {
                KISP.alert('提交数据失败: {0} ', msg);
                return;
            }

            var msgs = [msg];
            var typeText = type == 0 ? '预售许可证' : '现售备案';

            var lands = data.lands || [];
            var plans = data.plans || [];
            var sales = data.sales || [];
            var licenses = data.licenses || [];
            var adds = data.adds || [];
            var updates = data.updates || [];

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
                    return '    ' + sale.project;
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


            if (updates.length > 0) {
                updates = getLicenses(updates);

                msgs.push(LINE);
                msgs.push('覆盖导入的' + typeText + ' ' + updates.length + ' 条:');
                msgs = msgs.concat(updates);
            }


            Logs.render(msgs, function () {
                emitter.fire('success', 'post', [type]);
            });

        });


        //var data = JSON.stringify(groups);
        //data = encodeURIComponent(data);

        api.post(groups);


    }

    function format(type, list) {

        //同一个土地证号就为一个组。

        var land$sale = {};
        var land$licenses = {};

        list.forEach(function (item) {

            var land = item.land.license; //土地证号

            var sale = land$sale[land];
            if (!sale) {
                land$sale[land] = {
                    'project': item.sale.project,
                };
            }

            var licenses = land$licenses[land];
            if (!licenses) {
                licenses = land$licenses[land] = [];
            }
        

            var license = item.license;
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