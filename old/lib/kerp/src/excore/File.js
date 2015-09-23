

/**
* 文件工具类
*/
define('File', function (require, exports, module) {


    /**
    * 检测指定的文件是否为特定的扩展名类型的文件。
    * @param {string} file 要检测的文件名。
    * @param {string} ext 要检测的扩展名，以 "." 开始。
    * @return {boolean} 如果该文件名以指定的扩展名结尾，则返回 true；否则返回 false。
    * @example 
        File.is('a/b/c/login.JSON', '.json'); //返回 true
    */
    function is(file, ext) {

        if (typeof file != 'string' || typeof ext != 'string') {
            return false;
        }

        return file.slice(0 - ext.length).toLowerCase() == ext.toLowerCase();
    }

    function isJs(file) {
        return is(file, '.js');
    }

    function isCss(file) {
        return is(file, '.css');
    }

    function isJson(file) {
        return is(file, '.json');
    }




    return {
        is: is,
        isJs: isJs,
        isCss: isCss,
        isJson: isJson
    };
});
