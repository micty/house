



var KERP = {

    //快捷方式
    require: function (id) {
        return  Module.expose(id) ? Module.require(id) : null;
    },

    use: function (id, fn) {

        var module = KERP.require(id);
        if (!module) {
            fn && fn(null);
            return;
        }

        var use = module.use;
        if (use) {
            use(fn);
        }
        else {
            fn && fn(module);
        }
    },

    config: require('Config').set,

    //crypto
    //'MD5': require('MD5'),

   
    'Cache': require('Cache'),
    'Debug': require('Debug'),
    'File': require('File'),
    'Url': require('Url'),
    //'Seajs': require('Seajs'),

    //api
    'Proxy': require('Proxy'),
    'API': require('API'),

    //ui
    'Pages': require('Pages'),
    'CascadePicker': require('CascadePicker'),
    'Dialog': require('Dialog'),
    'Loading': require('Loading'),
    'Login': require('Login'),
    'Pager': require('Pager'),
    'SimplePager': require('SimplePager'),
    'Tabs': require('Tabs'),
    'Template': require('Template'),
    'Tips': require('Tips'),
    'Pagers': require('Pagers'),


};




//暴露
if (typeof global.define == 'function' && (global.define.cmd || global.define.amd)) { //cmd 或 amd
    global.define(function (require) {
        return KERP;
    });
}
else { //browser
    global.KERP = KERP;
}


