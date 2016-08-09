

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;


    panel.on('init', function () {


    });



    panel.on('render', function (data) {

        current = {};

        //没有土地记录字段，说明是新增的。
        //此时传进来的是一个土地记录。
        if (!data.land) {
            current.land = { 'id': data.id, };
            panel.fill(data);
            return;
        }

        //有土地 id，说明是编辑的。

        current = data;
        panel.fill(data.land);

        var construct = data.construct;
        panel.$.find('[name]').each(function () {
            var name = this.name;

            if (!(name in construct)) {
                return;
            }

            var value = construct[name];
            this.value = value;
        });


    });


    return panel.wrap({
        get: function () {

            var construct = current.construct || {};

            var data = {
                'id': construct.id,
                'landId': current.land.id,
            };

            panel.$.find('[name]').each(function () {
                var name = this.name;
                var value = this.value;
                data[name] = value;
            });

            return data;
        },
    });


});