

define('/HouseDetail/Summary/Albums', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-house-detail-summary-albums');

    var tabs = null;

    panel.on('init', function () {

        var img = panel.$.find('img').get(0);

        tabs = KISP.create('Tabs', {
            container: panel.$.find('ul').get(0),
            activedClass: 'on',
            eventName: 'click',
            looped: true,       //循环翻页
        });

        tabs.on('change', function (album, index) {

            var list = album.list;
            img.src = list[0].url;

            panel.fire('change', [album, index]);
        });

        panel.$.on('click', '[data-cmd="prev"]', function () {
            //debugger;
            tabs.previous();
        });

        panel.$.on('click', '[data-cmd="next"]', function () {
            tabs.next();
        });

    });




    panel.on('render', function (data) {

        tabs.render(data.albums);
        tabs.active(0);

    });



    return panel.wrap();


});