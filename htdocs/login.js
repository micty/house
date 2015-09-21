


//控制器
; (function ($, MiniQuery, KERP) {


    var Tabs = require('Tabs');
    var Login = require('Login');
    var WarnTip = require('WarnTip');


    Tabs.init(0);
    Login.init();


    $(document).on({
        'click': function () {
            WarnTip.hide();
        },

        'keydown': function () {
            if (event.keyCode == 13) {
                Login.login();
            }
        }
    });


    



    
})(jQuery, MiniQuery, KERP);