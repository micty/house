/*
* 
*/
define('/Message', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    

    var panel = KISP.create('Panel');

    panel.on('render', function () {

        var p = Url.getQueryString(window) || {};

        
        var type = p.type;

        if (type) {

            panel.fire(type, [p.id, p]);

            return;
        }



        panel.fire('master');


    });


    return panel.wrap();





});



