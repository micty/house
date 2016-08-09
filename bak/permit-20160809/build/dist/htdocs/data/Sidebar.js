var __Sidebar__ = [
    //{
    //    icon: 'star',
    //    name: '首页',
    //    url: 'html/home/index.html',
    //    autoOpen: true,
    //},

    {
        icon: 'cube',
        name: '土地管理',
        url: 'html/land/list/index.html',
        //autoOpen: true,
        cmd: ['land', 'list'],
    },
    {
        icon: 'th-large',
        name: '规划管理',
        url: 'html/plan/list/index.html',
        //autoOpen: true,
        cmd: ['plan', 'list'],
    },
    {
        icon: 'truck',
        name: '建设管理',
        url: 'html/construct/list/index.html',
        //autoOpen: true,
        cmd: ['construct', 'list'],
    },
    {
        icon: 'credit-card',
        name: '销售管理',
        url: 'html/sale/list/index.html',
        //autoOpen: true,
        cmd: ['sale', 'list'],
        border: true,
    },


    {
        icon: 'plus',
        name: '土地出让发布',
        url: 'html/land/add/index.html',
        cmd: ['land', 'add'],
        //autoOpen: true,
        display: false,
    },
    {
        icon: 'plus',
        name: '规划许可发布',
        url: 'html/plan/add/index.html',
        cmd: ['plan', 'add'],
        display: false,

    },
    {
        icon: 'plus',
        name: '建设许可发布',
        url: 'html/construct/add/index.html',
        cmd: ['construct', 'add'],
        display: false,

    },
    {
        icon: 'plus',
        name: '销售许可发布',
        url: 'html/sale/add/index.html',
        cmd: ['sale', 'add'],
        display: false,

    },
    {
        icon: 'plus',
        name: '用户发布',
        url: 'html/user/add/index.html',
        cmd: ['user', 'add'],
        display: false,
    },

    {
        icon: 'plus',
        name: '销售记录导入',
        url: 'html/sale/import/index.html',
        cmd: ['sale', 'import'],
        display: false,

    },

    ////详情页
    //{
    //    icon: '',
    //    name: '土地出让详情',
    //    url: 'html/land/detail/index.html',
    //    cmd: ['land', 'detail'],
    //    display: false,
    //},


    {
        icon: 'table',
        name: '统计报表',
        url: 'html/stat/all/index.html',
    },
    {
        icon: 'area-chart',
        name: '区域统计表',
        url: 'html/stat/town/index.html?type=table',
    },
    {
        icon: 'bar-chart',
        name: '板块统计表',
        url: 'html/stat/role/index.html?type=table',
    },
    {
        icon: 'line-chart',
        name: '功能统计表',
        url: 'html/stat/use/index.html?type=table',
    },
    {
        icon: 'line-chart',
        name: '自建房统计表',
        url: 'html/stat/diy/index.html?type=table',
        border: true,
    },

    {
        icon: 'area-chart',
        name: '区域统计图',
        url: 'html/stat/town/index.html?type=chart',
    },
    {
        icon: 'bar-chart',
        name: '板块统计图',
        url: 'html/stat/role/index.html?type=chart',
    },
    {
        icon: 'line-chart',
        name: '功能统计图',
        url: 'html/stat/use/index.html?type=chart',
    },
    {
        icon: 'line-chart',
        name: '自建房统计图',
        url: 'html/stat/diy/index.html?type=chart',
        border: true,
    },



    {
        icon: 'user',
        name: '用户管理',
        url: 'html/user/list/index.html',
        cmd: ['user', 'list'],
    },

    {
        icon: 'tree',
        name: '逻辑流程图',
        url: 'html/doc/tree/index.html',
      
    },

];