


; (function () {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KERP = require('KERP');

    var Iframe = KERP.require('Iframe');

    //检查登录 
    if (!KERP.Login.check(true)) {
        return;
    }

    var Container = require('Container');
    var Todo = require('Todo');
    var Flow = require('Flow');
    var Query = require('Query');
    var Message = require('Message');

    Container.render();
    Todo.render();
    Flow.render();
    Query.render();
    Message.render();



    // 从嵌入的目标 iframe 页面中获取 dialog 的数据:
    var dialog = Iframe.getDialog();
    if (dialog) {
        var data = dialog.getData();
        console.dir(data);
    }
    
    
    $(document).on('dblclick', function () {
        if (dialog) {
            dialog.setData({
                'data': 'new test'
            });

            dialog.remove();
        }
    });



    
})();
