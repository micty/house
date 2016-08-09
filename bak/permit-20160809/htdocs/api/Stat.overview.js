


KISP.proxy(function () {

    var list = [
        [
            { name: '土地出让', value: '1234567890', },
            { name: '已办规划许可', value: '1234567890', },
            { name: '已办施工许可', value: '1234567890', },
            { name: '已办预售许可', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],


        [
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],





        //--
        [
            { name: '规划差异调整', value: '1234567890', },
            { name: '未办规划许可', value: '1234567890', },
            { name: '已办提前介入', value: '1234567890', },
            { name: '已售房屋面积', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
            { name: '南庄镇', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
            { name: '石湾镇街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        [
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
            { name: '张槎街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],


        [
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
            { name: '祖庙街道', value: '1234567890', },
        ],
        [
            { name: '商业', value: '20000', },
            { name: '商业', value: '56000', },
            { name: '商业', value: '89000', },
            { name: '商业', value: '75000', },
        ],
        [
            { name: '住宅', value: '20000', },
            { name: '住宅', value: '56000', },
            { name: '住宅', value: '89000', },
            { name: '住宅', value: '75000', },
        ],
        [
            { name: '办公', value: '20000', },
            { name: '办公', value: '56000', },
            { name: '办公', value: '89000', },
            { name: '办公', value: '75000', },
        ],
        [
            { name: '其它', value: '20000', },
            { name: '其它', value: '56000', },
            { name: '其它', value: '89000', },
            { name: '其它', value: '75000', },
        ],

        //--
        [
            { name: '', value: '', },
            { name: '', value: '', },
            { name: '未办施工许可', value: '89000', },
            { name: '', value: '', },
        ],
        [
            { name: '可建面积合计', value: '89000', },
            { name: '应办规划许可面积合计', value: '20000', },
            { name: '应办施工许可面积合计', value: '75000', },
            { name: '预售未售面积合计', value: '56000', },
        ],

    ];


    var roles = ['土地出让', '已办规划许可', '已办施工许可', '已办预售许可', ];
    var towns = ['南庄镇', '石湾镇街道', '张槎街道', '祖庙街道', ];
    var uses = ['商业', '住宅', '办公', '其它', ];



    var data = [
        {
            name: '土地出让',
            value: '1234567890',
            uses: [
                { name: '商业', value: '20000', },
                { name: '住宅', value: '56000', },
                { name: '办公', value: '78000', },
                { name: '其它', value: '63000', },
            ],
            towns: [
                {
                    name: '南庄镇',
                    value: '6789000',
                    uses: [
                        { name: '商业', value: '20000', },
                        { name: '住宅', value: '56000', },
                        { name: '办公', value: '78000', },
                        { name: '其它', value: '63000', },
                    ],
                },
                {
                    name: '石湾镇街道',
                    value: '380000',
                    uses: [
                        { name: '商业', value: '20000', },
                        { name: '住宅', value: '56000', },
                        { name: '办公', value: '78000', },
                        { name: '其它', value: '63000', },
                    ],
                },
                {
                    name: '张槎街道',
                    value: '980000',
                    uses: [
                        { name: '商业', value: '20000', },
                        { name: '住宅', value: '56000', },
                        { name: '办公', value: '78000', },
                        { name: '其它', value: '63000', },
                    ],
                },
                {
                    name: '祖庙街道',
                    value: '860000',
                    uses: [
                        { name: '商业', value: '20000', },
                        { name: '住宅', value: '56000', },
                        { name: '办公', value: '78000', },
                        { name: '其它', value: '63000', },
                    ],
                },
            ],
        },
    ];




    return {
        code: 200,
        msg: 'ok',
        data: list,
    };

});

