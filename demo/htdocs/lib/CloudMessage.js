

/*
 * 云之家消息
 */


define('CloudMessage', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Mapper = MiniQuery.require('Mapper');
    var KISP = require('KISP');
    var CloudAPI = require('CloudAPI');

    var userInfo = require('UserInfo');
    var mapper = new Mapper();

    // 发送消息
    function CloudMessage(config, success, fail, error) {

        post(getFormatData(config), success, fail, error);

    }

    // 封装数据
    function getFormatData(config) {

        var eid = config.eid;

        var para = {
            pub: '',
            to: [{
                'no': eid,
                'user': getPhoneList(config.phones),
            }],
            list: [{
                'date': $.Date.format($.Date.now(), "yyyy-MM-dd"),
                'title': config.title,
                'text': config.msg,
                'zip': '',
                'url': config.url,
                'name': '',
                'pic': '',
            }],
            todo: 1  //1 待办 0 推送消息
        };

        return {
            'eid': eid,
            'type': 2,
            'data': JSON.stringify(para),
        };
    }

    // 获取电话数组
    function getPhoneList(data) {

        if (typeof data == 'string') {
            return [data];
        }

        if (data instanceof Array) {
            return data;
        }

        return [];

    }

    // 发送消息
    function post(data, success, fail, error) {

        // 消息通道非SSH,需要改写默认路径
        var api = new CloudAPI('Message/SendMessage', {
            url: 'http://mob.cmcloud.cn/ServerCloud/',
        });

        api.on({
            'success': function (data, json) {
                if (json.code == '200') {
                    success && success(data, json);
                } else {
                    fail && fail(json.msg);
                }
            },
            'fail': function (code, msg) {
                fail && fail(msg);
            },
            'error': function () {
                error && error();
            }
        });


        api.post(data);
    }


    CloudMessage.prototype = {
        constructor: CloudMessage,

        on: function (name, fn) {

        }
    }

    return CloudMessage;
});


