/**
* 
*/
define('ImageUpload', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');//事件驱动器
    var API = require('CloudAPI');


   
    var loading = null;
    var toast = null;


    function init() {

        loading = loading || KISP.create('Loading', {
            cssClass: '',
            mask: 0,
            width: 140,
            text: '上传中...',
        });

        toast = toast || KISP.create('Toast', {
            icon: 'check',
            mask: 0,
            duration: 1200,
            text: '上传完成',
        });
    }


    function progress(count, total) {
        loading.show('上传中: ' + count + '/' + total);
    }


    function checkBase64(data) {

        if (typeof data != 'string') {
            return false;
        }

        return data.indexOf('data:') == 0;
    }
 



    function post(list, fn) {

        list = list || [];

        var total = list.length;
        var urls = list.slice(0);


        //统计数据
        var stats = {
            'total': total,
            'ignore': 0,
            'success': 0,
            'fail': 0,
        };

        if (total == 0) {
            fn && fn(urls, stats);
            return;
        }


        init();


        var count = 1;
        progress(count, total);

        
        

        //并发上传，全部完成后再执行回调
        $.Array.each(list, function (item, index) {

            if (!checkBase64(item)) { //非 base64，不需要上传
                stats.ignore++;
                checkDone();
                return;
            }


            var api = new API('UploadPhoto');

            api.on({
                'success': function (data, json) {
                    urls[index] = data[0].url; //上传成功，把 url 设置回原数组
                    stats.success++;
                },

                'fail': function (code, msg, json) {
                    stats.fail++;
                },

                'error': function () {
                    stats.fail++;
                },

                'done': checkDone,
            });


            api.post({
                'data': [item],
            });

        });



        function checkDone() {

            if (count < total) {
                count++;
                progress(count, total);
                return;
            }

            //全部完成
            loading.hide();
            toast.show();


            setTimeout(function () {

                fn && fn(urls, stats);

            }, 1200);

        }


    }





    return {
        post: post,
    };

});


