

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

   
    var API = module.require('API');


    API.on({
        'success': function (data, json) {
            //$('#txt-title').val('');
            //ue.setContent('');
        },

    });


    $('#btn-submit').on('click', function () {

        
        var title = $('#txt-title').val();
        if (!title) {
            alert('请输入标题');
            return;
        }

        var content = ue.getContent();
        if (!content) {
            alert('请输入内容');
            return;
        }

        API.post('news', title, content);


    });



    var ue = UE.getEditor('editor');

    
});
