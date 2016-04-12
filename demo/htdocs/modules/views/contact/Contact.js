

define('/Contact', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var view = KISP.create('Panel', '#div-view-contact');


    view.on('init', function () {

        

    });




    view.on('render', function () {

       
    });

    view.on('after-render', function () {

        view.fire('render');
    });



    return view.wrap();


});