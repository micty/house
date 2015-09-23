


; (function (Lib, PageNs) {



var Form = (function () {

    var btnSave = document.getElementById('btnSave');
    var btnCancel = document.getElementById('btnCancel');


    var fields = [
        'Code',
        'Name',
        'Limit',
        'Weight',
        'Long',
        'Width',
        'Height',
        'Comment'
    ];

    function save() {


        disable();

        var data = {
            cmd: 'add'
        };

        $.Array.each(fields, function (field, index) {
            data['product' + field] = $('#txt' + field).val();
        });


        Lib.API.post('product/product', data, function (data, json) {

            alert('保存成功');

            reset(true);


        }, function (code, json) {

            alert(json.message);
            reset();

        }, function () {

            alert('网络错误，请稍候再试');
            reset();

        });
    }


    function reset(empty) {
        btnSave.disabled = false;
        btnSave.innerHTML = '保存';
        $(btnCancel).show();

        $.Array.each(fields, function (field, index) {
            var txt = $('#txt' + field).attr('readonly', false);
            if (empty) {
                txt.val('');
            }
        });
    }

    function disable() {

        $.Array.each(fields, function (field, index) {
            $('#txt' + field).attr('readonly', true);
        });

        btnSave.disabled = true;
        btnSave.innerHTML = '保存中，请稍候...';
        $(btnCancel).hide();
    }

    return {
        save: save
    };



})();

//开始
(function () {





    $('#btnSave').click(function () {

        Form.save();
        
    });
    

})();
    



})(Lib, window.PageNs = window.PageNs || {});