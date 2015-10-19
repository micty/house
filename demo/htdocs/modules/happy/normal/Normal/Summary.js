

define('/Normal/Summary', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-normal-sections-summary');

    panel.on('init', function () {

        
       
    });


    panel.on('render', function (list) {

        panel.fill(list, function (item) {
            return {
                'desc': item,
            };
        });
    });




    return panel.wrap();


});