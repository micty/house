
module.exports = {

    'WebSite': {
        cssDir: 'style/css/',
        htdocsDir: '../htdocs/',
        buildDir: '../build/htdocs/',
        masters: '**/*.master.html',
    },

    'LessList': {
        md5: 4, //填充模板所使用的 md5 的长度

        //生成的 html 所使用的模板
        sample: '<link href="{href}" rel="stylesheet" />',

        tags: {
            begin: '<!--weber.css.begin-->',
            end: '<!--weber.css.end-->',
        },
    },

    'JsList': {
        md5: 4, //填充模板所使用的 md5 的长度。

        //生成的 html 所使用的模板。
        sample: '<script src="{href}"></script>',

        tags: {
            begin: '<!--weber.js.begin-->',
            end: '<!--weber.js.end-->',
        },
        max: {
            x: 150,     //每行最大的长度。
            y: 250,     //最多的行数。
        },
    },

    'HtmlList': {
        //生成的 html 所使用的模板
        sample: '<link rel="html" href="{href}" />', 
        tags: {
            begin: '<!--weber.html.begin-->',
            end: '<!--weber.html.end-->',
        },
    },

    'HtmlLinks': {
        regexp: /<link\s+.*rel\s*=\s*["\']html["\'].*\/>/ig,
    },

    'JsScripts': {
        md5: 4, //填充模板所使用的 md5 的长度。
        exts: { //优先识别的后缀名
            debug: '.debug.js',
            min: '.min.js',
        },
    },

    'CssLinks': {
        md5: 4, //填充模板所使用的 md5 的长度。
        exts: { //优先识别的后缀名
            debug: '.debug.css',
            min: '.min.css',
        },

        //用来提取出 css 标签的正则表达式。
        regexp: /<link\s+.*rel\s*=\s*["\']stylesheet["\'].*\/>/ig,
    },
}