

//全局配置。
var defaults = require('./config/config.js');
var Weber = require('./f/weber');
var WebSite = Weber.require('WebSite');


Weber.config(defaults);

var website = new WebSite();
website.stat();

   

