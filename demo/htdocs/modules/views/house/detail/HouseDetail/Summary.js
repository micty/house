

define('/HouseDetail/Summary', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Template = KISP.require('Template');

    var panel = KISP.create('Panel', '#div-house-detail-summary');
    var tabs = null;
    var fields = null;

    panel.on('init', function () {

        fields = panel.$.find('[data-id="fields"]').get(0);

        var img = panel.$.find('[data-id="photo"]').get(0);

        tabs = KISP.create('Tabs', {
            container: panel.$.find('[data-id="tabs"]').get(0),
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
            tabs.previous();
        });

        panel.$.on('click', '[data-cmd="next"]', function () {
            tabs.next();
        });

    });




    panel.on('render', function (data) {


        tabs.render(data.albums);
        tabs.active(0);

        Template.fill(fields, data);


    });





    return panel.wrap();


});