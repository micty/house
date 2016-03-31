﻿
KISP.launch(function (require, module) {

    top.require = require; //给 Iframe 模块使用，用于加载 IframeManager

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var IframeManager = require('IframeManager');

    var MenuData = module.require('MenuData');
    var Sidebar = module.require('Sidebar');
    var PageTabs = module.require('PageTabs');
    var PageList = module.require('PageList');
    var Iframes = module.require('Iframes');
    var Tips = module.require('Tips');
    var UserInfos = module.require('UserInfos');


    UserInfos.on({
        'logout': function () {
            location.href = 'login.html';
        },
    });
 


    //侧边栏
    Sidebar.on({
        //鼠标移进 Sidebar.item 时
        'click': function (item) {

            PageTabs.add(item); //安静模式，不触发事件
            PageList.add(item); //安静模式，不触发事件
            Iframes.add(item);  //会触发 active 事件
        },

    });




    //页签标签
    PageTabs.on({
        'active': function (item) {
            Iframes.active(item);   //会触发 active 事件
            PageList.active(item);  //安静模式，不触发事件
        },
        'remove': function (item) {
            Iframes.remove(item);  //会触发 remove 事件
            PageList.remove(item); //安静模式，不触发 remove 事件，但会触发 active 事件
        },
        'dragdrop': function (srcIndex, destIndex) {
            PageList.dragdrop(srcIndex, destIndex);
        },
        'before-close': function (item) {
            return IframeManager.fire('before-close', item);
        },
        'cancel-close': function (item) {
            return IframeManager.fire('cancel-close', item);
        },
        'close': function (item) {
            return IframeManager.fire('close', item);
        },

    });

    //页签列表
    PageList.on({
        'active': function (item) {
            Iframes.active(item);   //会触发 active 事件
            PageTabs.active(item);  //安静模式，不触发事件

        },
        'remove': function (item) { //如果移除的是当前的激活项，则会触发 active 事件
            Iframes.remove(item);
            PageTabs.remove(item); //安静模式，不触发事件

        },
        'clear': function () {
            Iframes.clear();
            PageTabs.clear();
        },
        'dragdrop': function (srcIndex, destIndex) {
            PageTabs.dragdrop(srcIndex, destIndex);
        },
        'before-close': function (item) {
            return IframeManager.fire('before-close', item);
        },
        'cancel-close': function (item) {
            return IframeManager.fire('cancel-close', item);
        },
        'close': function (item) {
            return IframeManager.fire('close', item);
        },
    });


    //iframe 页面
    Iframes.on({
        'active': function (item) {
            Sidebar.active(item);
            Tips.active(item);
            IframeManager.fire(item.id, 'active', [item]);
        },

        'non-active': function (item) {
            IframeManager.fire(item.id, 'non-active', [item]);
        },

        'load': function (item) {

        },
    });


  


    IframeManager.on('open', function (group, index, data) {

        MenuData.getItem(group, index, function (item) {


            if (!item) {
                return;
            }

            var query = data ? data.query : null;
            if (query) {
                var Url = MiniQuery.require('Url');

                //item.url = $.Url.addQueryString(item.url, query);
                //不能直接修改原对象的 url，否则可能会影响到原来的 url
                item = $.Object.extend({}, item, {
                    url: Url.addQueryString(item.url, query),
                });
            }

            PageTabs.add(item); //安静模式，不触发事件
            PageList.add(item); //安静模式，不触发事件
            Iframes.add(item, true); //强制刷新
        });
    });



    PageTabs.render();
    PageList.render();
    Iframes.render();
    UserInfos.render();


    //加载菜单数据
    MenuData.load(function (data) {

        Sidebar.render(data);

        //要自动打开的页面，请给菜单项设置 `autoOpen: true` 即可。
        var items = MenuData.getAutoOpens();

        $.Array.each(items, function (item, index) {
            PageTabs.add(item);
            PageList.add(item);
            Iframes.add(item);
        });


    });

});


