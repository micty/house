

var canvas = document.getElementById('canvas');
canvas.setAttribute("width", document.body.clientWidth);
canvas.setAttribute("height", document.body.clientHeight);

var ctx = canvas.getContext('2d');
var game, stage;
var prize = null;
var egg, prizes = [], beat;
var count = 1, place = 0;
var boxs;

var loading;
var colorParticles = [], logos = [];


for (var i = 0; i < prizeGroup.length; i++) {
    if (!prizeGroup[i]['success']) {
        prizeGroup[i]['url'] = Resource['unprize']['url'];
    }

    Resource['prize' + i] = {
        name: prizeGroup[i]['name'],
        url: prizeGroup[i]['url'],
        width: 200,
        success: prizeGroup[i]['success'],
        complete: prizeGroup[i]['complete']
    };
    if (prizeGroup[i]['complete']) {
        prizeGroup[i]['img'] = prizeGroup[i]['url'];
    }
    else {
        prizeGroup[i]['img'] = Resource['egg']['url'];
    }

    prizeGroup[i]['i'] = (i + 1);
}





