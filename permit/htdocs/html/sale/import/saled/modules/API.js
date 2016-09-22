

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


    function getValues(list) {

        list = list.map(function (item, index) {
            return [
               '',
               item.number,
               item.date,
               item.residenceSize || 0,
               item.commerceSize || 0,
               item.officeSize || 0,
               item.otherSize || 0,
               item.parkSize || 0,
               item.otherSize1 || 0,
               item.residenceCell || 0,
               item.commerceCell || 0,
               item.officeCell || 0,
               item.otherCell || 0,

            ].join('    ');
        });

        return list;
       

    }



    function post(list) {

        var api = new API('Saled.import');

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

            var nones = data.nones;
            var adds = data.adds;
            var updates = data.updates;
            var duplicates = data.duplicates;

            if (nones.length > 0) {
                nones = getValues(nones);
                msgs.push(LINE);
                msgs.push('无法关联到预售许可证或现售备案的已售记录' + ' ' + nones.length + ' 条:');
                msgs = msgs.concat(nones);
            }

            if (adds.length > 0) {
                adds = getValues(adds);
                msgs.push(LINE);
                msgs.push('新增导入的已售记录' + ' ' + adds.length + ' 条:');
                msgs = msgs.concat(adds);
            }

            if (updates.length > 0) {
                updates = getValues(updates);
                msgs.push(LINE);
                msgs.push('覆盖导入的已售记录' + ' ' + updates.length + ' 条:');
                msgs = msgs.concat(updates);
            }


            if (duplicates.length > 0) {
                duplicates = getValues(duplicates);
                msgs.push(LINE);
                msgs.push('重复导入(已跳过)的已售记录' + ' ' + duplicates.length + ' 条:');
                msgs = msgs.concat(duplicates);
            }


            Logs.render(msgs, function () {
                emitter.fire('success', []);
            });

        });

        api.post(list);

    }



    return {
        'post': post,
        'on': emitter.on.bind(emitter),
    };


});