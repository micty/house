





(function (Chart) {

    var randomScalingFactor = function () { return Math.round(Math.random() * 100) };

    var data = {
        labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: (function () {
                    var a = [];
                    for (var i = 0; i < 12; i++) {
                        var item = Math.round(Math.random() * 100);
                        a.push(item);
                    }
                    return a;
                })()
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: (function () {
                    var a = [];
                    for (var i = 0; i < 12; i++) {
                        var item = Math.round(Math.random() * 100);
                        a.push(item);
                    }
                    return a;
                })()
            }
        ]

    }


    var canvas = document.getElementById('canvas').getContext('2d');

    var line = new Chart(canvas).Line(data, {});

})(window.Chart);