


//设置 MiniQuery 对外挂靠的别名
var MiniQuery = require('MiniQuery');
MiniQuery.use('$');




//设置对外暴露的模块
Module.expose({

    'Module': true, //注意，这个是页面级别的 Module
    'Cache': true,
    'Debug': true,
    'File': true,
    'Url': true,
    'Multitask': true,
    'Tree': true,

    'Seajs': true,

    //api
    'Proxy': true,
    'API': true,

    //ui
    'Iframe': true,
    'IframeManager': false, //这个不要在这里暴露，因为它通过 Iframe 暴露了

    'ButtonList': true,
    'CascadeMenus': false,
    'CascadeNavigator': true,
    'CascadePath': false,
    'CascadePicker': true,
    'Dialog': true,
    'Loading': true,
    'Login': true,
    'Pager': true,
    'SimplePager': true,
    'Tabs': true,
    'Template': true,
    'Tips': true,
    'Pagers': true,
    'NumberField': true,
    'DateTimePicker': true
});

