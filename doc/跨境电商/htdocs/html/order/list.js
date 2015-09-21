
; (function (Lib, PageNs) {



var Event = new MiniQuery.Event({});

var API = (function () {

    var pageSize = 10;

    function getList(pageNo, fn) {

        var config = {
            pageNo: 1,
            pageSize: pageSize,
            status: 2,
            cmd: 'getAll'
        };

        if (typeof pageNo == 'number') {
            config.pageNo = pageNo;
        }
        else {
            $.Object.extend(config, pageNo);
        }


        Lib.API.get('order/order', config, function (data, json) {

            var list = $.Array.map(data.list, function (item, index) {
                return {
                    status: item.statusName,
                    no: item.orderCode,
                    cost: item.ordercol,
                    interflow: item.logisticsName,
                    buyerid: 'buyerid',
                    country: item.orderCountry
                };
            });

            fn && fn(list, data.totalCount, pageSize);

        }, function (code, json) {
            alert(json.message);
        }, function () {
            alert('网络错误，请稍候再试');
        });

    }

    function getItem(orderId, fn) {

        Lib.API.get('order/order', {

            id: productId,
            cmd: 'getSingle'

        }, function (data, json) {

            fn && fn(data.list, data.totalCount, pageSize);

        }, function (code, json) {
            alert(json.message);
        }, function () {
            alert('网络错误，请稍候再试');
        });
    }


    return {
        getList: getList,
        getItem: getItem
    };

})();


//订单状态
var StatusList = (function () {

    var select = document.getElementById('sltStatusList');
    var sample = $.String.between(select.innerHTML, '<!--', '-->');

    var list = [];


    function load(fn) {

        Lib.API.get('order/orderField', {

            cmd: 'orderStatus'

        }, function (data, json) {

            data = [{
                status: '全部',
                id: 0
            }].concat(data);

            var list = $.Array.map(data, function (item, index) {

                return {
                    index: index,
                    name: item.status,
                    value: item.id
                };
            });

            fn && fn(list);

        }, function (code, json) {

            alert(json.message);

        }, function () {

            alert('网络出错，请稍候再试');

        });
    }

    function render() {
        
        load(function (data) {

            list = data;

            select.innerHTML = $.Array.map(list, function (item, index) {
                return $.String.format(sample, item);
            }).join('');
        });

        $(select).change(function () {
            
            Lib.LoadingTip.info('加载中，请稍候...');

            var item = list[select.selectedIndex];

            API.getList({ status: item.value }, function (list, totalCount, pageSize) {

                Event.trigger('data', [list, totalCount, pageSize]);

            });
        });
        
    }

    return {
        render: render
    };

})();




var Searcher = (function () {

    function get(productId) {

        API.getItem(productId, function (list, totalCount, pageSize) {

            Event.trigger('data', [list, totalCount, pageSize]);
        });

    }


    function init() {

        $('#btnSearch').click(function (event) {

            var productId = $('#txtProductId').val();
            if (!productId) {
                alert('请输入产品编号再搜索');
                return;
            }


            get(productId);
            return false; //阻止表单的默认提交行为
            //event.preventDefault();//阻止表单的默认提交行为


        });
    }


    return {
        get: get,
        init: init
    };



})();



var List = (function () {


    var div = document.getElementById('divList');

    var samples = $.String.getTemplates(div.innerHTML, [
        { name: 'table', begin: '<!--', end: '-->' },
        { name: 'tr', begin: '#--tr.begin--#', end: '#--tr.end--#', outer: '{trs}' }
    ]);


    var list = [];


    function render(data) {

        list = data;

        div.innerHTML = $.String.format(samples['table'], {
            'trs': $.Array.map(list, function (item, index) {
                return $.String.format(samples['tr'], item);

            }).join('')
        });
    }


    return {
        render: render
    };


})();



var Pager = (function () {


    function create(pageSize, totalCount) {

        var timeoutId;

        var pager = Lib.Pager.create({
            pageSize: pageSize,
            totalCount: totalCount,

            pagechange: function (pageNo) {

                Lib.LoadingTip.info('加载中，请稍候...');
                clearTimeout(timeoutId);

                timeoutId = setTimeout(function () {

                    API.getList(pageNo, function (list) {
                        
                        Event.trigger('data', [list]);
                    });

                }, 250);
            }
        });


        pager.render();
    }


    return {
        create: create
    };
})();




//开始，控制器
(function () {

    Event.bind('data', function (list, totalCount, pageSize) {
        List.render(list);
        Lib.LoadingTip.success('加载成功', 1000);

        if (arguments.length == 3) {
            Pager.create(pageSize, totalCount);
        }
    });

    StatusList.render();

    API.getList(1, function (list, totalCount, pageSize) {

        Event.trigger('data', [list, totalCount, pageSize]);

    });





})();


    



})(Lib, window.PageNs = window.PageNs || {});