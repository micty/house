
KISP.launch(function (require, module) {
   
    var $ = require('$');
    var Nav = module.require('Nav');

    //后退时触发
    Nav.on('back', function (current, target) {
        document.activeElement.blur(); // 关闭输入法
        current = require(module, current);
        target = require(module, target);
        current.hide();
        target.show();
    });


    //跳转到目标视图之前触发，先隐藏当前视图
    Nav.on('before-to', function (current, target) {
        current = require(module, current);
        current.hide();
    });

    //统一绑定视图跳转动作，在调用 Nav.to(...) 时会给触发
    Nav.on('to', function (name, arg0, arg1, argN) {
        var M = require(module, name);
        var args = [].slice.call(arguments, 1);
        M.render.apply(M, args);
    });




    var Header = module.require('Header');
    Header.render();

    Header.on({
        'home': function () {
            Nav.to('Master', 'events'); //这里是 events 不是 home
        },
        'area': function () {
            Nav.to('Master', 'area');
        },
        'town': function () {
            Nav.to('Master', 'town');
        },
        'happy': function () {
            Nav.to('Master', 'happy');
        },
        'keypoint': function () {
            Nav.to('Master', 'keypoint');
        },
        'recommend': function () {
            Nav.to('Master', 'recommend');
        },
        'news': function () {
            Nav.to('NewsList', 'news');
        },
        'policy': function () {
            Nav.to('NewsList', 'policy');
        },
        'contact': function () {
            Nav.to('Contact');
        },
    });


    var Sidebar = module.require('Sidebar');
    Sidebar.render();

    Sidebar.on({

        'home': function () {
            Nav.to('Master', 'events'); //这里是 events 不是 home
        },

        'area': function () {
            Nav.to('Master', 'area');
        },

        'town': function () {
            Nav.to('Master', 'town');
        },

        'happy': function () {
            Nav.to('Master', 'happy');
        },

        'keypoint': function () {
            Nav.to('Master', 'keypoint');
        },

        'recommend': function () {
            Nav.to('Master', 'recommend');
        },

        'news': function () {
            Nav.to('NewsList', 'news');
        },
        'policy': function () {
            Nav.to('NewsList', 'policy');
        },

        'contact': function () {
            Nav.to('Contact');
        },


    });

    var Aside = module.require('Aside');
    Aside.on({
        'recommend': function () {
            Nav.to('Master', 'recommend');
        },
    });

    Aside.render();

    var Houses = module.require('Houses');
    Houses.on('click', function (item) {
        Nav.to('Master', 'recommend');
        var Recommend = module.require('Recommend');
        Recommend.active(item);
    });


    var Policy = module.require('Policy');
    Policy.on({
        'list': function () {
            Nav.to('NewsList', 'policy');
        },
    });



    var Master = module.require('Master');
    Master.on({
        'render': function () {

            var Events = module.require('Events');
            Events.render();

            var Houses = module.require('Houses');
            Houses.render();

            var Keypoint = module.require('Keypoint');
            Keypoint.render();

            var Town = module.require('Town');
            Town.render();

            var Recommend = module.require('Recommend');
            Recommend.render();

            Policy.render();

        },
    });



    var Normal = module.require('Normal');
    Normal.on('before-render', function () {
        Header.hide();
    });

    var Message = require(module, 'Message');
    Message.on({
        'master': function () {
            Header.show();
            Nav.to('Master');
        },

        'paper': function (type, id, options) {
            Header.show();
            Nav.to('NewsDetail', type, id, options);
        },

        'happy': function (name) {
            Normal.render(name);
        },

    });


    Message.render();

    //给新闻详情页快捷调用弹出报名窗口
    window.showSignup = function () {
        var Signup = require('Signup');
        Signup.show();
    };

});

