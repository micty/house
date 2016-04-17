

define('/NewsList', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');


    var view = KISP.create('Panel', '#div-view-news-list');

    var loading = null;
    var currentType = '';

    view.on('init', function () {

        loading = KISP.create('Loading', {
            text: '加载中...',
            background: 'none',
            cssClass: 'SameLine',
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




    view.on('render', function (type) {

        if (type == currentType && view.rendered() ) {
            return;
        }

        currentType = type;

        loading.show();

        Header.render(type);
        API.get(type);
       
    });




    view.on('after-render', function () {

        view.fire('render');
    });



    return view.wrap();


});