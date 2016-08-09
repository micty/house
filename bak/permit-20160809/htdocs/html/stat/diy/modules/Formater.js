
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Group = module.require('Group');




    function format(data) {

        //基础
        var groups = Group.getBases(data);

        //对数组进行转置。 即把数组的行与列对换，返回一个新数组。
        var rows = $.Array.transpose(groups);
    

        return {
            'rows': rows,
        };

    }





    return {
        'format': format,
    };

});