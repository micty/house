

var $ = require('../../lib/MiniQuery');


module.exports = {



    filter: function (dates, dt) {
        if (!dt) {
            return false;
        }

        try {
            dt = $.Date.parse(dt);
            dt = $.Date.format(dt, 'yyyyMMdd');
            dt = Number(dt);

            if (dt < dates.begin || dt > dates.end) {
                return false;
            }

            return true;
        }
        catch (ex) {
            return false;
        }
    },

    normalize: function (data) {
        var beginDate = data.beginDate || '';
        var endDate = data.endDate || '';


        //如果指定了开始时间或结束时间，
        if (beginDate || endDate) {
            beginDate = beginDate.split('-').join('');
            beginDate = Number(beginDate);

            endDate = Number(endDate.split('-').join('')) || 20960101;
        }


        return beginDate || endDate ? {

            'begin': beginDate,
            'end': endDate,

        } : null;
    },

    toNumber: function (datetime) {
        var dt = datetime.split(' ')[0].split('-').join('');
        dt = Number(dt);
        return dt;
    },


};