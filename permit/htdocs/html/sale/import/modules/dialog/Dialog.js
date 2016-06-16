

define('/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-dialog');
    var dialog = null;


    panel.on('init', function () {

        var sample = panel.$.html();
        sample = $.String.between(sample, '<!--', '-->');


        dialog = KISP.create('Dialog', {

            title: '导入销售记录',
            text: sample,
            buttons: [
                { text: '清空', name: 'clear', color: 'green', },
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],

            height: 600,
            width: 900,
            autoClosed: false,
            cssClass: 'dialog-add',
        });

        dialog.on('show', function () {
            //让它出现在可视范围内。
            var h = top.document.body.scrollTop + 20;
            dialog.$.css('top', h);
        });


        dialog.on('button', 'clear', function () {
            dialog.$.find('textarea').val('');
        });

        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {


            var content = dialog.$.find('textarea').val();
            var data = parse(content);

            var msgs = data.msgs;
            if (msgs.length > 0) {
                KISP.alert(msgs.join('<br />'));
                return;
            }

            var type = dialog.$.find('[name="type"]').val();
            var list = data.list;

            panel.fire('submit', [type, list]);
            dialog.hide();

        });

       

    });



    panel.on('render', function () {


        dialog.show();

    });




    function parse(content) {
        var list = content.split('\n');

        var begin = 4;
        var end = list.findIndex(function (item) {
            return item.startsWith('"说明');
        });

        if (end < 0) {
            end = list.length;
        }


        list = list.slice(begin, end);

        var msgs = [];
        var data = {
            'msgs': msgs,
            'list': list,
        };

        if (list.length == 0) {
            msgs.push('没有找到有效的数据记录');
            return data;
        }



        var keys = [
            'land',
            'project',

            'number',
            'date',
            'location',

            'residenceSize',
            'commerceSize',
            'officeSize',
            'otherSize',
            'parkSize',
            'otherSize1',

            'residenceCell',
            'commerceCell',
            'officeCell',
            'otherCell',

            'saled-residenceSize',
            'saled-commerceSize',
            'saled-officeSize',
            'saled-otherSize',
            'saled-parkSize',
            'saled-otherSize1',

            'saled-residenceCell',
            'saled-commerceCell',
            'saled-officeCell',
            'saled-otherCell',
        ];



        data.list = $.Array.map(list, function (item, index) {

            var no = index + 1;
            var values = item.split('\t');

            //空行
            if (!values.join(''.trim())) {
                return null;
            }

            if (values.length != keys.length) {
                msgs.push('第 ' + no + ' 条记录的字段个数不正确');
                return null;
            }
       

            item = {
                'id': $.String.random(), //增加一个随机 id，方便在列表中处理。
            };

            keys.forEach(function (key, index) {
                item[key] = values[index];
            });

            if (!item.land) {
                msgs.push('第 ' + no + ' 条记录缺少土地证号');
                return null;
            }

            return item;
        });

        return data;

    }



    return panel.wrap();

});