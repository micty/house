

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');
   
    var Bridge = require('Bridge');

    var API = module.require('API');
    var Photo = module.require('Photo');
    var Base = module.require('Base');
    var Content = module.require('Content');
    var Map = module.require('Map');
    var Footer = module.require('Footer');

    var id = 0; //当前数据记录的 id。
   


    API.on('success', {

        'post': function (data, json) {
            
            Bridge.open(['list', 'house2']);
        },

        'get': function (data) {
  
            Photo.render(data.photos);
            Base.render(data);
            Content.render(data.content);
            Map.render(data.map);
            Footer.render();
        },

    });




    Footer.on('submit', function () {

        var base = Base.get();
        var photos = Photo.get();
        var content = Content.get();
        var map = Map.get();

        if (!base) {
            return;
        }

        var data = $.Object.extend({}, base, {
            'id': id,
            'photos': photos,
            'content': content,
            'map': map,
        });

        API.post(data);
       
    });

    
   

    id = Url.getQueryString(window, 'id');

    if (id) { //说明是编辑的
        API.get(id);
        return;
    }


    //add
    Photo.render();
    Base.render();
    Content.render();
    Map.render();
    Footer.render();

});
