


/**
* 用户信息模块
*/
define('/UserInfos', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KERP = require('KERP');



    var panel = document.getElementById('li-user-infos');

    var user = {
        'name': 'test',
        messageCount: 0,
    };


    function render() {


        //批量填充
        KERP.Template.fill({
            '#span-user-name': {
                name: user.name
            },
            '#span-message-count': {
                value: user.messageCount
            },
        });


        $(panel).hover(function () {
            show();
        }, function () {
            hide();
        });



        $('#btn-logout').on('click', function () {

            var btn = this;
            btn.innerHTML = '注销中...';
            $(btn).addClass('disabled');


           
        });

    }



    function show() {

        if ($(panel).hasClass('hover')) { //避免上次的隐藏动画还没结束又开始显示动画
            return;
        }

        $(panel).addClass('hover');
        $('#div-user-list').fadeIn();
    }

    function hide() {

        $('#div-user-list').fadeOut(function () {
            $(panel).removeClass('hover');
        });
    }




    return {
        render: render
    };

});




