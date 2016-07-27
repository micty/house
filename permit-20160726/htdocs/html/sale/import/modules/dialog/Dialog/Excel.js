

define('/Dialog/Excel', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var Fields = module.require('Fields');




    function parse(type, content) {

        var list = content.split('\n');
        list = list.map(function (item) {
            return item.split('\t');
        });

        if (list.length < 4) {
            return '没有找到有效的数据';
        }


        var fields = Fields.get(list[3]);

        if (!Array.isArray(fields)) {
            return fields;
        }


        //主体数据
        var begin = 4;
        var end = list.findIndex(function (values) {
            return values.join('').startsWith('"说明');
        });

        if (end < 0) {
            end = list.length;
        }

        list = list.slice(begin, end);

        if (list.length == 0) {
            return '没有找到有效的数据记录。';
        }


        var msgs = [];

        list = $.Array.map(list, function (values, index) {

            var no = index + 1;
    
            //空行
            if (!values.join('').trim()) {
                return null;
            }

            var count = fields.length;

            if (values.length != count) {
                msgs.push('第 ' + no + ' 条记录的字段个数不正确。');
                return null;
            }
       

            var isValid = true; //标记整条记录是否有效。

            var item = {
                'id': $.String.random(),    //增加一个随机 id，方便在列表中处理。
                'type': type,               // 
            };


            //逐字段读取和检查。
            fields.forEach(function (field, index) {

                var required = field.required;
                var name = field.name;
                var value = values[index];
                var orginValue = value;

                var key = field.key;

                if (!value) {
                    if (required) {
                        msgs.push('第 ' + no + ' 条记录的【' + name + '】不能为空。');
                        item = null;
                        return;
                    }

                    //此时的 item 可能为 null
                    if (item) {
                        item[key] = value;
                    }

                    return;
                }

                //此时的 value 不为空，即有值。
                switch (field.type) {

                    case 'date':
                        value = $.Date.parse(value);

                        if (isNaN(value.getTime())) {
                            msgs.push('第 ' + no + ' 条记录的【' + name + '】〖' + orginValue + '〗无法识别。');
                            item = null;
                            return;
                        }

                        value = $.Date.format(value, 'yyyy-MM-dd');
                        break;

                    case 'number':
                        value = Number(value);
                        if (isNaN(value)) {
                            msgs.push('第 ' + no + ' 条记录的【' + name + '】〖' + orginValue + '〗必须为数字。');
                            item = null;
                            return;
                        }
                        break;
                }

                
                //此时的 item 可能为 null
                if (item) {
                    item[key] = value;
                }
               
            });
            

            return item;

        });



        return {
            'msgs': msgs,
            'list': list,
        };

    }



    return {
        'parse': parse,
    };

});