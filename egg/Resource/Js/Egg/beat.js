

function Beat(ctx) {
    var _this = this, res;
    res = getRes('beat');

    this.stageW = ctx.canvas.width;
    this.stageH = ctx.canvas.height;
    this.x = ( this.stageW - res['width'] ) / 2 + res['width'] * 1;
    this.y = ( this.stageH - res['height'] ) / 2 - res['height'] * 0.8;
    this.count = 2;
    this.maxCount = 3;
    this.angle = -10;
    this.minAngle = -10;
    this.limitMinAngle = -30;
    this.maxAngle = 10;
    this.vAngle = 1.0;
    this.status = 0;
    this.scale = 1;
    this.vScale = 0.05;
    this.maxScale = 1.5;

    this.textX = this.stageW / 2;
    this.textY = this.stageH * 3 / 4 - 100;

    this.draw = function() {
        ctx.save();
        ctx.translate( ( this.x + res['width']  ) , ( this.y + res['height']  ) );
        ctx.scale( this.scale, this.scale );
        ctx.rotate( angle2Degree( this.angle ) );
        ctx.translate( -( this.x + res['width'] ), -( this.y + res['height'] ) );
        ctx.drawImage( res['image'], this.x, this.y, res['width'], res['height'] );
        ctx.translate( ( this.x + res['width'] ), ( this.y + res['height'] ) );
        ctx.rotate( angle2Degree( -this.angle ) );
        ctx.translate( -( this.x + res['width'] ), -( this.y + res['height'] ) );
        ctx.restore();
    };

    this.update = function() {
        if ( this.status ) return;
        this.angle = this.angle + this.vAngle;
        if ( this.vAngle >=0 ) {
            if ( this.angle > this.maxAngle ) {
                this.angle = this.maxAngle;
                this.vAngle = - this.vAngle;
                this.count++;
            }
        } else {
            if ( this.count >= this.maxCount && this.status==0 ) {
                this.vAngle *= 1.1;
                if ( this.scale < this.maxScale ) {
                    this.scale += this.vScale;
                } else {
                    this.scale = this.maxScale;
                }

                if ( this.angle < this.limitMinAngle ) {
                    this.angle = this.limitMinAngle;
                    this.vAngle = - this.vAngle;
                    this.status = 1;
                    this.scale = 1;
                }
            } else {
                if ( this.angle < this.minAngle ) {
                    this.angle = this.minAngle;
                    this.vAngle = - this.vAngle;
                }
            }
        }
    }
}