

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');

    var Url = MiniQuery.require('Url');
    var Header = module.require('Header');
    var Base = module.require('Base');
    var Saled = module.require('Saled');



    Header.on('submit', function () {
        Bridge.open({
            name: '编辑预售许可证',
            url: 'html/sale/license/add/index.html?id=' + id,
        });
    });

    Base.on({
        'render': function (data) {
            Header.render(data);
        },
    });

    Saled.on({
        'detail': function (id) {
            var url = 'html/sale/saled/detail/index.html';
            if (id) {
                url += '?id=' + id;
            }
            else {
                url += '?key=' + key; //预览的
            }

            Bridge.open({
                name: '已售记录详情',
                url: url,
            });
        },
    });


    var qs = Url.getQueryString(window);

    //从内存中传完整数据过来的。 针对导入生成的预览。
    var key = qs.key;

    if (key) {
        var item = Bridge.data(key);
        
        Header.render(item.license, true);
        Base.render(item.license);
        Saled.render(item.saled);

        return;
    }





    //只传 id，需要读取后台。
    var id = qs.id;
    if (!id) {
        KISP.alert('请传入 id');
        return;
    }



    Base.render(id);
    Saled.render(id);


});
