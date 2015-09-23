



//可以生成很复杂的动态数据，并根据提交的参数进行处理。
//具有真正模拟后台逻辑的能力。
KERP.Proxy.response(function (data, config) {


    var pageSize = data.pageSize;
    var pageNo = data.pageNo;

    var total = 115;

    if (pageNo * pageSize > total) {
        pageSize = total - pageNo * pageSize;
    }

    var list = $.Array().pad(0, pageSize).keep(function (item, index) {

        return {
            'code': 'XWF-' + pageNo + pageNo + pageNo + '-' + index ,
            'name': '深圳仓',
            'full-name': '深圳地区仓库',
            'mnemonic-code': 'SZ' + pageNo + '-' + index,
            'administrator': '张三' + pageNo + '-' + index,
            'warehouse-address': '深圳市南山区科技园南区'.slice(0, $.Math.randomInt(3, 11)),
            'phone': '18818001890',
            'allow-minus-stock': '是',
            'manage-stock': '是',
            'stock-group': '是'
        };

    }).valueOf();

    return {

        code: 206,
        msg: 'ok',
        data: {
            total: total,
            list: list
        }

    }

});

