

module.exports = function (pages) {

    var grunt = require('grunt');

    var Grunter = require('../lib/Grunter.js');
    var Tasks = Grunter.require('Tasks');


    Tasks.add('watch', 'index-js', {
        files: [
            '<%=dir.htdocs%>**/*.js',
            '!<%=dir.htdocs%>html/**/*.js',
        ],
        tasks: [
            'copy:index-html', //这里用到 watch-html.js 中的任务
        ],
        options: {
            spawn: false,
            event: ['changed', 'added', 'deleted'], //监听事件
        }
    });



    Tasks.add('watch', 'card-detail-js', {
        files: [
            '<%=dir.htdocs%>html/card-detail/**/*.js',
        ],
        tasks: [
            'copy:card-detail-html', //这里用到 watch-html.js 中的任务
        ],
        options: {
            spawn: false,
            event: ['changed', 'added', 'deleted'], //监听事件
        }
    });

    pages.forEach(function (item, index) {

        var name = 'JS$' + item;

        Tasks.add('watch', name, {
            files: [
                '<%=dir.htdocs%>' + item + '/**/*.js',
            ],
            tasks: [
                'copy:HTML$' + item, //这里用到 watch-html.js 中的任务
            ],
            options: {
                spawn: false,
                event: ['changed', 'added', 'deleted'], //监听事件
            }
        });

    });


    //Tasks.add('watch', 'card-detail-js', {
    //    files: [
    //        '<%=dir.htdocs%>html/card-detail/**/*.js',
    //    ],
    //    tasks: [
    //        'copy:card-detail-html', //这里用到 watch-html.js 中的任务
    //    ],
    //    options: {
    //        spawn: false,
    //        event: ['changed', 'added', 'deleted'], //监听事件
    //    }
    //});

};