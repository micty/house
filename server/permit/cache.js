

//setTimeout(start, 5000);
start();

function start() {

    var $ = require('./lib/MiniQuery');
    var Router = require('./lib/Router');

    //https://github.com/Marak/colors.js
    var colors = require('colors');

    var res = {
        send: function () {},
    };
    res = new Router.Response(res);


    task();

    (function (timeout) {
        var next = arguments.callee;
        setTimeout(function () {
            task();
            next(timeout);
        }, timeout);
    })(1000 * 3600);
   


    function datetime(value) {
        value = value || new Date();
        return $.Date.format(value, 'yyyy-MM-dd HH:mm:ss').gray;
    }

    function post(M, name, data) {
        var req = {
            'body': {
                'data': data,
            },
        };

        console.log(data);

        var methodName = M + '.' + name;

        var begin = new Date();
        console.log(datetime(begin), '开始请求:'.yellow, methodName.cyan);

        M = require('./modules/' + M);
        M[name](req, res);

        var end = new Date();
        var cost = (end - begin) / 1000;

        console.log(datetime(end), '结束请求:'.green, methodName.cyan, '花费:', cost.toString().magenta, '秒');
       
    }

    function task() {
        var begin = new Date();
        console.log('开始任务:'.bgMagenta, datetime(begin));

        cacheList(20);
        cacheStat();

        var end = new Date();
        var cost = (end - begin) / 1000;
        console.log('结束任务:'.bgGreen, datetime(end), '花费:', cost.toString().magenta, '秒');
        console.log('Waiting...');
    }

    function cacheList(pageCount) {
        for (var pageNo = 1; pageNo < pageCount; pageNo++) {
            var data = {
                pageNo: pageNo,
                pageSize: 20,
                keyword: '',
            };

            post('Plan', 'todos', data);
            post('Plan', 'page', data);
            post('Construct', 'todos', data);
            post('Construct', 'page', data);
            post('Sale', 'todos', data);
            post('Sale', 'page', data);
        }
    }

    function cacheStat() {

        //统计一览表
        post('Stat', 'all', {
            beginDate: '',
            endDate: '',
        });

        //区域统计
        var towns = [
           { key: '南庄', name: '南庄', },
           { key: '石湾', name: '石湾', },
           { key: '张槎', name: '张槎', },
           { key: '祖庙', name: '祖庙', },
        ];
        towns.forEach(function (item) {
            post('Stat', 'town', {
                beginDate: '',
                endDate: '',
                town: item.key,
            });

        });

        //板块统计
        var roles = [
            { key: 'land', name: '土地', },
            { key: 'plan', name: '规划', },
            { key: 'construct', name: '建设', },
            { key: 'sale', name: '销售', },
        ];
        roles.forEach(function (item) {
            post('Stat', 'role', {
                beginDate: '',
                endDate: '',
                role: item.key,
            });
        });

        //功能统计
        var uses = [
           { key: 'residenceSize', name: '住宅', },
           { key: 'commerceSize', name: '商业', },
           { key: 'officeSize', name: '办公', },
           { key: 'otherSize', name: '计容面积其它', },
           { key: 'parkSize', name: '地下车库', },
           { key: 'otherSize1', name: '不计容面积其它', },
        ];

        uses.forEach(function (item) {
            post('Stat', 'use', {
                beginDate: '',
                endDate: '',
                use: item.key,
            });
        });

        //自建房统计
        post('Stat', 'diy', {
            beginDate: '',
            endDate: '',
        });

    }

}






