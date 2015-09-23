


module.exports = function (grunt) {


    'use strict';


    var Builder = require('./lib/Builder');
    var Tasks = require('./lib/Tasks');
    var pkg = grunt.file.readJSON('package.json');

    Tasks.setConfig({
        pkg: pkg,
        dir: pkg.dir
    });


    //Tasks.use('less/debug');
    //Tasks.use('less/min');

    Tasks.useConfig('watch/less'); //不添加到任务列表中

    //Tasks.use('concat/js');
    


    Tasks.load(grunt);

    //在命令行调用 grunt 时，会直接执行该任务。
    //如果要执行其他任务，请指定任务名称，如 grunt test
    Tasks.register();


    //运行 grunt build:0|1|2|3|4|5 即可调用本任务
    /*
        0: 最原始的开发版，保留。
        1: 打包，压缩，删除所有的 .less 文件，
            并把分模块 js 文件打包成一个 .all.debug.js 引用并插入到 .html 文件中。
        2: 在 1 的基础上，压缩，把 .debug. 引用改成 .min. 插入到 .html 文件中。
            即修改 html 中相应的 .debug.css 和 .debug.js 的引用为 .min.css 和 .min.js。
        3: 在 2 的基础上，删除所有的 .map .debug.js .debug.css 文件。
        4: 在 3 的基础上，压缩 .html 文件。
        5: 在 4 的基础上，压缩 config.js 文件。
    */
    grunt.registerTask('build', function (level) {

        var dest = '<%=dir.build%>' + level + '/htdocs/';

        //构建 html 页面
        Builder.build({
            level: level,
            dest: dest,
            src: {
                dir: '<%=dir.htdocs%>',
                files: [
                    'index.html',
                    'login.html',
                    'master.html',
                    {
                        dir: 'html',
                        files: [
                            'demo/index.html',
                            'home/index.html',
                            'order/index.html',
                            'warehouse/index.html',
                        ]
                    }
                ]
            },

            //拷贝其他目录和文件
            copy: [
                '<%=dir.css%>**',
                '<%=dir.htdocs%>lib/**',
                '<%=dir.htdocs%>data/**',
                '<%=dir.htdocs%>api/**',

                //排除的
                level >= 1 ? '!<%=dir.css%>**/*.less' : null,
                level >= 3 ? '!<%=dir.css%>**/*.debug.css' : null,
                level >= 3 ? '!<%=dir.htdocs%>lib/**/*.debug.css' : null,
                level >= 3 ? '!<%=dir.htdocs%>lib/**/*.css.map' : null,
                level >= 3 ? '!<%=dir.htdocs%>lib/**/*.debug.js' : null,
                level >= 3 ? '!<%=dir.htdocs%>lib/**/*.min.map' : null,
                level >= 3 ? '!<%=dir.htdocs%>lib/**/*.min.js.map' : null,
                
            ]
            
        });

        //单独处理  config.js 文件。
        //根据 level 在文件顶部加上 KERP.Debug.set(true|false); 
        Tasks.run('copy', 'config', {
            src: '<%=dir.htdocs%>config.js',
            dest: dest + 'config.js',
            options: {
                process: function (js) {
                    return '\n' +
                        'KERP.Debug.set(' + (level <= 1) + '); //该行代码由 grunt 生成 \n' +
                        js;
                },
            }
        });

        //压缩 config.js
        if (level >= 5) {
            Tasks.run('uglify', 'config', {
                src: dest + 'config.js',
                dest: dest + 'config.js',
            });
        }



    });


    //压缩 htdocs/lib/art-dialog/ 下的文件
    grunt.registerTask('dialog', function () {

        var url = '<%=dir.lib%>art-dialog/dialog.all.';

        Tasks.run('uglify', 'dialog', {
            src: url + 'debug.js',
            dest: url + 'min.js',
            options: {
                //sourceMap: true,
            }
        });

        Tasks.run('less', 'dialog', {
            src: url + 'debug.css',
            dest: url + 'min.css',
            options: {
                compress: true,
            }
        });

    });






};