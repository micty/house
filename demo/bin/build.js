
/**
* 使用命令:
*   node build
*   node build dist
*   node build open
*   node build qr
*   node build dist qr
*/

var defaults = require('./config/config.js');
var Weber = require('./f/weber');
Weber.config(defaults);


var WebSite = Weber.require('WebSite');
var website = new WebSite();


var level = process.argv[2] || 'dist';
var action = process.argv[3];

//node build open
if (level == 'open' || level == 'qr') {
    action = level;
    level = 'dist';
}

var options = require('./config/' + level);

website.build(options, function () {

    var dir = options.dir;

    switch (action) {
        case 'open':
            website.open(dir);
            break;

        case 'qr':
            website.openQR(dir);
            break;
    }

});





