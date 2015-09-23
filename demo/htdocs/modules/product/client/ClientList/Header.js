

define('/ClientList/Header', function (require, module, exports) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-client-list-header');
    var mask = null;
    var txt = null;

    panel.on('init', function () {


        mask = new KISP.create('Mask', {
            container: '#div-view-client-list',
            volatile: true,
            top: 44,
            opacity: 0.5,
            'z-index': 9999, //防止给 NoData 覆盖。
        });


        txt = document.getElementById('txt-client-list');
        var skey = '';


        $(txt).on({
            'focusin': function () {
                txt.value = skey;

                mask.show();
                panel.$.addClass('on');
                panel.$.toggleClass('has', !!txt.value);

            },

            'focusout': function () {
                panel.$.removeClass('has');
            },

            'input': function () {
                panel.$.toggleClass('has', !!txt.value);
                
            }

        });


        mask.on('hide', function () {
            panel.$.removeClass('on has');
            skey = txt.value || skey;
            txt.blur();
        });



        $('#btn-client-list-search').touch(function () {

            //防止 txt 的宽度瞬间回到 btn 所在的位置而导致点透
            setTimeout(function () {
                mask.hide();
            }, 200);

            var value = txt.value;
            skey = value || skey;

            panel.fire('search', [value]);

        });


        $('#btn-client-list-clear').touch(function () {
            var btn = this;
            txt.value = '';
            skey = '';
        
            panel.$.removeClass('has');

            panel.fire('clear');
        });


    });


    panel.on('reset', function () {
        mask && mask.hide();
    });


    panel.on('render', function () {

        txt.value = '';
  
    });



    return panel.wrap();

});