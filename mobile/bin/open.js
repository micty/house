
/**
* 打开本轻应用在 IIS 上所对应的 url。
* 使用命令:
*   node open
*/

var defaults = require('./config/config.js');
var Weber = require('./f/weber');
Weber.config(defaults);


var WebSite = Weber.require('WebSite');
var website = new WebSite();
website.open();

