

define('/Town', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-panel-town');


    panel.on('init', function () {

        var list = panel.$.find('[data-name]');

        panel.$.on('mouseover', 'area', function () {

            var alt = this.getAttribute('alt');

            list.each(function (index) {
                var name = this.getAttribute('data-name');

                $(this).toggle(name == alt);
                
            });

        });


    });



    panel.on('render', function () {
       

        
    });



    return panel.wrap();



});