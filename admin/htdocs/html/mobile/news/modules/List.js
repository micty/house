

define('/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = require('MiniQuery');
    var Url = MiniQuery.require('Url');

    var panel = KISP.create('Panel', '#ul-items');
    var list = [];
    var mask = null;


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            if (cmd == 'remove') {
                mask = mask || top.KISP.create('Mask');
                mask.show();

                var ok = confirm('确认要删除吗？');
                mask.hide();

                if (!ok) {
                    return;
                }
            }


            panel.fire(cmd, [item, index]);

        });

    });


    panel.on('render', function (data) {

        list = data;
  
        panel.fill(list, function (item, index) {

            var order = index < 2 ? index + 1 : index - 2 + 1;

            return {
                'index': index,
                'order': order,
                'cover': item.cover,
                'url': item.url,
                'title': item.title,
                'desc': item.desc,
            };
        });


        if (list.length == 0) {
            panel.$.addClass('nodata');
            panel.$.html('<li>暂无数据</li>');
        }
        else {
            panel.$.removeClass('nodata');
        }

    });



    return panel.wrap();


});