

define('/Normal/Summary', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-normal-sections-summary');
    var template = null;



    panel.on('init', function () {

        template = KISP.create('Template', '#div-normal-sections-summary', {

            names: ['p'],

            fn: function (group, no) {

                var url = group.url;

                return {
                    list: group.items,

                    data: {
                        'url': url,
                        'more-display': url ? '' : 'display: none;',
                    },

                    fn: function (item, index) {
                        return {
                            data: {
                                'desc': item,
                            },
                        };
                    },
                };
            },


        });
       
    });


    panel.on('render', function (data) {

        template.fill([data]);

        
    });




    return panel.wrap();


});