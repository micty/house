
/**
* 标准分页控件助手
*/
define('Pager/Helper', function (require, module) {

    var $ = require('$');


    /**
    * 根据总页数和当前页计算出要填充的区间。
    * @param {number} count 总页数。
    * @param {number} current 当前激活的页码。
    * @return {Array} 返回一个区间描述的数组。
    */
    function getRegions(count, current) {

        if (count <= 10) {
            return [
                {
                    from: 1,
                    to: count,
                    more: false
                }
            ];
        }

        if (current <= 3) {
            return [
                {
                    from: 1,
                    to: 5,
                    more: true
                }
            ];
        }

        if (current <= 5) {
            return [
                {
                    from: 1,
                    to: current + 2,
                    more: true
                }
            ];
        }

        if (current >= count - 1) {
            return [
                {
                    from: 1,
                    to: 2,
                    more: true
                },
                {
                    from: count - 5,
                    to: count,
                    more: false
                }
            ];
        }

        return [
            {
                from: 1,
                to: 2,
                more: true
            },
            {
                from: current - 2,
                to: current + 2,
                more: current + 2 != count
            }
        ];
    }

    /**
    * 根据总页数、当前页和上一页预测出要跳转的页码。
    * @param {number} count 总页数。
    * @param {number} current 当前激活的页码。
    * @param {number} last 上一页的页码。
    * @return {number} 返回一个跳转的页码。
    */
    function getJumpNo(count, current, last) {

        if (count <= 1) { // 0 或 1
            return count;
        }

        if (current == count) {
            return count - 1;
        }

        var no;

        if (current > last) {
            no = current + 1;
        }
        else {
            no = current - 1;
            if (no < 1) {
                no = 2;
            }
        }

        return no;

    }



    return {
        'getRegions': getRegions,
        'getJumpNo': getJumpNo,
    };




});

