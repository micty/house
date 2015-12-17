function Prize( ctx, x, y ) {
    var _this = this, prizeRes, egg2_1Res, measure, x1, y1, x2, y2, fontSize = 100, giftRes, gs2Res;
    prizeRes = getRes('prize'+ eggI);
    egg2_1Res = getRes('egg2_1');
    giftRes = getRes('gift');
    gs2Res = getRes('gs2');

    this.x = x;
    this.y = y;
    this.sx = x;
    this.sy = y;
    this.vx = 0.1;
    this.vy = 0.1;
    this.dx = 20;
    this.dy = 5;
    this.minX = this.x - this.dx;
    this.maxX = this.x + this.dx;
    this.minY = this.y - this.dy;
    this.maxY = this.y + this.dy;
    this.speed = 2;

    this.stageW = ctx.canvas.width;
    this.stageH = ctx.canvas.height;
    this.status = 0;

    this.textX = this.stageW / 2;
    this.textY = this.stageH / 6;

    this.eggX = ( this.stageW - egg2_1Res['width'] ) / 2;
    this.eggY = this.stageH - egg2_1Res['height'] - 10;

    var eggRes = getRes('egg');
    var _x = ( _this.stageW - eggRes['width'] ) / 2;
    var _y = _this.stageH - eggRes['height'] - 10 ;

    this.giftX = _x + 150;
    this.giftY = _y + 250;

    this.gs2X = ( this.stageW - gs2Res['width'] ) / 2 - 10;
    this.gs2Y = ( this.stageH - gs2Res['height'] ) - 100;


    this.draw = function() {
        if ( prizeRes['success'] ) {
            success.call( this );
        } else {
            fail.call( this );
        }
    };

    this.update = function() {

        this.x = this.x + this.vx;
        if ( this.vx >=0 ) {
            if ( this.x > this.maxX ) {
                this.x = this.maxX;
                this.vx = - this.vx;
            }
        } else {
            if ( this.x < this.minX ) {
                this.x = this.minX;
                this.vx = - this.vx;
            }
        }

        this.y = this.y + this.vy;
        if ( this.vy >=0 ) {
            if ( this.y > this.maxY ) {
                this.y = this.maxY;
                this.vy = - this.vy;
            }
        } else {
            if ( this.y < this.minY ) {
                this.y = this.minY;
                this.vy = - this.vy;
            }
        }
    };

    // 中奖
    function success() {
        //console.log( 'success' );
        if ( _this.status==0 ) {
            _this.status = 1;
            game.fireworksLaunch();
        };

        // 奖品文字描述
        ctx.scale(1, 1);
        ctx.save();
        ctx.font = fontSize+"px Microsoft YaHei";
        measure = ctx.measureText( prizeRes['name'] );
        x1 = ( _this.stageW - measure['width'] ) / 2;
        y1 = this.textY;
        x2 = x1 + measure['width'];
        y2 = y1 + fontSize * 2 / 3;


        var gradient= ctx.createLinearGradient( x1, y1, x1, y2 );
        gradient.addColorStop( 0, '#F9EDCD' );
        gradient.addColorStop( 0.25, '#E08045' )
        gradient.addColorStop( 0.5, '#E08045' );
        gradient.addColorStop( 1.0, '#E08045' );
        // 用渐变填色
        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba( 0, 0, 0, 0.75)';
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 10;
        ctx.fillText( prizeRes['name'], this.textX, this.textY );
        ctx.restore();


        // 奖品光束
        ctx.drawImage( gs2Res['image'], this.gs2X, this.gs2Y, gs2Res['width'], gs2Res['height'] );

        // 奖品图像
        ctx.drawImage( prizeRes['image'], this.x, this.y, prizeRes['width'], prizeRes['height'] );

        this.drawPrizeEgg();
    }
    // 未中奖
    function fail() {
        //console.log('fail');
        // 奖品文字描述
        ctx.fillStyle = 'red';
        ctx.font = "50px Microsoft YaHei";
        ctx.fillText( '空蛋一个~~', this.textX, this.textY );
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.drawImage( prizeRes['image'], this.x, this.y, prizeRes['width'], prizeRes['height'] );
        this.drawPrizeEgg();
    }


    this.drawPrizeEgg = function() {
        ctx.drawImage( egg2_1Res['image'], _this.eggX, _this.eggY, egg2_1Res['width'], egg2_1Res['height']);
        ctx.drawImage( giftRes['image'], this.giftX, this.giftY, giftRes['width'], giftRes['height'] );
    };







}