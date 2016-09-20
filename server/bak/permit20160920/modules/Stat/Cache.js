
var Cache = require('../../lib/Cache');


var dbs = [
    'Land',
    'Plan',
    'PlanLicense',
    'Construct',
    'Sale',
    'SaleLicense',
    'Saled',
];

var cache = new Cache('Stat');


module.exports = {

    get: function (name, data) {
        var json = cache.get(name, dbs, data);
        return json;

    },

    set: function (name, data, json) {
        cache.set(name, dbs, data, json);
    },
};