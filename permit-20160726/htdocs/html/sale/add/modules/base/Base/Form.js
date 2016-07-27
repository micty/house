

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var $Object = require('$Object');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;



    panel.on('init', function () {
        panel.$.on('click', '[data-cmd]', function () {

            var cmd = this.getAttribute('data-cmd');
            cmd = cmd.split('.')[0];

            var data = current[cmd];
            panel.fire('detail', [cmd, data]);
        });

    });


    panel.on('render', function (data) {

        current = data;

        data.sale = data.sale || { //针对新增的情况。
            project: '',
            location: '',
            projectDesc: '',
            locationDesc: '',
        };

        data = $Object.linear(data);

        panel.fill(data);

  

    });


    return panel.wrap({
        get: function () {

            var sale = current.sale || {};

            var data = {
                'id': sale.id,
                'planId': current.plan.id,
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