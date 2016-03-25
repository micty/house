

function Egg(ctx, x, y) {
    var _this = this;
    var eggRes, egg2_2Res, gashRes, giftRes;
    eggRes = getRes( 'egg' );
    egg2_2Res = getRes( 'egg2_2' );
    gashRes = getRes('gash');  // width: 216, height: 190;  point: 130, 77
    // xPer = 130 / 216;
    // yPer = 77 / 190
    giftRes = getRes('gift');


    this.ctx = ctx;
    this.stageW = ctx.canvas.width;
    this.stageH = ctx.canvas.height;
    this.x = x;
    this.y = y;
    this.sx = x;
    this.sy = y;
    this.vx = 0;
    this.vy = 0;
    this.status = 0;
    this.bong = 0;
    this.gashX = x + 80;
    this.gashY = y + 50;
    this.gashSX = this.gashX;
    this.gashSY = this.gashY;
    this.ticketCount = 50;
    this.ticketCur = 0;
    this.ticketLoop = 1;
    this.gashScale = (( this.ticketLoop - 1 )  * 0.2 + 1) * 0.5;
    this.xPer = 130.5 / 216;
    this.yPer = 78 / 190;

    this.giftX = x + 150;
    this.giftY = y + 250;


    // 创建场景
    function createScene( ) {
    }createScene();


    this.draw = function() {
        switch ( this.status ) {
            case 0:
                ctx.drawImage( eggRes['image'], this.x, this.y, eggRes['width'], eggRes['height'] );
                ctx.drawImage( giftRes['image'], this.giftX, this.giftY, giftRes['width'], giftRes['height'] );
                break;
            case 1:
                // 砸开效果阶段
                //this.status = 1;
                ctx.drawImage( eggRes['image'], this.x, this.y, eggRes['width'], eggRes['height'] );
                ctx.save();

                ctx.translate(this.gashX + gashRes['width'] * this.xPer,
                    this.gashY + gashRes['height'] * this.yPer);

                ctx.scale( this.gashScale, this.gashScale );

                ctx.drawImage(gashRes['image'],
                    -gashRes['width'] * this.xPer,
                    -gashRes['height'] * this.yPer,
                    gashRes['width'], gashRes['height']);

                ctx.translate(-(this.gashX + gashRes['width'] * this.xPer),
                    -(this.gashY + gashRes['height'] * this.yPer));

                ctx.restore();
                ctx.drawImage( giftRes['image'], this.giftX, this.giftY, giftRes['width'], giftRes['height'] );
                break;

            case 2:
                // 砸蛋结束 （背景图片）
                ctx.drawImage( egg2_2Res['image'], this.x, this.y, egg2_2Res['width'], egg2_2Res['height'] );
                break;
        }


    };

    this.update = function() {
        switch ( this.status ) {
            case 0:
                break;
            case 1:
                if ( this.ticketLoop >3 ) {
                    this.status = 2;
                } else {
                    this.ticketCur++;
                    if ( this.ticketCur >= this.ticketCount ) {
                        this.ticketLoop++;
                        this.ticketCur = 0;
                    }

                    if ( this.ticketCur < this.ticketCount / 10 ) {
                        this.vx = random( -3.0, 3.0 );
                    } else {
                        this.vx = 0;
                    }
                }

                this.gashScale = (( this.ticketLoop )  * 0.5 + 0.35 ) * 0.5;
                this.x = this.sx + this.vx;
                this.y = this.sy + this.vy;
                this.gashX = this.gashSX + this.vx;
                this.gashY = this.gashSY + this.vy;
                break;
            case 2:
                break;
        }
    };


}