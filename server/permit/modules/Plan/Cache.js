
var Cache = require('../../lib/Cache');

var dbs = [
    'Land',
    'Plan',
    'PlanLicense',
];

var cache = new Cache('Plan');


module.exports = {

    getPage: function (data) {
        var json = cache.get('page', dbs, data);

        return json;
    },

    setPage: function (data, json) {
        cache.set('page', dbs, data, json);
    },
   
};