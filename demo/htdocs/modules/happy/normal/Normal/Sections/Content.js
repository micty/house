

define('/Normal/Sections/Content', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-panel-normal');
    var template = null;

    panel.on('init', function () {

        
        template = KISP.create('Template', '#div-normal-sections-content', {

            names: ['p'],

            fn: function (group, no) {

                var url = group.url;

                return {
                    list: group.items,

                    data: {
                        'title': group.title,
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


    panel.on('render', function (item) {

        template.fill([item]);
    });




    return panel.wrap();


});