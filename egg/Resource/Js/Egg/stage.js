function Stage( ctx ) {
    var _this = this;
    var bgRes = getRes('stage_bg');
    var coinRes = getRes('coin');

    this.stageW = ctx.canvas.width;
    this.stageH = ctx.canvas.height;
    this.width = 250;
    this.height = 250;
    this.x = ( this.stageW - this.width ) / 2;
    this.y = ( this.stageH - this.height ) * 2 / 3;
    this.coinX = ( this.stageW - coinRes['width'] ) / 2;
    this.coinY = ( this.stageH - coinRes['height'] ) / 2 + 100;
    this.wSize = 10;
    this.hSize = 10;
    this.spacing = 5;
    this.rectWidth = ( this.width + this.spacing ) / this.wSize - this.spacing;
    this.rectHeight = ( this.height + this.spacing ) / this.hSize - this.spacing;

    this.radius = 20;
    this.rotationX = this.stageW / 2;
    this.rotationY = this.stageH * 2 / 3;
    this.rotationAngle = 0;
    this.egdeCount = 30;
    this.egdePerAngle = 360 / this.egdeCount;

    this.egde2count = 15;
    this.egde2length = this.stageW * 2 / 3;
    this.egde2width = 50;
    this.egde2PerAngle = 360 / this.egde2count;

    this.egde3width = 100;



    this.draw = function() {
        ctx.drawImage( bgRes['image'], 0, 0, this.stageW, this.stageH );

        ctx.save();
        // 旋转布条
        ctx.beginPath();
        ctx.fillStyle = 'rgba(251, 197, 77, 0.5)';
        var x0, y0;
        for ( var i = 0; i < this.egde2count; i++ ) {
            var hu = angle2Degree( i * this.egde2PerAngle + this.rotationAngle  );
            var x = this.rotationX + this.radius * Math.cos( hu );
            var y = this.rotationY + this.radius * Math.sin( hu );

            var r = this.egde2length;
            var hu1 = angle2Degree(( i + 0.5 ) * this.egde2PerAngle + this.rotationAngle );
            var xx = this.rotationX + r * Math.cos( hu1 );
            var yy = this.rotationY + r * Math.sin( hu1 );

            var xx1 = xx + ( this.egde3width / 2 ) * Math.sin( hu1 );
            var yy1 = yy - ( this.egde3width / 2 ) * Math.cos( hu1 );

            var xx2 = xx - ( this.egde3width / 2 ) * Math.sin( hu1 );
            var yy2 = yy + ( this.egde3width / 2 ) * Math.cos( hu1 );

            if ( i==0 ) {
                x0 = x; y0 = y;
                ctx.moveTo( x, y );
            } else {
                ctx.lineTo( x, y );
            }
            ctx.lineTo( xx1, yy1 );
            ctx.lineTo( xx2, yy2 );
        }
        ctx.lineTo( x0, y0 );
        ctx.closePath();
        ctx.fill();

        // 旋转布条
        ctx.beginPath();
        ctx.fillStyle = 'rgba( 229, 129, 45, 0.5 )';
        ctx.lineWidth = 0;
        var x0, y0;
        for ( var i = 0; i < this.egde2count; i++ ) {
            var hu = angle2Degree( i * this.egde2PerAngle + this.rotationAngle  );
            var x = this.rotationX + this.radius * Math.cos( hu );
            var y = this.rotationY + this.radius * Math.sin( hu );

            var r = this.egde2length;
            var hu1 = angle2Degree(( i + 0.5 ) * this.egde2PerAngle + this.rotationAngle );
            var xx = this.rotationX + r * Math.cos( hu1 );
            var yy = this.rotationY + r * Math.sin( hu1 );

            var xx1 = xx + ( this.egde2width / 2 ) * Math.sin( hu1 );
            var yy1 = yy - ( this.egde2width / 2 ) * Math.cos( hu1 );

            var xx2 = xx - ( this.egde2width / 2 ) * Math.sin( hu1 );
            var yy2 = yy + ( this.egde2width / 2 ) * Math.cos( hu1 );

            if ( i==0 ) {
                x0 = x; y0 = y;
                ctx.moveTo( x, y );
            } else {
                ctx.lineTo( x, y );
            }
            ctx.lineTo( xx1, yy1 );
            ctx.lineTo( xx2, yy2 );
        }
        ctx.lineTo( x0, y0 );
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 旋转线条
        ctx.drawImage( coinRes['image'], this.coinX, this.coinY, coinRes['width'], coinRes['height'] );

    };

    this.update = function() {
        this.rotationAngle += 0.5;
        this.rotationAngle = this.rotationAngle % 360;
    };
}