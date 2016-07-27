
/**
* 构建使用独立打包的版本。
* 使用命令:
*   node build-pack
*   node build-pack dist
*   node build-pack dist open
*   node build-pack dist open localhost
*   node build-pack open
*   node build-pack open localhost
*   node build-pack qr
*   node build-pack qr 450
*   node build-pack dist qr
*   node build-pack dist qr 450
*/

var defaults = require('./config/defaults.js');
var packages = require('./config/defaults-pack.js');

var Weber = require('./f/weber');
Weber.config(defaults);
Weber.config(packages);


var WebSite = Weber.require('WebSite');
var website = new WebSite();


var args = process.argv;
var level = args[2] || 'dist';
var action = args[3];

//node build-pack open
//node build-pack qr
if (level == 'open' || level == 'qr') {
    action = level;
    level = 'dist';
}

var options = require('./config/' + level);
var optionsPack = require('./config/' + level + '-pack');

//合并
for (var key in optionsPack) {
    options[key] = optionsPack[key];
}



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





