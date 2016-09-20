
var Cache = require('../../lib/Cache');


var dbs = [
    'Land',
    'Plan',
    'Sale',
    'SaleLicense',
];


var cache = new Cache('Sale');


module.exports = {

    getTodos: function (data) {
        var json = cache.get('todos', dbs, data);
        return json;
    },

    setTodos: function (data, json) {
        cache.set('todos', dbs, data, json);
    },


    getPage: function (data) {
        var json = cache.get('page', dbs, data);
        return json;
    },

    setPage: function (data, json) {
        cache.set('page', dbs, data, json);
    },

   
};