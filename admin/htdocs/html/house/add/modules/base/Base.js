

define('/Base', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-panel-base');
   

    panel.on('init', function () {

       
       

    });



    panel.on('render', function (data) {

        if (data) {
            panel.$.find('[name]').each(function () {
                var name = this.name;
                var obj = data;


                if (name.indexOf('.') > 0) {
                    var a = name.split('.');
                    name = a[0];
                    obj = obj[name];
                    name = a[1];
                }

                if (!(name in obj)) {
                    return;
                }

                var value = obj[name];
                this.value = value;

            });
        }

    });




    return panel.wrap({

        get: function (id) {

            var data = {
                'id': id,
            };

            panel.$.find('[name]').each(function () {
                var name = this.name;
                var value = this.value;
                var obj = data;

                if (name.indexOf('.') > 0) {
                    var a = name.split('.');
                    var isIndex = (/^\d+$/).test(a[1]);

                    name = a[0];

                    if (!(name in obj)) {
                        obj = obj[name] = isIndex ? [] : {};
                    }
                    else {
                        obj = obj[name];
                    }

                    name = a[1];

                }

                if (this.type == 'number') {
                    value = Number(value);
                }

                obj[name] = value;
            });

            //过滤掉空标签。
            data.tags = $.Array.map(data.tags, function (item) {
                return item || null;
            });


            if (!data['name']) {
                top.KISP.alert('【楼盘名称】不能为空');
                return;
            }

            var price = data.price;
            if (!price) {
                top.KISP.alert('【在售价格】不能为空');
                return;
            }

            price = Number(price);
            if (isNaN(price) || price < 0) {
                top.KISP.alert('【在售价格】必须为大于等于 0 的数字');
                return;
            }

            //if (!data['type']) {
            //    top.KISP.alert('【主力户型】不能为空');
            //    return;
            //}

            //if (!data['address']) {
            //    top.KISP.alert('【楼盘地址】不能为空');
            //    return;
            //}



            return data;
        },

       
    });

});