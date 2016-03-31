
define('Bridge', function (require, module) {

    //确保 iframe 和 top 指向同一个 Bridge
    if (window !== top) {
        return top.require(module.id);
    }



    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();

   

    function open(cmd, query, data) {
        emitter.fire('open', [cmd, query, data]);
    }



    return {
        'open': open,
        'on': emitter.on.bind(emitter),
        'fire': emitter.fire.bind(emitter), //仅供主控台调用
    };


});
