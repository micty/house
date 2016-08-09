
/**
* 编译使用独立打包的版本并进行监控。
* 使用命令:
*   node watch-pack
*   node watch-pack open
*   node watch-pack open localhost
*   node watch-pack qr
*   node watch-pack qr 450
*/

var defaults = require('./config/defaults.js');
var packages = require('./config/defaults-pack.js');

var Weber = require('./f/weber');
Weber.config(defaults);
Weber.config(packages);


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

