


var prizeGroup = (function () {

    var $ = KISP.require('$');
    var n = $.Math.randomInt(1, 100);

    var prize = n <= 60 ? 0 :
            n <= 90 ? 1 : 2;

    console.log(prize);

    

    //(function () {
    //    var all = {
    //        1: 0,
    //        2: 0,
    //        3: 0,
    //    };

    //    for (var i = 1; i <= 10000; i++) {
    //        var n = $.Math.randomInt(1, 100);

    //        var prize = n <= 60 ? 1 :
    //                n <= 90 ? 2 : 3;

    //        all[prize]++;
    //    }

    //    console.log(all);
    //})();

    var list = [
        {
            name: '购房券5000元',
            url: './Resource/Images/5K.jpg',
            complete: false,
            success: false,
        },
        {
            name: '购房券10000元',
            url: './Resource/Images/10K.jpg',
            complete: false,
            success: false,
        },
        {
            name: '购房券15000元',
            url: './Resource/Images/15K.jpg',
            complete: false,
            success: false,
        },
    ];

    var item = list[prize];
    item.success = true;
    
    list = $.Array.random(list);

    console.dir(list);
    return list;


})();