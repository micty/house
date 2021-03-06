﻿

module.exports = function (pages) {

    var grunt = require('grunt');
    var Grunter = require('../lib/Grunter.js');
    var Tasks = Grunter.require('Tasks');

    var Path = require('path');
    var pkg = grunt.file.readJSON('package.json');

    var list = []; //该属性值会由代码动态修改


    //找出被修改的 less 文件的最小集合
    grunt.event.on('watch', function (action, file) {
        var ext = '.less';
        var s = file.slice(0 - ext.length).toLowerCase();
        if (s != ext) { //只处理指定后缀名的文件
            return;
        }
        console.log(file);
        list.push(file);
    });


    Tasks.add('less', 'watch-debug', {
        options: {
            compress: false,
        },
        expand: true,
        ext: '.debug.css',
        src: list,

        //生成 .css 到 /css/ 目录
        rename: function (src, dest) {
            var name = Path.relative(pkg.dir.htdocs, dest);
            name = name.split('\\').join('.');
            dest = Path.join(pkg.dir.css, name);
            return dest;
        },
    });

    //执行清理操作
    Tasks.register('watch-reset', function () {
        list.length = 0; //这里不能使用 list = []，因为其他任务引用了 list 的指针。
    });


    Tasks.add('watch', 'less', {
        files: [
            '<%=dir.htdocs%>/**/*.less',
            '<%=dir.refactor%>/**/*.less',

        ],
        tasks: [
            'less:watch-debug',
            //'less:watch-min',
            'watch-reset',
        ],
        options: {
            spawn: false,
            event: ['changed', 'added', 'renamed'], 
        }
    });



    //-------------
    //less 文件的创建、删除，重新编译 html 文件

    Tasks.add('watch', 'index-less', {
        files: [
            '<%=dir.htdocs%>**/*.less',
            '!<%=dir.htdocs%>html/**/*.less',
        ],
        tasks: [
            'copy:index-html', //这里用到 watch-html.js 中的任务
        ],
        options: {
            spawn: false,
            event: ['added', 'deleted', 'renamed'], //监听事件
        }
    });

    

    pages.forEach(function (item, index) {

        var name = 'LESS$' + item;

        Tasks.add('watch', name, {
            files: [
                '<%=dir.htdocs%>' + item + '/**/*.less',
            ],
            tasks: [
                'copy:HTML$' + item, //这里用到 watch-html.js 中的任务
            ],
            options: {
                spawn: false,
                event: ['added', 'deleted', 'renamed'], //监听事件
            }
        });

    });


    ////其他页面的，一个个的写
    //Tasks.add('watch', 'card-detail-less', {
    //    files: [
    //        '<%=dir.htdocs%>html/card-detail/**/*.less',
    //    ],
    //    tasks: [
    //        'copy:card-detail-html', //这里用到 watch-html.js 中的任务
    //    ],
    //    options: {
    //        spawn: false,
    //        event: ['added', 'deleted', 'renamed'], //监听事件
    //    }
    //});

};