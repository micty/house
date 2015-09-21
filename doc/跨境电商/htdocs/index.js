


; (function (MiniQuery, Lib, PageNs) {

MiniQuery.use('$');


var Sidebar = PageNs.Sidebar = (function () {

    var ul = document.getElementById('ulSidebar');

    var samples = $.String.getTemplates(ul.innerHTML, [
        {
            name: 'group',
            begin: '<!--',
            end: '-->',
            outer: '{groups}'
        },
        {
            name: 'item',
            begin: '#--item.begin--#',
            end: '#--item.end--#',
            outer: '{items}'
        }
    ]);

    var activedItemId = '';
    var id$item = {};

    var list = [
        {
            name: '系统管理',
            iconClass: 'icon-briefcase',
            items: [

                {
                    name: '用户列表',
                    url: 'system/users.html',
                    isActive: true
                }
            ]
        },
        {
            name: '产品管理',
            iconClass: 'icon-th-large',
            items: [
                {
                    name: '新增产品',
                    url: 'product/add.html'
                },
                {
                    name: '导入产品',
                    url: 'product/import.html'
                },
                {
                    name: '产品列表',
                    url: 'product/list.html'
                },
            ]
        },
        {
            name: '订单管理',
            iconClass: 'icon-list-alt',
            items: [
                {
                    name: '录入订单',
                    url: 'order/add.html'
                },
                {
                    name: '导入订单',
                    url: 'order/import.html'
                },
                {
                    name: '订单列表',
                    url: 'order/list.html'
                }
            ]
        },

    ];





    function render(initialActivedUrl) {

        var activeId;

        ul.innerHTML = $.Array.map(list, function (group, index) {

            return $.String.format(samples['group'], {

                name: group.name,
                iconClass: group.iconClass,

                items: $.Array.map(group.items, function (item, i) {

                    var id = $.String.format('{0}_{1}', index, i);
                    id$item[id] = item;

                    item.id = id; //增加一个 id 成员

                    
                    if (initialActivedUrl) {
                        if (initialActivedUrl == item.url) {
                            activeId = id;
                        }
                    }
                    else {
                        if (item.isActive) {
                            activeId = id;
                        }
                    }

                    return $.String.format(samples['item'], {
                        name: item.name,
                        url: item.url,
                        id: id
                    });

                }).join('')
            });

        }).join('');

        if (activeId) {
            active(activeId);
        }

    }




    function active(id, notTriggerEvent) {

        if (activedItemId) {
            $('#' + activedItemId).removeClass('active');
        }

        var itemId = $.String.format('sidebar_item_{0}', id);
        $('#' + itemId).addClass('active');
        activedItemId = itemId;

        var item = id$item[id];
        location.hash = '#' + item.url;

        document.title = item.name;

        if (notTriggerEvent !== true) { //明确指定 true 时才不触发事件
            
            MiniQuery.Event.trigger(Sidebar, 'itemactive', [item, id]);
        }

    }



    return {
        render: render,
        active: active,


        on: function (name, fn) {
            MiniQuery.Event.bind(Sidebar, name, fn);
        },

        getItem: function (id) {
            return id$item[id];
        }
    };



})(); // 结束 Sidebar 模块



var FrameTabs = PageNs.FrameTabs = (function () {

    var list = [];
    var div = document.getElementById('divFrameTabs');
    var sample = $.String.between(div.innerHTML, '<!--', '-->');

    var activedItemId = '';



    function render() {

        div.innerHTML = $.Array.map(list, function (item, index) {

            return $.String.format(sample, {
                name: item.name,
                id: item.id
            });
        }).join('');
    }

    function add(id) {

        var item = $.Array.findItem(list, function (item, index) {
            return item.id == id;
        });

        if (!item) {
            item = Sidebar.getItem(id);
            list.push(item)

            render();
        }

        active(id);


    }

    function remove(id, event) {

        var removedIndex;

        list = $.Array.grep(list, function (item, index) {

            if (item.id == id) {
                removedIndex = index;
                return false;
            }

            return true;
        });
        
        render();

        var index = Math.max(removedIndex - 1, 0);
        var item = list[index];
        active(item.id);

        //阻止事件冒泡
        event = event || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else { //IE
            event.cancelBubble = true;
        }

        MiniQuery.Event.trigger(FrameTabs, 'itemremove', [id]);

    }


    function active(id) {
        
        if (activedItemId) {
            $('#' + activedItemId).removeClass('active');
        }

        var itemId = $.String.format('frametabs_item_{0}', id);
        $('#' + itemId).addClass('active');
        activedItemId = itemId;
        
        MiniQuery.Event.trigger(FrameTabs, 'itemactive', [id]);
    }

    


    return {
        render: render,
        add: add,
        remove: remove,
        active: active,

        on: function (name, fn) {
            MiniQuery.Event.bind(FrameTabs, name, fn);
        }
    };

})(); //结束 FrameTabs 模块


var Iframes = (function () {

    var div = document.getElementById('divIframes');

    var activedItemId = '';

    function add(id) {

        var iframeId = getIframeId(id);
        var iframe = document.getElementById(iframeId);

        if (!iframe) {
            iframe = document.createElement('iframe');

            var item = Sidebar.getItem(id);
            $.Object.extend(iframe, {
                src: $.String.format('html/{0}?r={1}', item.url, Math.random()),
                frameborder: 0,
                id: iframeId
            });

            div.appendChild(iframe);
        }

        active(id);

    }

    function remove(id) {
        var iframeId = getIframeId(id);
        var iframe = document.getElementById(iframeId);

        var prevIframe = $(iframe).prev()
        div.removeChild(iframe);


    }

    function getIframeId(id) {
        return $.String.format('iframes_item_{0}', id);
    }


    function active(id) {
        if (activedItemId) {
            $('#' + activedItemId).removeClass('active');
        }

        var itemId = $.String.format('iframes_item_{0}', id);
        $('#' + itemId).addClass('active');
        activedItemId = itemId;
    }


    return {
        add: add,
        remove: remove
    };

})(); //结束 Iframes 模块


var WidthSwitcher = (function () {


    var btn = $('#btnSwitchWidth');
    var wrapper = $('#divWrapper');

    var compress = 'fa-compress';
    var expand = 'fa-expand';
    var full = 'full-wrapper';

    function afterFull() {
        wrapper.addClass('full-wrapper');
        $(btn).removeClass(expand).addClass(compress);
    }

    function afterNormal() {
        wrapper.removeClass(full);
        btn.removeClass(compress).addClass(expand);
    }

    function init() {

        btn.click(function () {
            if (wrapper.hasClass(full)) { //变成窄屏
                wrapper.animate({ width: '1100px' }, 'normal', afterNormal);
            }
            else { //变成宽屏
                wrapper.animate({ width: '100%' }, 'normal', afterFull);
            }
        });
    }

    return {

        init: init
    };

    

})();


var UserInfos = PageNs.UserInfos = (function () {

    var a = document.getElementById('aUserInfos');
    var ul = document.getElementById('ulUserInfos');
    var div = a.parentNode;

    var sample = $.String.between(a.innerHTML, '<!--', '-->');


    
    function render(user) {

        if (!user) {
            var cookie = $.Cookie.toObject(true);
            user = cookie['user'];
        }

        a.innerHTML = $.String.format(sample, {
            name: user.name
        });


        var isInside = false;

        $(div).hover(function () {

            isInside = true;
            console.log('-->in');

            setTimeout(function () {
                if (isInside) {
                    $(ul).slideDown();
                }
            }, 200);

        }, function () {

            isInside = false;
            console.log('out-->');

            setTimeout(function () {
                if (!isInside) {
                    $(ul).slideUp();
                }
            }, 200);
        });
    }

    function logout() {
        $.Cookie.remove({
            name: 'user',
            path: '/'
        });

        Lib.API.post('logout');

        location.href = 'login.html';
    }

    return {
        render: render,
        logout: logout
    };

})();
    


//开始，控制器
(function () {

    Sidebar.on('itemactive', function (item, id) {
        FrameTabs.add(id);
    });


    FrameTabs.on({
        'itemactive': function (id) {
            Sidebar.active(id, true); //不触发 Sidebar 中的 itemactive 事件；否则就死循环了
            Iframes.add(id);
        },
        'itemremove': function (id) {
            Iframes.remove(id);
        }
    });

    var hash = location.hash.slice(1);
    Sidebar.render(hash);


    WidthSwitcher.init();
    UserInfos.render();

    

})();
    



})(MiniQuery, Lib, window.PageNs = window.PageNs || {});