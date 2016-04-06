

//全局配置。
var defaults = require('./config/config.js');

var Weber = require('Weber');
Weber.config(defaults);

var WebSite = Weber.require('WebSite');
var website = new WebSite();

website.stat();

   

