
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Column = module.require('Column');
    var Group = module.require('Group');
    var List = module.require('List');



    


    function format(data) {

        var total = {
            land: 0,
            prepare: 0,
            doing: 0,
        };

        var saledTotal = {
            prepare: 0,
            doing: 0,
        };

        //标准
        var groups = Group.getStandards(data);

        total.land = groups[0].value;
        total.prepare = groups[3].value;
        total.doing = groups[4].value;



        var cols = $.Array.keep(groups, function (group) {
            return Column.get(group);
        });

        //规划差异调整。
        var adjusts = Group.get('', []);
        adjusts = Column.get(adjusts);
        adjusts.forEach(function (item) {
            item.text = '';
            item.value = '';
        });



        //未办规划许可。
        var unplans = List.minus(cols[0], cols[1]);
        unplans[0].text = '未办规划许可';
     
        //未办施工许可。
        //未办施工许可 = 土地出让 - 已办施工许可
        var unconstructs = List.minus(cols[0], cols[2]);
        unconstructs[0].text = '未办施工许可';


        //预售已售房屋面积。 
        var saled_prepares = Group.get('预售已售房屋面积', data['saled-prepares']);
        saledTotal.prepare = saled_prepares.value;
        saled_prepares = Column.get(saled_prepares);


        //现售已售房屋面积。 
        var saled_doings = Group.get('现售已售房屋面积', data['saled-doings']);
        saledTotal.doing = saled_doings.value;
        saled_doings = Column.get(saled_doings);

       
        cols[0] = cols[0].concat(adjusts);
        cols[1] = cols[1].concat(unplans);
        cols[2] = cols[2].concat(unconstructs);
        cols[3] = cols[3].concat(saled_prepares);
        cols[4] = cols[4].concat(saled_doings);


        //对数组进行转置。 即把数组的行与列对换，返回一个新数组。
        var rows = $.Array.transpose(cols);
    

        return {
            'rows': rows,
            'total0': total.land - saledTotal.prepare - saledTotal.doing,
            'total1': total.prepare + total.doing - saledTotal.prepare - saledTotal.doing,
        };

    }








    return {
        'format': format,
    };

});