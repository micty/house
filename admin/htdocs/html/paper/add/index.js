

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');
   
    var API = module.require('API');
    var Content = module.require('Content');
    var Footer = module.require('Footer');
    var Title = module.require('Title');


    var type = '';
    var id = 0;
    var name = '';

    var type$name = {
        'news': '新闻资讯',
        'policy': '政策法规',
        'house': '楼盘资讯',
    };


    API.on('success', {

        'post': function (data, json) {
            Title.clear();
            Content.clear();
        },

        'get': function (data) {
            Title.render(name, data.title);
            Content.render(data.content);
            Footer.render(name);
        },

    });




    Footer.on('submit', function () {

        var title = Title.get();
        if (!title) {
            alert('请输入标题');
            return;
        }

        var content = Content.get();
        if (!content) {
            alert('请输入内容');
            return;
        }

        API.post({
            'id': id,
            'type': type,
            'title': title,
            'content': content,
        });
    });

    
   

    var qs = Url.getQueryString(window);

    type = qs.type;
    id = qs.id;
    name = type$name[type];


    ////test
    //id = '965C39EE19C4';
    //type = 'news';


    if (id) { //说明是编辑的
        API.get(type, id);
        return;
    }


    //add
    Title.render(name);
    Content.render();
    Footer.render(name);

    



});
