


//控制器
; (function ($, MiniQuery, KERP) {


    var Login = require('Login');
    var WarnTip = require('WarnTip');


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