

//setTimeout(start, 5000);
start();

function start() {

    var $ = require('./lib/MiniQuery');
    var DataBase = require('./lib/DataBase');
    var File = require('./lib/File');

    var args = process.argv;
    var name = args[2];

    if (!name) {
        throw new Error('请输入参数 name。');
    }

    var name$file = {
        'Land': 'land-list.json',
        'Plan': 'plan-list.json',
        'PlanLicense': 'plan-license-list.json',
        'Construct': 'construct-list.json',
        'Sale': 'sale-list.json',
        'SaleLicense': 'sale-license-list.json',
        'User': 'user-list.json',
    };


    var file = name$file[name];
    if (!file) {
        throw new Error('不存在 ' + name + ' 对应的数据文件记录。');
    }

    file = './data-old/' + file;

    if (!File.exists(file)) {
        throw new Error('不存在 ' + name + ' 对应的数据文件:', file);
    }


    var list = File.readJSON(file);
    var fails = [];

    var items = ({
        'Land': function () {
            return list;
        },

        'Plan': function () {
            var Land = new DataBase('Land');
            var id$item = Land.map('id');

            //过滤出能关联到 Land 的记录
            var items = list.filter(function (item) {
                if (id$item[item.landId]) {
                    return true;
                }

                fails.push(item);
                return false
            });

            return items;
        },

        'PlanLicense': function () {
            var Plan = new DataBase('Plan');
            var id$item = Plan.map('id');

            //过滤出能关联到 Plan 的记录
            var items = list.filter(function (item) {
                if (id$item[item.planId]) {
                    return true;
                }

                fails.push(item);
                return false
            });

            return items;
        },

        'Sale': function () {
            var Plan = new DataBase('Plan');
            var id$item = Plan.map('id');

            //过滤出能关联到 Plan 的记录
            var items = list.filter(function (item) {
                if (id$item[item.planId]) {
                    return true;
                }

                fails.push(item);
                return false
            });

            return items;
        },

        'Construct': function () {
            var PlanLicense = new DataBase('PlanLicense');
            var id$item = PlanLicense.map('id');

            //过滤出能关联到 PlanLicense 的记录
            var items = list.filter(function (item) {
                if (id$item[item.licenseId]) {
                    return true;
                }

                fails.push(item);
                return false
            });

            return items;
        },

        'SaleLicense': function () {
            var Sale = new DataBase('Sale');
            var id$item = Sale.map('id');

            //过滤出能关联到 PlanLicense 的记录
            var items = list.filter(function (item) {
                if (id$item[item.saleId]) {
                    return true;
                }

                fails.push(item);
                return false
            });

            return items;
        },


        


    })[name]();

    var db = new DataBase(name);
    items = db.add(items);
    

    console.log('从数据文件:', file, '到数据库:', name);
    console.log('成功导入 ' + items.length + ' 条记录。');
    console.log('忽略掉 ' + fails.length + ' 条记录:', JSON.stringify(fails, null, 4));

}






