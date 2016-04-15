

define('/HouseDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var Header = module.require('Header');
    var Summary = module.require('Summary');

    var view = KISP.create('Panel', '#div-view-house-detail');


    view.on('init', function () {

       
        API.on({
            'success': function (data) {

                Header.render(data);
                Summary.render(data);

            },
        });

        Summary.on({
            'change': function (album) {

            },
        });

    });




    view.on('render', function (id) {

        API.get(id);
    });



    return view.wrap();


});