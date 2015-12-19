

define('/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-items');
    var list = [];
    var template = null;
 

    function checkFull(url) {
        if (!url || typeof url != 'string') {
            return false;
        }

        url = url.toLowerCase();

        return url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
    }

    panel.on('init', function () {

        var baseUrl = KISP.data('demo').url;
        baseUrl = baseUrl.slice(3); //去掉一个 '../'

        template = KISP.create('Template', '#ul-items', {
            names: ['field'],
            
            fn: function (item, index) {

                var url = item.href;
                var isFull = checkFull(url);

                return {
                    data: {
                        'index': index,
                        'name': item.name,
                        'src': item.src,
                        'href': isFull ? url :
                            url ? baseUrl + url : 'javascript:',
                    },

                    list: item.fields,

                    fn: function (field, k) {
                        return {
                            data: {
                                'name': field.name,
                                'value': field.value,
                            },
                        };
                    },
                };
            }
        });




        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];
            panel.fire(cmd, [item, index]);

        });

    });


    panel.on('render', function (data) {

        list = data;
        list = list.sort(function (a, b) {

            a = a.priority || 0;
            b = b.priority || 0;
            return a - b;
        });

  
        template.fill(list);


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