

define('/Photo', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Header = module.require('Header');
    var Dialog = module.require('Dialog');
    var List = module.require('List');

    var panel = KISP.create('Panel', '#div-panel-photo');

    //记录一些数据。
    var current = {
        album: null,    //当前图集。
        index: -1,      //当前编辑的项所对应的 index。
    };

    var list = [];



    panel.on('init', function () {

       
        Header.on({
            'add': function (album) {
                Dialog.render(album.name);
            },

            'change': function (album) {
                current.album = album;
                List.render(album.list);
            },
        });



        List.on({
            'edit': function (item, index) {
                current.index = index;
                Dialog.render(item);
            },

            'delete': function (item, index) {
                var list = current.album.list;
                list.splice(index, 1);
                List.render(list);
            },
        });


        Dialog.on('submit', {
            'add': function (item) {
                var list = current.album.list;

                list.push(item);
                List.render(list);
            },

            'edit': function (item) {

                var list = current.album.list;

                list[current.index] = item;
                List.render(list);

            },
        });


    });



    panel.on('render', function (photos) {

        list = [
            { name: '封面图', list: [], },
            { name: '效果图', list: [], },
            { name: '位置图', list: [], },
            { name: '实景图', list: [], },
            { name: '样板间', list: [], },
            { name: '户型图', list: [], },
        ];


        if (photos) {
            var album$items = {};

            $.Array.each(photos, function (item) {

                var album = item.album;

                var items = album$items[album];
                if (!items) {
                    items = album$items[album] = [];
                }

                items.push(item);
            });

            $.Array.each(list, function (item, index) {

                var name = item.name;
                var items = album$items[name] || [];

                item.list = items;

            });
        }



        Header.render(list);


    });




    return panel.wrap({

        get: function () {

            var photos = [];
            $.Array.each(list, function (album) {
                photos = photos.concat(album.list);
            });

            return photos;
        },

       
    });

});