

/**
* 管理主控台打开的 iframe 页面类，并在页间传递数据。
* 该模块仅供主控台页面使用。
* @author micty
*/
define('IframeManager', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();

    var sn$data = {};


    function getData(sn) {
        return sn$data[sn];
    }

    function setData(sn, data) {
        sn$data[sn] = data;
    }

    function removeData(sn) {
        delete sn$data[sn];
    }

    function open(no, index, data) {

        var sn = no + '-' + index;
        sn$data[sn] = data;

        emitter.fire('open', [no, index, data]);
    }

    


    function fire(sn, name, args) {
        
        if (typeof name == 'object') { //重载 fire(name, item)
            var item = name;
            name = sn;
            sn = item.id;
            args = [item];
        }


        var iframe = top.KISP.require('$')('iframe[data-sn="' + sn + '"]').get(0);
        if (!iframe) {
            throw new Error('不存在 sn 为 ' + sn + ' 的 iframe 页面');
        }

        var KERP = iframe.contentWindow.KERP;
        if (KERP) { // iframe 已加载完成
            var values = KERP.require('Iframe').fire(name, args);
            return values ? values[values.length - 1] : undefined;
        }


        //尚未加载完成
        $(iframe).one('load', function () {

            var KERP = iframe.contentWindow.KERP;
            KERP.require('Iframe').fire(name, args);

        });

    }


    return {
        open: open,
        getData: getData,
        setData: setData,
        removeData: removeData,
        on: emitter.on.bind(emitter),

        fire: fire,

        sn$data: sn$data, //for test
    };


});
