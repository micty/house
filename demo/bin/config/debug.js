
module.exports = {

    dir: '../build/debug/htdocs/',

    /**构建完成后需要删除的文件或目录*/
    clean: [
        '!api/',         //这个不要删除
   
        'modules/',
        'lib/',
        'partial/',
        '**/*.min.js',
        '**/*.min.css',
        '**/*.less',
        '**/*.map',
        '**/*.md',
    ],

    /**
    * 构建前需要单独处理的文件。
    */
    process: {
        '**/*.js': function (file, content, require) {
            var $String = require('String');
            var $ = require('$');
            var now = $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            var tags = [
                {
                    begin: '/**weber.debug.begin*/',
                    end: '/**weber.debug.end*/',
                    value: [
                        "KISP.require('Edition').set('debug');",
                        "KISP.data('build-date-time', '" + now + "');",

                    ].join('\r\n'),
                },
            ];

            tags.forEach(function (tag) {
                content = $String.replaceBetween(content, tag);
            });

            return content;
        },

        'config.js': {
            minify: false,
            inline: false,
            delete: false,
        },
    },

    jsList: {
        concat: {
            'header': 'partial/begin.js',
            'footer': 'partial/end.js',
            'write': true,      //写入合并后的 js。
            'delete': true,     //删除合并前的源 js 文件。
            'addPath': true,    //添加文件路径的注释。
            'name': 'index.debug.js', //
        },
    },

    lessList: {
        compile: {
            'write': false,     //写入编译后的 css 文件。
            'delete': true,     //编译完后删除源 less 文件。
        },
        concat: {
            'write': true,      //写入合并后的 css 文件。
            'delete': true,     //删除合并前的源分 css 文件。
            'name': 'index.debug.css', //
        },
        
    },
}