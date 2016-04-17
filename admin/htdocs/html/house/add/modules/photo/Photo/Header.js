

define('/Photo/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-photo-header');
    var current = null;
   

    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$.find('[data-id="tabs"]').get(0),
            activedClass: 'on',
            eventName: 'click',
        });

        tabs.on('change', function (album, index) {
            current = album;

            panel.fire('change', [album, index]);
        });


        panel.$.on('click', '[data-cmd="add"]', function () {

            panel.fire('add', [current]);


        });
       

    });



    panel.on('render', function (albums) {

        tabs.render(albums);
        tabs.active(0);

    });




    return panel.wrap({});

});