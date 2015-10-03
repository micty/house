

/**
* 获取主控台打开的当前的 Iframe 页面类。
* @author micty
*/
define('Iframe', function (require, exports, module) {

    if (window === top) { //说明加载环境是 top 页面，即主控台页
        return require('IframeManager');
    }


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();

    //这里的模块名称是 Iframe 而非 IframeManager
    var IframeManager = top.KERP.require('Iframe'); 


    var iframe = null;  //当前 iframe 页面对象的 iframe DOM 对象。
    var infos = null;   //当前 iframe 页面的信息对象，运行时确定。


    function get(key) {

        if (key) { //重载。 如 get('id')、get('sn')
            var infos = getInfos();
            return infos ? infos[key] : undefined;
        }


        if (iframe) {
            return iframe;
        }

        var iframes = top.KISP.require('$')('iframe').toArray();

        iframe = $.Array.findItem(iframes, function (iframe, index) {
            return iframe.contentDocument === window.document;
        });

        return iframe;
    }



    /**
    * 获取当前 iframe 页面的信息对象，这些信息在运行时就确定。
    */
    function getInfos() {

        var iframe = get();
        if (!iframe) {
            return null;
        }

        var src = iframe.src;

        if (infos) { //读缓存

            //这两个字段在运行后可能会发生变化，需重新获取。
            return $.Object.extend(infos, {
                'hash': $.Url.getHash(src),
                'actived': $(iframe).hasClass('actived'),
            });
        }
        

        var location = iframe.contentDocument.location;
        var url = location.origin + location.pathname;
        
        var originalSrc = iframe.getAttribute('src');

        var Url = MiniQuery.require('Url');

        infos = {
            'type': iframe.getAttribute('data-type'), // iframe 的类型
            'id': iframe.id,
            'index': iframe.getAttribute('data-index'),
            'src': src,
            'originalSrc': originalSrc, //原始的 src，即在 DOM 查看器中看到的值
            'path': originalSrc.split('?')[0],
            'url': url,
            'sn': iframe.getAttribute('data-sn'),
            'query': Url.getQueryString(src),
            'hash': Url.getHash(src),
            'actived': $(iframe).hasClass('actived'),
            
        };

        return infos;

    }



    function open(no, index, data) {
        IframeManager.open(no, index, data);
    }





    function getData(key) {
        var sn = get('sn');
        var data = IframeManager.getData(sn);

        if (!data) { //尚不存在数据
            return;
        }

        return arguments.length == 0 ? data : data[key];
    }

    function setData(key, data) {

        var sn = get('sn');

        if (arguments.length == 1) { // 重载 setData(data)
            data = key;
            IframeManager.setData(sn, data); //全量覆盖
            return;
        }

        
        var all = IframeManager.getData(sn) || {};
        all[key] = data;

        IframeManager.setData(sn, all);
    }

    function removeData(key) {

        var sn = get('sn');

        if (arguments.length == 0) { //重载 removeData()，全部移除
            IframeManager.removeData(sn);
            return;
        }

        var data = IframeManager.getData(sn);
        if (!data) {
            return;
        }

        delete data[key];
        IframeManager.setData(sn, data);
    }


    function getDialog() {

        var Dialog = require('Dialog');
        var sn = get('sn');

        var key = Dialog.getKey(sn, 'dialog');

        return IframeManager.getData(key);
    }


    return {
        get: get,
        getInfos: getInfos,
        getData: getData,
        setData: setData,
        removeData: removeData,
        getDialog: getDialog,
        open: open,

        on: emitter.on.bind(emitter),
        
        //该接口仅供主控制台调用。
        fire: emitter.fire.bind(emitter),
    };


});
