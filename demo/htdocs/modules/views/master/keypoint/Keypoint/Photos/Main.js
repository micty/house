

define('/Keypoint/Photos/Main', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-keypoint-photos-main');


    panel.on('init', function () {



    });



    panel.on('render', function (item) {
       
        var $ = panel.$;

        $.find('img').attr('src', item.src);
        $.find('a').attr('href', item.href);
        $.find('div').html(item.title);
        
    });



    return panel.wrap();



});