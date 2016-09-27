
/**
* API。 
* 主要实现自动加上 token 字段。
*/
define('API', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');


    function API(name, config) {

        var User = require('User');
        var token = User.get('token');

        var api = KISP.create('API', name, config);
        var get = api.get.bind(api);
        var post = api.post.bind(api);

        api.get = function (data) {

            data = data || {};
            data.token = token;

            return get(data);
        };

        api.post = function (data, query) {

            query = query || {};
            query.token = token;

            console.log(name, data);
            return post({'data': data, }, query);
        };

   

        api.on('fail', function (code) {
            if (code == -1 || code == -2) {
                var msg = code == -2 ?
                    '会话已超时，请重新登录。' :
                    '请先登录再操作。';

                top.KISP.alert(msg, function () {
                    var Url = KISP.require('Url');
                    top.location.href = Url.root() + 'login.html';
                });

                //防止确定后再弹出页面自己的 alert，这是个临时办法。
                top.KISP.alert =
                    KISP.alert = function () { };
            }

           
        });



        return api;
    }


    return API;

});