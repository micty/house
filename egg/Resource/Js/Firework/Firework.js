function Firework ( ctx, sx, sy, tx, ty ) {
    this.x = sx;
    this.y = sy;

    this.sx = sx;
    this.sy = sy;

    this.tx = tx;
    this.ty = ty;

    this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
    this.distanceTraveled = 0;

    this.coordinates = [];
    this.coordinateCount = 3;
    for ( var i = 0; i < this.coordinateCount; i++ ) {
        this.coordinates.push( [ this.x, this.y ] );
    }

    this.angle = Math.atan2( ty - sy, tx - sx );
    this.speed = 10;
    this.acceleration = 1.05;
    this.brightness = random( 50, 70 );
    this.targetRadius = 1;

    this.update = function( index ) {
        this.coordinates.pop();
        this.coordinates.unshift( [ this.x, this.y ] );

        this.speed *= this.acceleration;

        var vx = Math.cos( this.angle ) * this.speed;
        var vy = Math.sin( this.angle ) * this.speed;
        this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );

        if( this.distanceTraveled >= this.distanceToTarget ) {

            hue += random(10, 100);
            game.fireworkLaunch();
            game.createParticles( this.tx, this.ty );
            fireworks.splice( index, 1 );
        } else {
            this.x += vx;
            this.y += vy;
        }
    };

    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
        ctx.lineTo( this.x, this.y );
        ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
        ctx.stroke();
    }
}