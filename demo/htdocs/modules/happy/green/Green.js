﻿

define('/Green', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var Sections = module.require('Sections');
    var Summary = module.require('Summary');


    var view = KISP.create('Panel', '#div-view-green');


    view.on('init', function () {

        API.on({
            'success': function (data) {
                Summary.render(data.summary);
                Sections.render(data.sections);
            },
        });

    });


    view.on('render', function () {

      
        API.get('green');
    });



    return view.wrap();


});