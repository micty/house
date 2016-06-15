

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;

    panel.on('init', function () {
        panel.$.on('click', '[data-cmd]', function () {

            var cmd = this.getAttribute('data-cmd');
            cmd = cmd.split('.')[0];

            var data = current[cmd];
            panel.fire('detail', [cmd, data]);
        });
    });


    panel.on('render', function (data) {
        current = data;
        data = $Object.linear(data);
        panel.fill(data);

    });


    return panel.wrap();


});