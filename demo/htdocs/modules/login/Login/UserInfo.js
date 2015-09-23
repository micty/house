/**
*
*/
define('/Login/UserInfo', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = KISP.require('MiniQuery');

    var Url = MiniQuery.require('Url');
    var UserInfo = require('UserInfo');


    

    function get(fn) {

        //游客身份这里是没有 ticket 的
        var qs = Url.getQueryString(window) || {};
        var eid = qs.eid;
        var openid = qs.openid;

        //测试用

        if (eid && openid) { //如果 url 中有

            fn && fn({ //用 url 中的查询参数去模拟用户信息
                'eid': eid,
                'openId': openid, //注意 key 中的 i 是大写 'I'
            });

            return;
        }

        //url 中没有用户信息，也不是在云之家中，则使用 config.js 中的
        if (!Url.hasQueryString(window, 'ticket')) { // 云之家环境会带上 ticket 参数

            var cfg = KISP.config('SSH.API');

            fn && fn({ //用 url 中的查询参数去模拟用户信息
                'eid': cfg.eid,
                'openId': cfg.openid, //注意 key 中的 i 是大写 'I'
            });
            return;
        }

        // <----------------------------- end for test



        //发布后，下面才是真正要用到的代码
        //从云之家获取
        var YunZhiJia = require('YunZhiJia');
        YunZhiJia.getcurUserInfo(function (data) { //成功

            fn && fn(data);

        }, function (errMsg) { //失败

            KISP.alert(errMsg, function () {
                YunZhiJia.closeWebApp();
            });
        });

    }


    return {
        get: get,
        set: UserInfo.set,
    };

});