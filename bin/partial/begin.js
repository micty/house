

;( function (

    top,
    parent,
    window, 
    document,
    location,
    localStorage,
    sessionStorage,
    console,
    history,
    setTimeout,
    setInterval,

    $,
    jQuery,
    MiniQuery,
    KERP,


    Array, 
    Boolean,
    Date,
    Error,
    Function,
    Math,
    Number,
    Object,
    RegExp,
    String,
    undefined
) {

    var Module = KERP.require('Module');
    var define = Module.define;
    var require = Module.require;

    define('$', function () {
        return $;
    });

    define('MiniQuery', function () {
        return MiniQuery;
    });

    define('KERP', function () {
        return KERP;
    });
