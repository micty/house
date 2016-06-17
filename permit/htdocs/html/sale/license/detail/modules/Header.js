

define('/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var User = require('User');
   
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

        //有 land 字段，说明是导入的数据，在内存中的，不是真实的后台记录。
        var isTemp = 'land' in data;

        panel.$.toggleClass('noop', isTemp || !User.is('sale'));


    });


    return panel.wrap();


});