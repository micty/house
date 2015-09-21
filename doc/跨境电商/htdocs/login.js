


; (function (Lib, PageNs) {





var Login = (function () {

    var btn = document.getElementById('btnLogin');
    var txtName = document.getElementById('txtName');
    var txtPassword = document.getElementById('txtPassword');


    function reset(empty) {
        btn.disabled = false;
        btn.innerHTML = '登录';

        if (empty) {
            $(txtName).val('');
        }

        $(txtPassword).val('');

    }

    function disable() {
        btn.disabled = true;
        btn.innerHTML = '登录中...';
    }


    

    function login(name, password) {

        disable();

        Lib.API.post('login', {
            name: name,
            password: password

        }, function (data) {

            $.Cookie.set({
                name: 'userName',
                value: data.name,
                expires: '1M',
                path: '/'
            });

            $.Cookie.set({
                name: 'user',
                value: data,
                path: '/'
            });

            location.href = 'index.html#product/list.html';


        }, function (code, json) {
            alert(json.message);

            reset();

        }, function () {
            reset();
        });
    }

    function submit() {
        var name = $(txtName).val();
        var password = $(txtPassword).val();
        login(name, password);
    }



    function init() {

        var userName = $.Cookie.get('userName');
        if (userName) {
            $(txtName).val(userName);
            $(txtPassword).focus();
        }


        $(btn).click(function () {

            submit();

            return false;

        });

        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                submit();
            }
        });
    }


    return {

        init: init
    };


})();



//开始
(function () {


    
    Login.init();
    
    

})();
    



})(Lib, window.PageNs = window.PageNs || {});