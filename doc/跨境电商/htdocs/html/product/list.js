


; (function (MiniQuery, Lib, PageNs) {








var Event = new MiniQuery.Event({});

var API = (function () {

    var pageSize = 10;

    function getList(pageNo, fn) {

        Lib.API.get('product/product', {

            pageNo: pageNo,
            pageSize: pageSize,
            cmd: 'getAll'

        }, function (data, json) {

            var list = $.Array.map(data.list, function (item, index) {
                return {
                    no: item.productCode,
                    name: item.productName,
                    location: item.wareHouseName,
                    amount: item.productNum || 0,
                    weight: item.productWeight,
                    importTime: $.Date( new Date(item.productTime)).format('yyyy-MM-dd')
                };
            });

            fn && fn(list, data.totalCount, pageSize);

        }, function (code, json) {
            //alert(json.message);
            Lib.LoadingTip.error(json.message, 2000);

        }, function () {
            alert('网络错误，请稍候再试');
        });

    }

    function getItem(productId, fn) {

        Lib.API.get('product/product', {

            id: productId,
            cmd: 'getSingle'

        }, function (data, json) {

            fn && fn(data.list, data.totalCount, pageSize);

        }, function (code, json) {
            //alert(json.message);
            Lib.LoadingTip.error(json.message, 2000);
        }, function () {
            //alert('网络错误，请稍候再试');
            Lib.LoadingTip.error('网络错误，请稍候再试', 2000);

        });
    }


    return {
        getList: getList,
        getItem: getItem
    };

})();








var Searcher = (function () {



    function get(productId) {

        API.getItem(productId, function (list, totalCount) {

            Event.trigger('data', [list, totalCount]);
        });

    }


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


    return {
        get: get
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

        $(div).find('tbody tr').click(function () {
            var tr = this;
            $(tr).toggleClass('selected');
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

    Event.bind('data', function (list, totalCount) {
        List.render(list);
        Lib.LoadingTip.success('加载成功', 1000);
    });


    API.getList(1, function (list, totalCount, pageSize) {

        Event.trigger('data', [list]);
        Pager.create(pageSize, totalCount);
        
    });

    

    

})();
    



})(MiniQuery, Lib, window.PageNs = window.PageNs || {});