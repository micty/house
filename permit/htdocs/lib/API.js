
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

        return api;
    }


    return API;

});