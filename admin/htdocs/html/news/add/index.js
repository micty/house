

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    

   
    var ue = UE.getEditor('editor');


    $('#btn-submit').on('click', function () {

        var html = ue.getContent();
        console.log(html);
    });

    
});
