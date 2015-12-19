


module.exports = function (grunt) {


    'use strict';


    var Grunter = require('./lib/Grunter');
    var Tasks = Grunter.require('Tasks');


    var pkg = grunt.file.readJSON('package.json');

    Tasks.setConfig({
        'pkg': pkg,
        'dir': pkg.dir,
    });

    Tasks.load();
    

    //在命令行调用 grunt 时，会直接执行该任务。
    Tasks.register('default');
    

    //在命令行调用 grunt watch 时，会直接执行该任务。
    var pages = [
        'html/signup',
        'html/paper/list',
        'html/paper/add',
        'html/events/news',
        'html/events/photo',
        'html/recommend',

        'html/activity/prize',
        'html/activity/signup',
        'html/activity/recommend',
    ];

    require('./tasks/watch-html.js')(pages);
    require('./tasks/watch-less.js')(pages);
    require('./tasks/watch-js.js')(pages);


    require('./tasks/clean.js')();
    require('./tasks/less.js')();

    //清空 css 目录里的所有 css 文件
    grunt.task.run('clean:css');


    //立即编译所有 html
    grunt.task.run('copy:index-html');

    pages.forEach(function (item, index) {
        var name = 'HTML$' + item;
        grunt.task.run('copy:' + name);

    });




    //立即编译所有 less
    grunt.task.run('less:debug');
    



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

        ...

        9: ....
        10: 把 index.all.min.js 内嵌到 html 页面中
    */
    grunt.registerTask('build', function (level) {

        //先生成 min.css，供构建用
        grunt.task.run('less:min');

        var build = require('./tasks/build.js');
        build(grunt, level);

        //构建完成，再删除 min.css
        grunt.task.run('clean:min.css');

    });




    

};