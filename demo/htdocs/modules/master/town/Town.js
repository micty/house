

define('/Town', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-panel-town');
    var stopped = false;


    panel.on('init', function () {

        var index = 0;
        var list = panel.$.find('[data-name]');

        panel.$.on('mouseover', 'area', function () {

            var alt = this.getAttribute('alt');

            list.each(function (i) {
                var name = this.getAttribute('data-name');
                var isCurrent = name == alt;

                if (isCurrent) {
                    index = i; //记录用户激活的当前项的 index，以便在自动轮播放时可以接着当前索引
                }

                $(this).toggle(isCurrent);

                
            });

        });


        setInterval(function () {

            if (stopped) {
                return;
            }

            index++;
            if (index >= list.length) {
                index = 0;
            }


            list.each(function (i) {
                $(this).toggle(i == index);

            });

        }, 4000);


        panel.$.on({
            'mouseover': function () {
                stopped = true;
            },
            'mouseout': function () {
                stopped = false;
            },
        });


    });



    panel.on('render', function () {
       

        
    });



    return panel.wrap();



});