

define('/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');


    
    var panel = KISP.create('Panel', '#div-header');
    
    panel.on('init', function () {

        var ul = panel.$.find('ul');

        var mask = KISP.create('Mask', {
            opacity: 0,
            volatile: true,
            eventName: 'click',
        });

        mask.on('hide', function () {
            ul.slideUp('fast');
        });

        panel.$.on('click', 'button', function click() {
            mask.show();
            ul.slideDown('fast');
        });
        
        ul.on('click', 'li', function () {

            mask.hide();
            ul.slideUp('fast');

            var cmd = this.getAttribute('data-cmd');
            panel.fire('import', [cmd]);
        });


    });



    panel.on('render', function () {

        panel.$.toggleClass('noop', !User.is('sale'));

    });



    return panel.wrap();



});