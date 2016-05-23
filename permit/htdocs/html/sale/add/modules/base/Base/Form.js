

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

    });


    panel.on('render', function (data) {

        current = data;

        data.license = Size.format(data.license);

        data.sale = data.sale || { //针对新增的情况。
            project: '',
            location: '',
        };

        data = $Object.linear(data);

        panel.fill(data);

  

    });


    return panel.wrap({
        get: function () {

            var sale = current.sale || {};

            var data = {
                'id': sale.id,
                'licenseId': current.license.id,
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