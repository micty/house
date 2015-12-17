

var canvas = document.getElementById('canvas');
canvas.setAttribute("width", document.body.clientWidth);
canvas.setAttribute("height", document.body.clientHeight);

var ctx = canvas.getContext('2d');
var game, stage;
var prize = null;
var egg, prizes = [], beat;
var count = 1, place = 0;
var boxs;
var eggI;
var loading;
var colorParticles = [], logos = [];

var Resource = {
    "egg": { name: "舞台金蛋", url: "./Resource/Images/beta/egg.png" },
    "egg1": { name: "金蛋", url: "./Resource/Images/beta/egg1.png" },
    "egg2_1": { name: "金蛋碎开前景", url: "./Resource/Images/beta/egg2_1.png" },
    "egg2_2": { name: "金蛋碎开背景", url: "./Resource/Images/beta/egg2_2.png" },
    "goback": { name: "返回菜单", url: "./Resource/Images/beta/goback.png" },
    "start": { name: "开始菜单", url: "./Resource/Images/beta/start.png" },
    "gs": { name: "光束", url: "./Resource/Images/beta/gs.png" },
    "gs2": { name: "光束2", url: "./Resource/Images/beta/gs2.png" },
    "coin": { name: "金币", url: "./Resource/Images/beta/coin.png" },
    "bg": { name: "列表背景", url: "./Resource/Images/beta/bg.jpg" },
    "stage_bg": { name: "舞台背景", url: "./Resource/Images/beta/stage_bg.jpg" },
    "gash": { name: "裂纹", url: "./Resource/Images/beta/gash.png" },
    "gift": { name: "礼品", url: "./Resource/Images/beta/gift.png" },
    "beat": { name: "锤子", url: "./Resource/Images/beta/beat.png" },
    "bong": { name: "Bong", url: "./Resource/Images/bong.png" },
    "unprize": { name: '无奖', url: "./Resource/Images/unprize.jpg" },
    "color": { name: '彩带花絮', url: "./Resource/Images/beta/color.png" },
    "logo": { name: 'logo', url: "./Resource/Images/beta/logo.png" }
};

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
    } else {
        prizeGroup[i]['img'] = Resource['egg']['url'];
    }

    prizeGroup[i]['i'] = (i + 1);
}


// 烟火效果
var fireworks = [], particles = [], bongs = [], hue = random(0, 255);

// 资源统计
var ResourceTotalCount = 0, ResourceCurrentCount = 0;
for (var i in Resource) {
    if (Resource.hasOwnProperty(i)) {
        ResourceTotalCount++;
    }
}

// 资源加载
for (var i in Resource) {
    if (Resource.hasOwnProperty(i)) {
        Resource[i]['image'] = new Image();
        Resource[i]['image'].src = Resource[i]['url'];
        Resource[i]['image'].onload = function () {
            ResourceCurrentCount++;
            if (ResourceCurrentCount >= ResourceTotalCount) {
                // 计算高度
                for (var i in Resource) {
                    if (Resource.hasOwnProperty(i)) {
                        if (Resource[i]['width']) {
                            Resource[i]['height'] = Resource[i]['width'] / Resource[i]['image']['width'] * Resource[i]['image']['height'];
                        }
                        if (Resource[i]['height']) {
                            Resource[i]['width'] = Resource[i]['height'] / Resource[i]['image']['height'] * Resource[i]['image']['width'];
                        }
                    }
                }
                // 资源加载完成，开始游戏
                game = new Game(canvas);
                game.createGameScene(prize);
                console.log('ResourceCurrentCount=' + ResourceCurrentCount);
            }
        }
    }
}

// 获取游戏资源
function getRes(name) {
    var res = Resource[name];
    if (!res['width']) {
        res['width'] = res['image']['width'];
        res['height'] = res['image']['height'];
    }
    return res;
}


// 游戏主体部分
function Game(canvas) {
    var _this = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stageW = canvas.width;
    this.stageH = canvas.height;
    this.cw = window.innerWidth;
    this.ch = window.innerHeight;

    this.createGameScene = function (prize) {
        this.prize = prize;
        this.start();
    };

    this.start = function () {
        render();
    };

    // 页面DOM渲染
    function render() {
        var Htm = $('#eggTmpl').tmpl(prizeGroup);
        $('#egg-container ul').append(Htm);

        // 添加事件
        boxs = $('.prize-egg-a', Htm);
        boxs.bind('click', function (e) {
            eggI = boxs.index($(this));
            checkPrize();
        });

        var btns = $('.canvas-tool a');
        btns.bind('click', function (e) {
            var tar = e.target, cTar = e.currentTarget;

            if ($(tar).hasClass('cancel')) {
                cancelCanvas();
            }
            if ($(tar).hasClass('beat-egg')) {
                beatEgg();
                // 砸蛋开始后，隐藏“取消”和“砸蛋”按钮
                $('#cancel-btn').addClass('hidden');
                $('#beat-egg-btn').addClass('hidden');
            }
            if ($(tar).hasClass('close')) {
                closeCanvas();
            }
        });
    }

    // 检测奖品
    function checkPrize() {
        var prize = prizeGroup[eggI];
        if (prize['complete']) {
            alert('对不起，金蛋已经砸开！');
        } else {
            var box = boxs.eq(eggI);
            if (box.hasClass('doing')) return;
            if (prize['success']) {
                success();
            } else {
                lose();
            }
            box.addClass('doing').animate({ opacity: 0 }, 1000, function () { });
        }
    }

    function success() {
        console.log('success');
        openCanvas();
    }

    function lose() {
        console.log('lose');
        openCanvas();
    }

    function openCanvas() {
        $('#close-btn').addClass('hidden');
        $('#cancel-btn').removeClass('hidden');
        $('#beat-egg-btn').removeClass('hidden');
        $('#canvas-box').addClass('top').show();
        $('#main').hide();
        createEgg();
        stage = new Stage(_this.ctx);

    }

    function cancelCanvas() {
        var box = boxs.eq(eggI);
        box.css({ opacity: 1 }).removeClass('doing');
        $('#main').show();
        $('#canvas-box').removeClass('top').hide();
    }

    function closeCanvas() {
        // 清除Canvas数据
        prizes = [];
        egg = null;
        particles = [];
        stage = null;
        fireworks = [];
        bongs = [];

        // 视图展现
        $('#main').show();
        $('#canvas-box').removeClass('top').hide();
    }

    function createEgg() {
        var eggRes = getRes('egg');
        var x = (_this.stageW - eggRes['width']) / 2;
        var y = _this.stageH - eggRes['height'] - 10;
        egg = new Egg(_this.ctx, x, y);
    }

    function beatEgg() {
        beat = new Beat(_this.ctx);
    }


    this.restart = function () {

    };

    function frameLoop() {
        requestAnimFrame(frameLoop);

        _this.ctx.fillRect(0, 0, _this.stageW, _this.stageH);
        // 舞台
        if (stage) {
            stage.draw();
            stage.update();
        }
        // 烟花效果 Start
        hue += 0.5;

        if (egg) {
            egg.draw();
            egg.update();
            // 砸蛋效果进行中...
            if (egg['status'] == 1) {
                // 创建效果
                if (!bongs.length && egg['bong'] == 0) {
                    egg['bong'] = 1;
                }
            }
            // 砸蛋结束
            if (egg['status'] == 2) {

                // 显示礼品
                if (!prizes.length) {

                    var prizeRes = getRes('prize' + eggI);
                    var x = (_this.stageW - prizeRes['width']) / 2;
                    var y = (_this.stageH - prizeRes['height']) * 3 / 7 + 50;
                    prizes.push(new Prize(_this.ctx, x, y));

                    // 礼品出现后，打开“关闭”按钮，并显示出页面上金蛋对应的礼品
                    $('#close-btn').removeClass('hidden');
                    var prizeObj = getRes('prize' + eggI);
                    boxs.eq(eggI).parent().addClass('complete').end().removeClass('doing').css('opacity', 1).find('img').attr('src', prizeObj['url']);

                    $('#canvas-tool').hide();
                    if (!prizeRes['success']) {
                        boxs.eq(eggI).parent().addClass('fail');
                        $('#canvas-tool').show();

                    }

                    prizeGroup[eggI]['complete'] = true;
                    prizeObj = null;

                    // 请求发送
                    /*var url = "";
                    var data = {};
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: data,
                        success: function( data ) {

                        }
                    });*/
                }
            }
        }

        if (beat) {
            beat.draw();
            beat.update();

            if (beat['status'] == 1) {
                beat = null;
                egg['status'] = 1;
            }
        }

        // 烟花效果 Start
        var i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        for (var i = particles.length - 1; i >= 0; i--) {
            var particle = particles[i];
            particle.draw();
            particle.update(i);
        }
        // 烟花效果 End

        for (var i = prizes.length - 1; i >= 0; i--) {
            var prize = prizes[i];
            prize.draw();
            prize.update(i);
        }

        var i = bongs.length;
        while (i--) {
            bongs[i].draw();
            bongs[i].update(i);
        }

        for (var i = logos.length - 1; i >= 0; i--) {
            var particle = logos[i];
            particle.draw();
            particle.update(i);
        }

        if (loading) {
            loading.draw();
            loading.update();
        }

    };

    frameLoop.call(_this);

    // 创建粒子效果
    this.createParticles = function (x, y) {
    };

    // 创建Bong粒子效果
    this.createBongs = function () {
        var bongCount = random(20, 30);
        var x = (_this.stageW) / 2;
        var y = _this.stageH - 100;
        for (var i = 0; i < bongCount; i++) {
            bongs.push(new Bong(_this.ctx, x, y));
        }
    };

    // 创建单个Bong粒子效果
    this.createBong = function () {
        var x = (_this.stageW) / 2;
        var y = _this.stageH - 100;
        bongs.push(new Bong(_this.ctx, x, y));
    };

    // 创建烟火
    this.createFireworks = function (x, y) {
    };

    // 发射单个烟火
    this.fireworkLaunch = function () {
    };

    // 发射烟火组
    this.fireworksLaunch = function () {
    };
}


//function getImageData( colorParticles ) {
//    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//    for (var x = 0; x < imageData.width; x ++) {
//        for (var y = 0; y < imageData.height; y ++) {
//            var i = 4*(y * imageData.width + x);
//            if (imageData.data[i + 3] > 128) {
//                place ++;
//                (place % 1.0 == 0) && colorParticles.push(new ColorParticle(ctx, x, y, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]));
//            }
//        }
//    }
//}
