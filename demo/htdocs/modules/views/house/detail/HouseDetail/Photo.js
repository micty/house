

define('/HouseDetail/Photo', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Template = KISP.require('Template');

    var Albums = module.require('Albums');
    var Fields = module.require('Fields');

    var panel = KISP.create('Panel', '#div-house-detail-photo');
    var tabs = null;

    panel.on('init', function () {

        var liPhoto = panel.$.find('[data-id="photo"]').get(0);

        tabs = KISP.create('Tabs', {
            container: panel.$.find('ul[data-id="list"]').get(0),
            activedClass: 'on',
            eventName: 'click',
            looped: true,       //循环翻页
        });

        tabs.on('change', function (item, index) {

            Template.fill(liPhoto, {
                'src': item.url,
                'desc': item.desc,
                'no-desc': item.desc ? '' : 'no-desc',
            });
            
        });

        panel.$.on('click', '[data-cmd="prev"]', function () {
          
            tabs.previous();
        });

        panel.$.on('click', '[data-cmd="next"]', function () {
            tabs.next();
        });

    });




    panel.on('render', function (album, data) {

        var title = data.name + ' ' + album.name;
        panel.$.find('h3').html(title);

        tabs.render(album.list);
        tabs.active(0);

    });





    return panel.wrap();


});