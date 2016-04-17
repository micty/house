

define('/Master', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var view = KISP.create('Panel', '#div-view-master');


    view.on('init', function () {

        

    });




    view.on('render', function (name) {


       

       
    });




    view.on('after-render', function (name) {
        if (name) {
            var p = $('[data-panel="' + name +'"]').offset();
            scrollTo(0, p.top);
        }

        view.fire('render');
    });



    return view.wrap();


});