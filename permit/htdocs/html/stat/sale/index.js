

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');


    var API = module.require('API');
    var Formater = module.require('Formater');
    var Table = module.require('Table');
    var Header = module.require('Header');



    API.on({
        'success': function (data) {
            Header.render();

            data = Formater.format(data);
            Table.render(data);
        },
    });




 

    Header.on({
        'print': function () {
            //打印前先隐藏部分组件。
            Header.hide();

            //同步模式，打印窗口关闭后会有返回值。
            var obj = document.execCommand('print');
            if (obj) {
                Header.show();
            }
        },
    });


    API.post();


    
});
