

define('/Keypoint/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var ul = document.getElementById('ul-keypoint-photos-tabs');
    var panel = KISP.create('Panel', ul);
    var tabs = null;

    var list = [];

    var stopped = false;

    panel.on('init', function () {

        var index = 0;


        tabs = KISP.create('Tabs', {
            container: ul,
            activedClass: 'on',
            eventName: 'mouseover',

            change: function (item, i) {
                index = i;
                panel.fire('change', [item]);
            },
        });



        setInterval(function () {

            if (stopped) {
                return;
            }

            index++;
            if (index >= list.length) {
                index = 0;
            }

            tabs.active(index);

            

        }, 4000);


    });


    panel.on('render', function (data) {

        list = data;

        tabs.render(list, function (item, index) {
            return {
                'no': index + 1,
            };
        });

        tabs.active(0);
    });





    return panel.wrap({
        start: function () {
            stopped = false;
        },

        stop: function () {
            stopped = true;
        },
    });



});