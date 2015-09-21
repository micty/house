
KERP.Proxy.response(function (data, config) {


    return {
        "code": 200,
        "msg": "success",
        "data": {
            "total": 100,
            "items": $.Array.keep(0, data.data.pageSize, function (item, index) {

                return {
                    "isDisabled": false,
                    "spGroupID": 2,
                    "groupID": $.String.random() + " - 仓库类别ST02",
                    "memo": "备注",
                    "name": "test2",
                    "isNegStock": true,
                    "helpCode": $.String.random(),
                    "number": "002",
                    "stockID": 1,
                    "isStockPlace": true,
                    "typeID": 0
                };
            })
        }
    };

});
