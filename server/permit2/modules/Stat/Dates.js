

var $ = require('../../lib/MiniQuery');


module.exports = {



    filter: function (dates, date) {
        if (!date) {
            return false;
        }

        try {
            date = $.Date.parse(date);
            date = $.Date.format(date, 'yyyyMMdd');
            date = Number(date);

            if (date < dates.begin || date > dates.end) {
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


};