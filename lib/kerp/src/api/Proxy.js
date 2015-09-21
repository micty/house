
/**
* 代理到本地，测试用
* @namespace
* @author micty
*/
define('Proxy', function (require, exports, module) {

    var $ = require('$');
    var Url = require('Url');
    var Debug = require('Debug');
    var Seajs = require('Seajs');
    var File = require('File');


    var name$file = {};     // {接口名称: 本地代理的处理文件名}，通过 config(obj) 指定。
    var url$config = {};    // {请求地址: 请求参数}


    function parseJSON(data) {

        try {
            return window.JSON.parse(data);
        }
        catch (ex) {
            try {
                data = data.replace(/^(\r\n)+/g, '');
                return (new Function('return ' + data))();
            }
            catch (ex) {
                return null;
            }
        }

        return null;

    }

    //模拟一个网络的随机延迟时间去执行一个回调函数
    function delay(fn) {

        if (!fn) {
            return;
        }

        var args = [].slice.call(arguments, 1); //提取后面的参数
        var timeout = $.Math.randomInt(500, 3000);

        setTimeout(function () {

            fn.apply(null, args);

        }, timeout);
    }



    function request(config) {

        var name = config.name;
        var file = name$file[name];

        if (file instanceof Array) { //当指定为一个数组时，则起作用的是最后一个
            file = file.pop();
        }

        if (!file) {
            return false;
        }


        if (File.isJs(file)) { // 映射的响应是 js 文件

            var url = Url.check(file) ? file : Url.root() + file;
            url = $.Url.randomQueryString(url); //增加随机查询字符串，确保拿到最新的

            url$config[url] = config; //把本次请求的参数保存下来

            Seajs.use(url, function (json) {

                if (!json) {
                    delay(config.error);
                    return;
                }

                var code = json['code'];
                if (code == 200) {
                    delay(config.success, json['data'] || {}, json);
                }
                else {
                    delay(config.fail, code, json['msg'], json);
                }
            });

            return true;
        }



        if (file === true) {
            file = name + '.json';
        }

        var url = Url.root() + file + '?r=' + Math.random();

        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);


        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.status != 200) {
                delay(config.error);
                return;
            }

            var json = parseJSON(xhr.responseText);

            if (!json) {
                delay(config.error);
                return;
            }

            var code = json['code'];
            if (code == 200) {
                delay(config.success, json['data'] || {}, json);
            }
            else {
                delay(config.fail, code, json['msg'], json);
            }

        };

        xhr.send(null);

        return true;


    }


    //可以生成很复杂的动态数据，并根据提交的参数进行处理。
    //具有真正模拟后台逻辑的能力。
    function response(action, fns) {

        //seajs
        //安全起见，这里用 seajs.Module.define 而非 window.define
        window.seajs.Module.define(function (require, exports, module) {

            var config = getConfig(module);
            var data = config.data;

            if ($.Object.isPlain(action)) { // response({})
                return action;
            }

            var fn = typeof action == 'function' ? action   // response(fn)
                : fns[data[action]];                        // response('', {})

            if (fn) {
                return fn(data, config) || {};
            }

            return {};

        });
    }



    function config(obj) {

        if (obj) { //set
            $.Object.extend(name$file, obj);
        }
        else { //get
            return $.Object.extend({}, name$file);
        }
    }


    function getConfig(url) {
        if (typeof url == 'object') { // module
            url = url['uri']; // module.uri
        }

        var obj = url$config[url];
        delete url$config[url]; //已获取使用了，没必要保留了

        return obj;
    }


    return {
        request: request,
        response: response,
        config: config,
    };

});

