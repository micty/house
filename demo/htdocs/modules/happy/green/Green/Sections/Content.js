

define('/Green/Sections/Content', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-panel-green');
    var template = null;

    panel.on('init', function () {

        
        template = KISP.create('Template', '#div-green-sections-content', {

            names: ['p'],

            fn: function (group, no) {
                return {
                    list: group.items,

                    data: {
                        'title': group.title,
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


    panel.on('render', function (item) {

        template.fill([item]);
    });




    return panel.wrap();


});