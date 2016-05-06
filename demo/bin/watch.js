
/**
* 使用命令:
*   node watch
*   node watch open
*   node watch open localhost
*   node watch qr
*   node watch qr 450
*/

var defaults = require('./config/config.js');
var Weber = require('./f/weber');
Weber.config(defaults);


var WebSite = Weber.require('WebSite');
var website = new WebSite();

website.watch(function () {

    var args = process.argv;
    var action = args[2];

    switch (action) {
        case 'open':
            website.open({
                'host': args[3],
            });
            break;

        case 'qr':
            website.openQR({
                'width': args[3],
            });
            break;
    }

});

