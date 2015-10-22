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


        switch (type) {
            case 'happy':
                panel.fire('happy', [p.name]);
                break;


            case 'news':
            case 'policy':
            case 'house':

                panel.fire('paper', [type, p.id, p]);
                break;

            default:
                panel.fire('master');

        }




    });


    return panel.wrap();





});



