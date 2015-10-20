

define('/Normal', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var Cover = module.require('Cover');
    var Photo = module.require('Photo');
    var Sections = module.require('Sections');
    var Summary = module.require('Summary');


    var view = KISP.create('Panel', '#div-view-normal');


    view.on('init', function () {

        API.on({
            'success': function (data) {

                Cover.render(data.covers);
                Photo.render(data.photos);
                Summary.render(data.summary);
                Sections.render(data.sections);
            },
        });

    });

    view.on('before-render', function () {
        view.fire('before-render');
    });

    view.on('render', function (type) {

        view.$.addClass('panel-' + type + '-detail');
        API.get(type);
    });



    return view.wrap();


});