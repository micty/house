

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');



    var Container = module.require('Container');
    var Todo = module.require('Todo');
    var Flow = module.require('Flow');
    var Query = module.require('Query');
    var Message = module.require('Message');

    Container.render();
    Todo.render();
    Flow.render();
    Query.render();
    Message.render();

});
