

var level = process.argv[2] || 'dist';
var defaults = require('./config/config.js');
var options = require('./config/' + level);

var Weber = require('Weber');

Weber.config(defaults);
Weber.build(options);





