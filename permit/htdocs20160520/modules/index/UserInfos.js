


/**
* 用户信息模块
*/
define('/UserInfos', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Template = KISP.require('Template');
    var SessionStorage = require('SessionStorage');



    var user = null;
    var panel = KISP.create('Panel', '#ul-panel-user-infos');


    panel.on('init', function () {


        panel.$.hover(function () {

            show();

        }, function () {

            hide();
        });

        
        panel.$.on('click', '[data-cmd="logout"]', function () {

            SessionStorage.remove('user');
            panel.fire('logout');
        });


    });


    panel.on('render', function () {

        var user = SessionStorage.get('user');
        if (!user) {
            panel.fire('logout');
            return;
        }

        panel.fill({
            'name': user.name,
            'alias': user.alias,
            'message-count': user.messageCount || 0,
        });
    });





    function show() {

        if (panel.$.hasClass('hover')) { //避免上次的隐藏动画还没结束又开始显示动画
            return;
        }

        panel.$.addClass('hover');
        panel.$.find('[data-id="menus"]').fadeIn();
    }

    function hide() {

        panel.$.find('[data-id="menus"]').fadeOut(function () {
            panel.$.removeClass('hover');
        });
    }




    return panel.wrap();

});




