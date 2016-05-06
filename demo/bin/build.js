
/**
* 使用命令:
*   node build
*   node build dist
*   node build dist open
*   node build dist open localhost
*   node build open
*   node build open localhost
*   node build qr
*   node build qr 450
*   node build dist qr
*   node build dist qr 450
*/

var defaults = require('./config/config.js');
var Weber = require('./f/weber');
Weber.config(defaults);


var WebSite = Weber.require('WebSite');
var website = new WebSite();


var args = process.argv;
var level = args[2] || 'dist';
var action = args[3];

//node build open
//node build qr
if (level == 'open' || level == 'qr') {
    action = level;
    level = 'dist';
}

var options = require('./config/' + level);

website.build(options, function () {

    var dir = options.dir;
    var more = args[4] || args[3];
    if (more == action) {
        more = '';
    }

    switch (action) {
        case 'open':
            website.open({
                'dir': dir,
                'host': more,
            });
            break;

        case 'qr':
            website.openQR({
                'dir': dir,
                'width': more,
            });
            break;
    }

});





