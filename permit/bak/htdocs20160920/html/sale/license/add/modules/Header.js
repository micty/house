

define('/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

   
    var panel = KISP.create('Panel', '#div-header');


    var type$text = {
        0: '预售许可证',
        1: '现售备案',
    };


    panel.on('init', function () {

        panel.$.on('click', 'button', function () {

            panel.fire('submit');

        });

    });



    panel.on('render', function (data) {

        panel.fill({
            'text': type$text[data.type],
        });

    });


    return panel.wrap();


});