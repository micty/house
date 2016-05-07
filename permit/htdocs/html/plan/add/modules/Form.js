

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#table-form');





    panel.on('init', function () {


    });



    panel.on('render', function (data) {

        if (data) {
            panel.$.find('[name]').each(function () {
                var name = this.name;

                if (!(name in data)) {
                    return;
                }

                var value = data[name];
                this.value = value;

            });
        }



    });


    return panel.wrap({
        get: function (id) {

            var data = {
                'id': id,
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