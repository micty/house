


function Response(res) {
    this.res = res;
}

Response.prototype = {

    send: function (json) {
        this.res.send(json);
    },

    success: function (data) {
        this.res.send({
            code: 200,
            msg: 'ok',
            data: data,
        });
    },

    empty: function (key) {
        this.res.send({
            code: 201,
            msg: '字段 ' + key + ' 不能为空。',
        });
    },

    none: function () {
        this.res.send({
            code: 404,
            msg: '不存在该记录。',
        });

    },

    error: function (ex) {
        this.res.send({
            code: 500,
            msg: ex.message,
        });
    },
};




function use(app, options) {

    var M = options.module;
    var base = options.base;

    [
        'get',
        'post',

    ].forEach(function (method) {

        var list = options[method];
        if (!list) {
            return;
        }

        list.forEach(function (name) {

            var route = base + name;

            app[method](route, function (req, res) {

                var fn = M[name];

                if (typeof fn != 'function') {
                    res.send({
                        code: 500,
                        msg: '模块中不存在 ' + name + ' 方法',
                    });
                    return;
                }

                res = new Response(res);
                fn.call(M, req, res);

            });

        });

    });
}


module.exports = {
    'use': use,
};