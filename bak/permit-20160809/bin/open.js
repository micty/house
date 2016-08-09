
/**
* 打开本轻应用在 IIS 上所对应的 url。
* 使用命令:
*   node open
*   node open localhost
*/

var defaults = require('./config/defaults.js');
var Weber = require('./f/weber');
Weber.config(defaults);


var WebSite = Weber.require('WebSite');
var website = new WebSite();

website.open({
    'host': process.argv[2],
});

