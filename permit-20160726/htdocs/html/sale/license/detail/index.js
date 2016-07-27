

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');

    var Url = MiniQuery.require('Url');

    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');


    API.on('success', {
        'get': function (data) {
            Header.render(data);
            Form.render(data);
        },

    });


    Header.on('submit', function () {
        Bridge.open({
            name: '编辑预售许可证',
            url: 'html/sale/license/add/index.html?id=' + id,
        });
    });




    var qs = Url.getQueryString(window);

    //从内存中传完整数据过来的。
    var key = qs.key;

    if (key) {
        var item = Bridge.data(key);

        Header.render(item);
        Form.render(item);
        return;
    }


    //只传 id，需要读取后台。
    var id = qs.id;
    if (!id) {
        KISP.alert('请传入 id');
        return;
    }

    API.get(id);

});
