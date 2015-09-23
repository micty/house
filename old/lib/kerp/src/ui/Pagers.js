

/**
* 多个分页控件管理器
* @author micty
*/
define('Pagers', function (require, exports, module) {

    var $ = require('$');
    var Pager = require('Pager');
    var SimplePager = require('SimplePager');


    var extend = $.Object.extend;


    function create(config) {

        var container = config.container;


        var simple = new SimplePager(extend({}, config, {
            container: container.simple
        }));

        simple.on('change', function (no) {
            pager.to(no);
        });



        var pager = new Pager(extend({}, config, {
            container: container.normal
        }));

        pager.on('change', function (no) {
            simple.to(no);
        });


        simple.render();
        pager.render();

        return [simple, pager];

    }


    return {
        create: create
    };
});


