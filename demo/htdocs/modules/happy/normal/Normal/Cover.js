

define('/Normal/Cover', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');

    panel.on('init', function () {

        
       
    });


    panel.on('render', function (list) {


        var index = 0;
        var len = list.length;

        if (len == 0) {
            return;
        }


        var img = document.getElementById('img-normal-cover');

        setInterval(function () {
            var item = list[index];
            img.src = item;

            index++;
            if (index == len) {
                index = 0;
            }

        }, 4000);
    });




    return panel.wrap();


});