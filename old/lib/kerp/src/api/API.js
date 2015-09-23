
/**
* 请求后台 API 的接口类
* @namespace
* @author micty
*/
define('API', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Proxy = require('Proxy');

    var Mapper = MiniQuery.require('Mapper');
    var Emitter = MiniQuery.require('Emitter');

    var mapper = new Mapper();
    var guidKey = Mapper.getGuidKey();



    //默认配置
    var defaults = {};


    function parseJSON(data) {

        try {
            return window.JSON.parse(data);
        }
        catch (ex) {

        }

        try {
            data = data.replace(/^(\r\n)+/g, '');
            return (new Function('return ' + data))();
        }
        catch (ex) {

        }

        return null;

    }


    function ajax(config) {

        if (Proxy.request(config)) { //使用了代理
            return;
        }


        var url = defaults.url + config.name + '.do';
        var method = (config.method || 'get').toLowerCase();

        var data = config.data || null; //null 可能会在 xhr.send(data) 里用到
        if (data) {

            data = $.Object.map(data, function (key, value) {

                if (typeof value == 'object' && value) { //子对象编码成 JSON 字符串
                    return $.Object.toJson(value);
                }

                //其他的
                return value; //原样返回
            });

            data = $.Object.toQueryString(data);

            if (method == 'get') {
                url += '?' + data;
                data = null; //要发送的数据已附加到 url 参数上
            }
            else { // post
                var query = config.query;
                if (query) {
                    query = $.Object.toQueryString(query);
                    url += '?' + query;
                }
            }
        }


        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) {
                return;
            }

            var successCode = defaults.codes['success'];
            var fnError = config.error;

            if (xhr.status != successCode) {
                fnError && fnError(xhr);
                return;
            }

            var json = parseJSON(xhr.responseText);
            if (!json) {
                fnError && fnError(xhr);
                return;
            }

            var code = json['code'];
            if (code == successCode) {
                var fnSuccess = config.success;
                fnSuccess && fnSuccess(json['data'] || {}, json, xhr);
            }
            else {
                var fnFail = config.fail;
                fnFail && fnFail(code, json['msg'], json, xhr);
            }
        };

        if (method == 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(data);
    }



    /**
    * 构造器。
    */
    function API(name, config) {

        if (typeof name == 'object') { // 重载 API(config)
            config = name;
            name = config.name;
        }

        config = config || {};


        this[guidKey] = 'API-' + $.String.random();

        var codes = defaults.codes;

        var emitter = new Emitter(this);

        var meta = {
            'name': name,
            'data': config.data,
            'query': config.query,
            'status': '',
            'args': [],
            'emitter': emitter,
        };

        mapper.set(this, meta);

        $.Object.extend(meta, {

            fireEvent: function (status, args) {

                status = meta.status = status || meta.status;
                args = meta.args = args || meta.args;

                emitter.fire('done', args); //触发总事件
                emitter.fire(status, args); //触发命名的分类事件

                //进一步触发具体 code 对应的事件
                if (status == 'success') {
                    emitter.fire(codes['success'], args);
                }
                else if (status == 'fail') {
                    emitter.fire(args.shift(), args);
                }
            },

            success: function (data, json, xhr) { //成功
                meta.fireEvent('success', [data, json, xhr]);
            },

            fail: function (code, msg, json, xhr) { //失败
                meta.fireEvent('fail', [code, msg, json, xhr]);

            },

            error: function (xhr) { //错误
                meta.fireEvent('error', [xhr]);
            },
        });

        //预处理特定类型的事件
        var self = this;

        $.Array.each([
            'done',
            'success',
            'fail',
            'error',
            codes['success'],

        ], function (name, index) {

            name = name.toString(); //在绑定事件时，只识别 string 类型的名称

            var fn = config[name];
            if (fn) {
                self.on(name, fn);
            }
        });

    }

    //实例方法
    API.prototype = {
        constructor: API,

        /**
        * 发起 GET 网络请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] 请求的数据对象。
        *   该数据会给序列化成查询字符串以拼接到 url 中。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        get: function (data) {

            var meta = mapper.get(this);

            ajax({
                method: 'get',
                name: meta.name,
                data: data || meta.data,
                success: meta.success,
                fail: meta.fail,
                error: meta.error,
            });

            return this;
        },

        /**
        * 发起 POST 网络请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] POST 请求的数据对象。
        * @param {Object} [query] 查询字符串的数据对象。
        *   该数据会给序列化成查询字符串，并且通过 form-data 发送出去。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        post: function (data, query) {

            var meta = mapper.get(this);

            ajax({
                method: 'post',
                name: meta.name,
                data: data || meta.data,
                query: query || meta.query,
                success: meta.success,
                fail: meta.fail,
                error: meta.error,
            });

            return this;

        },

        /**
        * 请求完成时触发。
        * 不管请求完成后是成功、失败、错误，都会触发，会最先触发此类事件。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        done: function (fn) {
            this.on('done', fn);
            return this;
        },

        /**
        * 请求成功时触发。
        * 成功是指网络请求成功，且后台业务返回的数据包中的 code == 200 的情形。
        * @param {function} fn 回调函数。
        */
        success: function (fn) {
            this.on('success', fn);
            return this;
        },

        /**
        * 请求失败时触发。
        * 失败是指网络请求成功，但后台业务返回的数据包中的 code != 200 的情形。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        fail: function (fn) {

            this.on('fail', fn);
            return this;
        },

        /**
        * 请求错误时触发。
        * 错误是指网络请求不成功，如网络无法连接、404错误等。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        error: function (fn) {
            this.on('error', fn);
            return this;
        },

        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
    
            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            if (meta.status) {
                meta.fireEvent();
            }

            return this;

        },

        /**
        * 解除绑定事件。
        * 已重载 off({...}，因此支持批量解除绑定。
        * @param {string} [name] 事件名称。
        *   当不指定此参数时，则解除全部事件。
        * @param {function} [fn] 要解除绑定的回调函数。
        *   当不指定此参数时，则解除参数 name 所指定的类型的事件。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        off: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.off.apply(emitter, args);

            return this;
        },
    };


    //静态方法
    return $.Object.extend(API, {

        ajax: ajax,

        config: function (obj) {
            $.Object.extend(defaults, obj);
        }
    });

});


