
define('/Chart', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var Chart = require('Chart');
    var Color = module.require('Color');

    var panel = KISP.create('Panel', '#div-chart');
    var chart = null;


    panel.on('init', function () {

        var canvas = document.getElementById('canvas-chart');
        var context = canvas.getContext('2d');

        chart = new Chart(context, {
            type: 'bar',
            data: {
                'labels': [],   
                'datasets': [], //初始时要指定空值。
            },
        });

    });



    panel.on('render', function (rows) {


        console.dir(rows);

        var labels = [];
        var sets = rows.slice(0, 9).map(function (row, index) {

            return {
                'backgroundColor': Color.get(index, 0.3),
                'borderColor': Color.get(index, 1),
                'borderWidth': 1,
                'hoverBackgroundColor': Color.get(index, 0.5),
                'hoverBorderColor': Color.get(index, 1),

                'label': index == 0 ? '合计' : row[0].name,

                'data': row.map(function (item) {
                    if (index == 0) {
                        labels.push(item.name);
                    }

                    return item.value.toFixed(2);

                }),
            };

           
        });

        //因为对象的引用关系，这里不能设置 chart.data 为一个新的对象，只能修改原有的字段。
        $.Object.extend(chart.data, {
            'labels': labels,
            'datasets': sets,
        });

        chart.update();


    });



    return panel.wrap();


});