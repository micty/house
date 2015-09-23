/*
 * 主控制器。
 */
KISP.launch(function (require, module) {

    var UserInfo = require('UserInfo');
    var Nav = module.require('Nav');


    //后退时触发
    Nav.on('back', function (current, target) {
        document.activeElement.blur(); // 关闭输入法
        current = module.require(current);
        target = module.require(target);
        current.hide();
        target.show();
    });


    //跳转到目标视图之前触发，先隐藏当前视图
    Nav.on('before-to', function (current, target) {
        current = module.require(current);
        current.hide();
    });

    //统一绑定视图跳转动作，在调用 Nav.to(...) 时会给触发
    Nav.on('to', function (name, arg0, arg1, argN) {
        var M = module.require(name);
        var args = [].slice.call(arguments, 1);
        M.render.apply(M, args);
    });




    //业务处理类
    var ProductList = module.require('ProductList');


    var Master = module.require('Master');

    Master.on('hide-all', function () {
        ProductList.hide();

    });

    Master.on('change', {
        0: function () {
            ProductList.render();
        },
        1: function () {

        },
        2: function () {

        },
    });

    var Message = module.require('Message');
    Message.on({
        0: function (data) {
            Nav.to('Master', 0);
        },
        1: function (data) {
            Nav.to('Master', 1);
        },
        2: function (data) {
            Nav.to('Master', 3);
        },
    });

    var ProductList = module.require('ProductList');
    ProductList.on({
        'client': function () {
            Nav.to('ClientList');
        },
    });



    var ClientList = module.require('ClientList');
    ClientList.on({
        'select': function (item) {
            Nav.back();
            ProductList.render(item);
        },
    });



    //只有在获取用户身份并缓存成功后才能开始具体的页面切换，否则用户信息取的是旧的缓存信息
    var Login = module.require('Login');
    Login.on('done', function (data) {


        KISP.require('CloudHome').invoke('hideOptionMenu');
        Message.render();

        //Nav.to('Master', 0);
        //Nav.to(200, 'ClientList');


    });

    Login.render();
});




//for test
(function () {
    var Module = KISP.require('Module');
    var tree = Module.tree();
    console.log(tree);

    var modules = Module.modules();
    console.log(modules);


    //function ajax() {

    //}

    //var tid = null;

    //$(txt).on('input', function () {

    //    clearTimeout(tid);


    //    tid = setTimeout(function () {
    //        ajax();

    //    }, 500);
    //});

   
    
})();


