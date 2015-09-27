

define('/NewsList', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var List = module.require('List');


    var view = KISP.create('Panel', '#div-view-news-list');

    var loading = null;


    view.on('init', function () {

        loading = KISP.create('Loading', {
            text: '加载中...',
            background: 'none',
            cssClass: 'same-line',
            container: '#div-news-list-body',
            top: 600,
            color: '#000',
            left: '55%',

        });
        
        API.on({
            'response': function () {
                loading.hide();
            },

            'success': function (list) {

                List.render(list);
            },
        });


    });




    view.on('render', function () {

        if (view.rendered()) {
            return;
        }

 

        loading.show();
        API.get();
       
    });




    view.on('after-render', function () {

        view.fire('render');
    });



    return view.wrap();


});