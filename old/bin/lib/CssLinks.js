

/**
* 从 HTML 页中分析。
*/
module.exports = (function (grunt, $, This) {

    'use strict';


    var between = $.String.between;

    var beginTag = '<!--grunt.css.begin-->';
    var endTag = '<!--grunt.css.end-->';


    //组合生成各种情况： 
    //href=", href=', href= ", href= ', href =", href =', href = ", href = '
    var patterns = $.Array.descartes(['href'], ['', ' '], ['='], ['', ' '], ['"', "'"]);

    patterns = $.Array.keep(patterns, function (item, index) {
        return item.join('');
    });


    //获取 src 属性值
    function getSrc(s) {

        var len = patterns.length;

        for (var i = 0; i < len; i++) {

            var item = patterns[i];
            var index = s.indexOf(item);

            if (index >= 0) {
                return between(s, item, item.slice(-1));
            }
        }

        return '';
    }





    function read(file) {

        var config = grunt.config.get();

        file = grunt.template.process(file, config);

        var s = grunt.file.read(file);
        s = $.String.between(s, beginTag, endTag);


        var list = s.split('<link');

        list = $.Array.map(list, function (s, index) {
            return getSrc(s) || null;
        });

        return list;

    }


    
    function minify(html, src, dest) {

        var links = $.String.between(html, beginTag, endTag);
        links = $.String.replaceAll(links, src, dest);
        html = $.String.replaceBetween(html, beginTag, endTag, links);

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
        minify: minify
    };
    


})(require('grunt'), require('./MiniQuery'), {});

