



//可以生成很复杂的动态数据，并根据提交的参数进行处理。
//具有真正模拟后台逻辑的能力。
KERP.Proxy.response(function (data, config) {
    
    //debugger;

    // data.action 的分支逻辑
    return ({

        //注销
        'logout': function () {
            return {
                "code": 200,
                "msg": "",
                "data": {}
            };
        },

        //登录
        'login': function () {

            //模拟的用户列表数据
            var list = {
                'manager': {
                    'pwd': '098f6bcd4621d373cade4e832627b4f6', // 'test'
                    "userID": 2,
                    "number": "manager",
                    "name": "管理员"
                },
                'test': {
                    'pwd': '202cb962ac59075b964b07152d234b70', // '123'
                    "userID": 1,
                    "number": "test",
                    "name": "测试用户"
                }
            };


            var user = list[data.user];

            if (!user || data.pwd != user.pwd) {
                return {
                    "code": 201,
                    "msg": "用户名或密码错误",
                    "data": {}
                };
            }


            return {
                "code": 200,
                "msg": "",
                "data": $.Object.remove(user, 'pwd') //移除 pwd 字段
            };
        }

    })[data.action]();

});

