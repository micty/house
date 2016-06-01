
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');


    panel.on('init', function () {

        panel.template(['row', 'col'], function (data, index) {

            return {
                data: {
                   
                },

                list: data.rows,

                fn: function (item, index) {

                    return {
                        data: {},
                        list: item,

                        fn: function (item, index) {


                            return {
                                data: {
                                
                                    'value': item,
                                   
                                },
                            };
                        },
                    };
                },
            };
        });






    });


    panel.on('render', function (data) {


        panel.fill(data);


    });



    return panel.wrap();


});