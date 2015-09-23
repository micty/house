

module.exports = function (grunt, Tasks) {

    var HTML = require('../lib/HTML.js');

    //主页面的
    Tasks.add('watch', 'index-html', {
        files: [
            '<%=dir.htdocs%>/modules/**/*.html',
            '<%=dir.htdocs%>/index.master.html',
        ],
        tasks: [
            'copy:index-html',
        ],
        options: {
            spawn: false,
            event: ['changed'/*, 'added', 'deleted'*/], //只监听修改事件
        }
    });

    Tasks.add('copy', 'index-html', {
        src: '<%=dir.htdocs%>index.master.html',
        dest: '<%=dir.htdocs%>index.html',
        options: {
            process: function (html, file) {
                return HTML.compile(html, '<%=dir.htdocs%>', file);
            },
        }
    });



    //个别页面的
    Tasks.add('watch', 'card-detail-html', {
        files: [
            '<%=dir.htdocs%>html/card-detail/modules/**/*.html',
            '<%=dir.htdocs%>html/card-detail/index.master.html',
        ],
        tasks: [
            'copy:card-detail-html',
        ],
        options: {
            spawn: false,
            event: ['changed'/*, 'added', 'deleted'*/], //只监听修改事件
        }
    });

    Tasks.add('copy', 'card-detail-html', {
        src: '<%=dir.htdocs%>html/card-detail/index.master.html',
        dest: '<%=dir.htdocs%>html/card-detail/index.html',
        options: {
            process: function (html, file) {
                return HTML.compile(html, '<%=dir.htdocs%>html/card-detail/', file);
            },
        }
    });





};