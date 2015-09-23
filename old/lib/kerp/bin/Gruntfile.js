


module.exports = function (grunt) {


    'use strict';

    var Paths = require('./lib/Paths');
    var Tasks = require('./lib/Tasks');
    var pkg = grunt.file.readJSON('package.json');

    Tasks.setConfig({
        pkg: pkg,
        dir: pkg.dir
    });




    Tasks.add('concat', 'kerp', {
        dest: '<%=dir.build%>kerp.debug.js',
        src: Paths.linear({
            dir: '<%=dir.src%>',
            files: [
                'begin.js',
                {
                    dir: 'core',
                    files: [
                        'Module.js',
                        '$.js',
                        'MiniQuery.js',
                    ]
                },
                {
                    dir: 'api',
                    files: [
                        'API.js',
                        'Proxy.js',
                    ]
                },
                {
                    dir: 'crypto',
                    files: [
                        //'DES.js',
                        'MD5.js',
                    ]
                },
                {
                    dir: 'excore',
                    files: [
                        'Cache.js',
                        'Config.js',
                        'Debug.js',
                        'File.js',
                        'Module.js',
                        'Multitask.js',
                        'Seajs.js',
                        'Tree.js',
                        'Url.js',
                    ]
                },
                {
                    dir: 'ui',
                    files: [
                        //'ButtonList.js',
                        //'CascadeMenus.js',
                        //'CascadeNavigator.js',
                        //'CascadePath.js',
                        //'CascadePicker.js',
                        'Dialog.js',
                        'Iframe.js',
                        'IframeManager.js',
                        'Loading.js',
                        'Login.js',
                        'Pager.js',
                        'Pagers.js',
                        'Pages.js',
                        'Samples.js',
                        'SimplePager.js',
                        'Tabs.js',
                        'Template.js',
                        'Tips.js',
                    ]
                },
                //{
                //    dir: 'jquery-plugin',
                //    files: [
                //        'NumberField.js',
                //        'DateTimePicker.js',
                //    ]
                //},
                'expose.js',
                'KERP.js',
                'end.js'
            ]
        }),
        
        options: {
            banner: '\n' +
                '/*!\n' +
                '* <%=pkg.description%>\n' +
                '* 版本: <%=pkg.version%>\n' +
                '*/'
        }
    });


    Tasks.add('uglify', 'kerp', {
        src: '<%=dir.build%>kerp.debug.js',
        dest: '<%=dir.build%>kerp.min.js',
        options: {
            //sourceMap: true
        }
    });


    //拷到

    Tasks.add('copy', 'kerp', {
        files: Paths.pair({
            src: '<%=dir.build%>',
            dest: '<%=dir.htdocs%>lib/kerp',
            files: [
                'kerp.debug.js',
                'kerp.min.js',
                'kerp.min.js.map',
            ]
        })
    });

    Tasks.add('copy', 'kerp-2', {
        files: Paths.pair({
            src: '<%=dir.build%>',
            dest: '../../../demo/htdocs/f/kerp',
            files: [
                'kerp.debug.js',
                'kerp.min.js',
                'kerp.min.js.map',
            ]
        })
    });


    Tasks.loadContrib([
        'concat',
        'uglify',
        'watch',
        'copy'
    ]);



    //在命令行调用 grunt 时，会直接执行该任务。
    //如果要执行其他任务，请指定任务名称，如 grunt test
    Tasks.register();


};