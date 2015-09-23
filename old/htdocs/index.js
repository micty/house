





seajs.use(['dialog'], function (Dialog) {

    var d = Dialog({
        id: 'align-test',
        title: '消息',
        content: '风吹起的青色衣衫，夕阳里的温暖容颜，你比以前更加美丽，像盛开的花<br>——许巍《难忘的一天》',
        okValue: '确 定',
        ok: function () {

        },
        cancelValue: '取消',
        cancel: function () {

        }
    });

    d.show();


});
