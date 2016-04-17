
KISP.launch(function (require, module, nav) {
   
    var $ = require('$');


    var Header = module.require('Header');
    Header.render();

    Header.on({
        'home': function () {
            nav.to('Master', 'header'); //这里是 header 不是 home
        },
        'area': function () {
            nav.to('Master', 'area');
        },
        'town': function () {
            nav.to('Master', 'town');
        },
        'happy': function () {
            nav.to('Master', 'happy');
        },
        'keypoint': function () {
            nav.to('Master', 'keypoint');
        },
        'recommend': function () {
            nav.to('Master', 'recommend');
        },
        'news': function () {
            nav.to('NewsList', 'news');
        },
        'policy': function () {
            nav.to('NewsList', 'policy');
        },
        'contact': function () {
            nav.to('Contact');
        },
    });


    var Sidebar = module.require('Sidebar');
    Sidebar.render();

    Sidebar.on({

        'home': function () {
            nav.to('Master', 'header'); //这里是 header 不是 home
        },

        'area': function () {
            nav.to('Master', 'area');
        },

        'town': function () {
            nav.to('Master', 'town');
        },

        'happy': function () {
            nav.to('Master', 'happy');
        },

        'keypoint': function () {
            nav.to('Master', 'keypoint');
        },

        'recommend': function () {
            nav.to('Master', 'recommend');
        },

        'news': function () {
            nav.to('NewsList', 'news');
        },
        'policy': function () {
            nav.to('NewsList', 'policy');
        },

        'contact': function () {
            nav.to('Contact');
        },


    });

    var Aside = module.require('Aside');
    Aside.on({
        'recommend': function () {
            nav.to('Master', 'recommend');
        },
    });

    Aside.render();

    var Houses = module.require('Houses');
    Houses.on({
        'activity': function () {
            nav.to('ActivityRecommend');
        },
        'item': function (item) {
            nav.to('Master', 'recommend');
            var Recommend = module.require('Recommend');
            Recommend.active(item);
        },
    });


    var Policy = module.require('Policy');
    Policy.on({
        'list': function () {
            nav.to('NewsList', 'policy');
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

    var Router = require(module, 'Router');
    Router.on({
        'master': function () {
            Header.show();
            nav.to('Master');
        },

        'paper': function (type, id, options) {
            Header.show();
            nav.to('NewsDetail', type, id, options);
        },

        'happy': function (name) {
            Normal.render(name);
        },

        'house2': function (id) {
            nav.to('HouseDetail', id);

        },
    });


    Router.render();

    //给新闻详情页快捷调用弹出报名窗口
    window.showSignup = function () {
        var Signup = require('Signup');
        Signup.show();
    };

    //给新闻详情页快捷调用弹出活动报名窗口
    window.showActivitySignup = function () {
        var ActivitySignup = require('ActivitySignup');
        ActivitySignup.show();
    };
});


(function (console) {
    if (!console) {
        return;
    }

    console.log(
        '本网站由%c邓良太%c独立完成开发\n' +
        'QQ：366387469\n' +
        '职位：Web前端开发工程师\n' +
        'GitHub：https://github.com/micty',
            'color:blue', 'color:black');

})(window.console);