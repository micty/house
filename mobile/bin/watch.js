
/**
* 使用命令:
*   node watch
*   node watch open
*   node watch qr
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
            website.open();
            break;

        case 'qr':
            website.openQR();
            break;
    }

});

