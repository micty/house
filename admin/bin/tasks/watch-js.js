

module.exports = function (grunt, Tasks) {

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

};