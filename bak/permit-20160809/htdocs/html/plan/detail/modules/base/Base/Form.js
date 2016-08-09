

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd="land.detail"]', function () {

            var land = current.land;

            panel.fire('detail', 'land', [land]);
        });

    });



    panel.on('render', function (data) {


        current = data;
        var land = data.land;
        var plan = data.plan;

        data = $.Object.extend({}, plan, {
            'land.number': land.number,
            'land.town': land.town,
            'land.location': land.location,

            'land.numberDesc': land.numberDesc,
            'land.townDesc': land.townDesc,
            'land.locationDesc': land.locationDesc,
        });

        panel.fill(data);

      

    });


    return panel.wrap();


});