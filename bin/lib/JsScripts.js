

/**
* 提供一些集成的任务配置管理方法。
*/
module.exports = (function (grunt, $) {

    'use strict';

    var Path = require('path');

    var between = $.String.between;

    var beginTag = '<!--grunt.js.begin-->';
    var endTag = '<!--grunt.js.end-->';



    function read(file) {

        var config = grunt.config.get();
        file = grunt.template.process(file, config);

        var html = grunt.file.read(file);
        html = $.String.between(html, beginTag, endTag);

        //提取出 script 标签
        var reg = /<script[^>]*?>[\s\S]*?<\/script>/gi;
        var tags = html.match(reg);

        if (!tags) {
            return [];
        }

        //提取出 src 中的值
        var list = $.Array.keep(tags, function (s, index) {

            var reg = /src\s*=\s*["'][\s\S]*?["']/gi;
            var a = s.match(reg);

            var src = a[0];
            src = src.replace(/^src\s*=\s*["']/, '').replace(/["']$/gi, '');

            var ext = Path.extname(src); //后缀里可能包含查询字符串
            src = src.slice(0, 0 - ext.length);
            return src + '.js';

        });


        return list;

    }


    //把 html 页面中 <!--grunt.js.begin--> 和 <!--grunt.js.end--> 
    //之间的 <script> 标签替换成一个合并/压缩后的引用
    function concat(html, src) {
        var script = '<script src="' + src + '"></script>';
        html = $.String.replaceBetween(html, beginTag, endTag, script);

        return html;

    }

    function minify(html, src, dest) {

        //提取出 script 标签
        var reg = /<script[^>]*?>[\s\S]*?<\/script>/gi;
        var tags = html.match(reg);

        if (tags) {
            tags.forEach(function (item, index) {
                var tag = item.replace(src, dest);
                html = html.replace(item, tag);
            });
        }

        return html;
    }



    function write(src, dest) {

        var config = grunt.config.get();
        dest = grunt.template.process(dest, config);


        var list = read(src);

        list = $.Array.keep(list, function (s, index) {
            return "    '" + s + "', \n";
        });

        var s = '\n' + 
            'module.exports = [ \n' +
                list.join('') +
            ']; \n';

        grunt.file.write(dest, s);

    }


    return {
        read: read,
        write: write,
        concat: concat,
        minify: minify
    };
    


})(require('grunt'), require('./MiniQuery'));

