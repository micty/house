/**
*
*/
define('/Login/Dialog', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = KISP.require('MiniQuery');

    var Url = MiniQuery.require('Url');

    var YunZhiJia = require('YunZhiJia');
    var SendCloudMsg = require('SendCloudMsg');

    
    

    function render(data, json) {

        var dialog = KISP.create('Dialog', {
            title: '没有权限',
            text: '你还没有使用权限，是否立即申请?',
            buttons: [
                { text: '暂不申请', name: 'cancel', color: 'red', },
                { text: '立即申请', name: 'ok', },
            ],
            height: 140,
            autoClosed: false, //不要自动关闭
        });

        dialog.on('click', 'button', 'cancel', function () {
            dialog.hide();
            YunZhiJia.closeWebApp();
        });

        dialog.on('click', 'button', 'ok', function () {

            var loading = KISP.create('Loading', {
                mask: 0,
                'z-index': 1025,
            });
            loading.show('申请提交中...');


            var name = data.name || '';
            var phone = data.userName || json.Data.mobile || '';

            var url = KISP.data('MessageUrl').vCRM;

            url = Url.addQueryString(url, {
                'msg': 100,  // 申请标记100
                'name': encodeURIComponent(name),
                'phone': encodeURIComponent(phone),
            });

            url = encodeURI(url);


            SendCloudMsg.joinVCRM({
                'name': name,
                'phone': phone,
                'url': url,

            }, function () {

                dialog.hide();
                loading.hide();

                KISP.alert('申请请求已经发送，请等待审核', function () {
                    YunZhiJia.closeWebApp();
                });
            });

        });

        dialog.show();
    }


    return {
        render: render,
    };

});