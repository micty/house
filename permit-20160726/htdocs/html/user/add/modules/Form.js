

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var MD5 = KISP.require('MD5');

    var panel = KISP.create('Panel', '#table-form');

    var department$role = {
        '土地': 'land',
        '规划': 'plan',
        '建设': 'construct',
        '销售': 'sale',
    };

    var current = {};

    function get(data) {

        data = data || {};

        panel.$.find('[name]').each(function () {

            var name = this.name;
            var value = this.value;
            data[name] = value;
        });

        var number = data.number.trim();
        if (!number) {
            KISP.alert('登录账号不能为空');
            return;
        }

        var password = data.password;
        if (!password) {
            KISP.alert('登录密码不能为空');
            return;
        }

        var name = data.name.trim();
        if (!name) {
            KISP.alert('用户姓名不能为空');
            return;
        }

        //说明发生了修改，则重新 md5 一下。
        if (password != current.password) {
            password = MD5.encrypt(password);
        }



        var department = data.department;
        var role = department$role[department];
        data['role'] = role;

       

        data.number = number;
        data.password = password;
        data.name = name;


        return data;
    }








    panel.on('render', function (data) {

        if (data) {

            current = data;

            panel.$.find('[name]').each(function () {
                var name = this.name;
                var value = data[name];
                this.value = value;

            });

        }


    });





    return panel.wrap({
        'get': get,
    });


});