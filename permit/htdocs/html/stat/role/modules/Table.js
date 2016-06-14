
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
   

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
                                
                                    'text': item.text,
                                    'name-value-class': item.isName ? 'name' : 'value',
                                    'group-class': item.group ? 'group' : '',
                                    'sub-group-class': item.subGroup ? 'sub-group' : '',
                                    'hidden-class': item.hidden ? 'hidden' : '',
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