

define('/Events/Notice', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var Tabs = module.require('Tabs');

    var panel = KISP.create('Panel', '#div-events-notice');


    panel.on('init', function () {

        panel.template(['item'], function (data, index) {

            return {
                data: {
                    'title': data.title,
                    'url': data.footer.url,
                    'src': data.footer.src,
                },

                list: data.contents,

                fn: function (item, index) {
                    return {
                        data: {
                            'text': item,

                        },
                    };
                },
            };
        });


    });



    panel.on('render', function (data) {
       

        data = data || {
            title: '活动公告',
            contents: [
                '时间：2016年4月29日至2016年8月31日',
                '活动名称：“广佛同城 魅力禅城”2016佛山（禅城）第二届O2O网上房博会',
                '发布地点：广州市荔湾区西城都荟广场',
                '主办单位：禅城区房地产业协会',
                '协办单位：禅城区国土和城建水务局、禅城区委宣传部、禅城区经济和科技促进局',
            ],
            footer: {
                url: 'http://www.fsccjys.gov.cn/index.jsp',
                src: 'style/img/net-sign.jpg',
            },
        };

        panel.fill(data);
        
    });



    return panel.wrap();



});