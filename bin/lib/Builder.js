

/**
* 构建器
*/
module.exports = (function () {

    'use strict';

    var grunt = require('grunt');
    var Path = require('path');

    var $ = require('./MiniQuery');
    var Paths = require('./Paths.js');
    var JsScripts = require('./JsScripts');
    var CssLinks = require('./CssLinks');
    var Tasks = require('./Tasks');
    var Directory = require('./Directory');


    var beginJs = 'partial/begin.js';
    var endJs = 'partial/end.js';

    var banner = grunt.file.read('partial/banner.js');


    var mapper = new $.Mapper();
    var guidKey = $.Mapper.getGuidKey();



    //生成 banner 信息头
    function getBanner(filename, list) {

        var total = list.length;

        return $.String.format(banner, {
            'filename': filename,
            'datetime': $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'count': total - 2,
            'total': total,
            'list': $.Array.keep(list, function (item, index) {
                return '*    ' + item;
            }).join('\n')
        });
    }


    function parsePath(src) {

        var dir = Path.dirname(src) + '/';
        var ext = Path.extname(src);
        var filename = Path.basename(src);
        var basename = Path.basename(src, ext);
        
        return {
            'dir': dir,
            'name': dir + basename,
            'fullname': src,
            'filename': filename,
            'basename': basename,
            'ext': ext,
        };
    }


    //构造器
    function Builder(src, dest, level) {

        this[guidKey] = $.String.random();

        src = Directory.getRealPath(src);   //替换模板字符串得到真实的路径
        dest = Directory.getRealPath(dest); //替换模板字符串得到真实的路径

        var meta = {
            level: level,
            src: parsePath(src),
            dest: parsePath(dest),

        };

        mapper.set(this, meta);

    }


    Builder.prototype = {
        constructor: Builder,

        /**
        * 合并文件。
        */
        concat: function () {
            var meta = mapper.get(this);

            var list = JsScripts.read(meta.src.fullname); //从 html 文件中分析出 js 引用
            if (list.length == 0) { //没有需要合并的文件
                return;
            }


            var ext = '.all.debug.js';
            var dest = meta.dest.name + ext;

            //增加元数据
            meta.concat = {
                dest: dest,
                filename: meta.dest.basename + ext
            };

            list = Paths.linear({
                dir: meta.src.dir,
                files: list
            });
            list = $.Array.merge(beginJs, list, endJs);

            var config = {
                src: list,
                dest: dest,
                options: {
                    banner: getBanner(meta.dest.basename + ext, list),
                    process: function (content, src) {
                        return '\n' + '//Source: ' + src + ' \n' + content;
                    }
                }
            };

            //输出文件 x.all.debug.js
            var target = $.String.random();
            Tasks.run('concat', target, config);
        },

        /**
        * 精简文件。
        */
        uglify: function () {
            var meta = mapper.get(this);

            if (!meta.concat) { //上一步没有进行合并
                return;
            }
            
            var ext = '.all.min.js';
            var dest = meta.dest.name + ext;

            meta.uglify = {
                dest: dest,
                filename: meta.dest.basename + ext,
            };

            var config = {
                src: meta.concat.dest,
                dest: dest,
                options: {
                    sourceMap: meta.level <= 2,
                }
            };

            //输出文件 
            //  x.all.min.js
            //  x.all.min.js.map
            var target = $.String.random();
            Tasks.run('uglify', target, config);

        },

        /**
        * 复制 html 页面。
        */
        copy: function () {

            var meta = mapper.get(this);

            var config = {
                src: meta.src.fullname,
                dest: meta.dest.fullname,
                options: {
                    process: function (html) {
                        var level = meta.level;

                        if (level >= 2) {
                            html = CssLinks.minify(html, '.debug.css', '.min.css');
                        }

                        if (meta.concat) {
                            html = JsScripts.concat(html, meta.concat.filename);
                        }

                        if (level >= 2) {
                            html = JsScripts.minify(html, '.debug.js', '.min.js');
                        }

                        return html;
                    },
                }
            };

            Tasks.run('copy', $.String.random(), config);
        },

        /**
        * 精简 html 页面。
        */
        htmlmin: function () {

            var meta = mapper.get(this);

            var config = {
                src: meta.dest.fullname,
                dest: meta.dest.fullname,
                options: {
                    //具体说明见：https://github.com/kangax/html-minifier#options-quick-reference
                    collapseWhitespace: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeRedundantAttributes: true,
                    removeAttributeQuotes: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                    keepClosingSlash: true,
                }
            };

            var target = $.String.random();
            Tasks.run('htmlmin', target, config);
        },

        /**
        * 清理文件。
        */
        clean: function () {
            var meta = mapper.get(this);

            if (!meta.concat) { //没有生成合并的文件
                return;
            }

            var config = {
                src: meta.concat.dest,
                options: {
                    force: true //允许删除当前工作目录外的其他文件
                }
            };

            var target = $.String.random();
            Tasks.run('clean', target, config);
        },


        build: function () {
            var meta = mapper.get(this);
            var level = meta.level;

            this.concat();
            this.uglify();
            this.copy();

            if (level >= 4) {
                this.htmlmin();
            }

            if (level >= 3) {
                this.clean();
            }

        }
    };






    return $.Object.extend(Builder, { //静态方法

        build: function (config) {

            var level = config.level;
            var src = config.src;
            var dest = config.dest;

            //先清空目标目录
            Tasks.run('clean', $.String.random(), {
                src: dest,
                options: {
                    force: true
                }
            });

            //复制
            Tasks.run('copy', $.String.random(), {
                dest: dest,
                src: $.Array.grep(config.copy || [], function (item) {
                    return !!item;
                }),
            });



            var obj = $.Object.extend({}, src, {
                dir: dest
            });
            var dests = Paths.linear(obj);


            var list = Paths.linear(src);

            list.forEach(function (src, index) {

                var builder = new Builder(src, dests[index], level);
                builder.build();

            });


            

        }

    });



})();

