
/**
* 模板模块。
* @namespace
* @author micty
*/
define('Samples', function (require, exports, module) {

    var $ = require('$');

    var html = top.document.body.innerHTML;


    function trim(s) {
        return s.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
    }

    /**
    * 获取指定名称的模板。
    * @param {string} name 模板的名称。
    * @param {Array} [tags] 子模板列表。
    * @return {string} 返回指定名称的模板字符串。
    */
    function get(name, tags) {

        var begin = '<!--Samples.' + name + '--!';
        var end = '--Samples.' + name + '-->';

        var sample = $.String.between(html, begin, end);

        if (tags) {

            $.Array.each(tags, function (item, index) {
                if (!item.trim) {
                    return;
                }

                //指定了要美化模板
                delete item.trim;
                    
                var fn = item.fn;
                if (fn) { //原来已指定了处理函数，则扩展成钩子函数
                    item.fn = function (s) {
                        s = fn(s);
                        s = trim(s);
                        return s;
                    };
                }
                else {
                    item.fn = trim;
                }
            });

            return $.String.getTemplates(sample, tags);
        }

        return sample;
    }



    return {
        get: get,
    };


});

