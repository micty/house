

// 游戏主体部分

define('Game', function (require, module) {

    var $ = require('$');
    var Resource = require('Resource');

    // 烟火效果
    var fireworks = [],
        particles = [],
        bongs = [],
        hue = random(0, 255);


    function Game(canvas, phone) {

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
                var tar = e.target,
                    cTar = e.currentTarget;

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
            }
            else {
                var box = boxs.eq(eggI);
                if (box.hasClass('doing')) return;
                if (prize['success']) {
                    success();
                }
                else {
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
            var Egg = require('Egg');
            var eggRes = Resource.get('egg');
            var x = (_this.stageW - eggRes['width']) / 2;
            var y = _this.stageH - eggRes['height'] - 10;
            egg = new Egg(_this.ctx, x, y);
        }

        function beatEgg() {
            var Beat = require('Beat');
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

                        var prizeRes = Resource.get('prize' + eggI);
                        var x = (_this.stageW - prizeRes['width']) / 2;
                        var y = (_this.stageH - prizeRes['height']) * 3 / 7 + 50;

                        var Prize = require('Prize');

                        prizes.push(new Prize(_this.ctx, x, y));

                        // 礼品出现后，打开“关闭”按钮，并显示出页面上金蛋对应的礼品
                        $('#close-btn').removeClass('hidden');
                        var prizeObj = Resource.get('prize' + eggI);
                        boxs.eq(eggI).parent().addClass('complete').end().removeClass('doing').css('opacity', 1).find('img').attr('src', prizeObj['url']);

                        $('#canvas-tool').hide();
                        if (!prizeRes['success']) {
                            boxs.eq(eggI).parent().addClass('fail');
                            $('#canvas-tool').show();
                        }

                        prizeGroup[eggI]['complete'] = true;
                        prizeObj = null;

                        debugger;

                        if (prizeRes.success) {

                            var API = KISP.require('API');
                            var api = new API('ActivityPrize.add');

                            api.on({
                                'fail': function (msg, data, json) {
                                    KISP.alert(msg);
                                },
                                'error': function () {
                                    KISP.alert('提交到服务器错误，请稍候再试!');
                                },
                                'success': function () {
                                    debugger;
                                },
                            });

                            api.post({
                                'phone': phone,
                                'prize': prizeRes.name,
                            });
                        }


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


        frameLoop.call(_this);


    }


    return Game;


});

