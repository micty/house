//function Particle( ctx, x, y ) {
//    var colorRes = getRes('color');
    
//    this.x = x;
//    this.y = y;
//    this.coordinateCount = 50;
//    this.coordinates = [];
//    this.type = Math.floor( random(0.5, 1.5) );

//    while ( this.coordinateCount-- ) {
//        this.coordinates.push( [this.x, this.y ] );
//    }

//    this.angle = angle2Degree( random( -135, -45 )  );
//    this.speed = random( 1, 8 ) * 2.5;
//    this.friction = 0.95;
//    this.gravity = 1.5;
//    this.hue = random( hue - 20, hue + 20 );
//    this.brightness = random( 50, 80 );
//    this.alpha = 1;
//    this.decay = random( 0.015, 0.03 );
//    this.radius = random( 1, 3.0 ) ;
//    this.scale = random( 0.05, 0.25 );

//    this.update = function( index ) {
//        this.coordinates.pop();
//        this.coordinates.unshift( [this.x, this.y ] );
//        this.speed *= this.friction;

//        this.x += Math.cos( this.angle ) * this.speed;
//        this.y += Math.sin( this.angle ) * this.speed + this.gravity;

//        this.alpha -= this.decay * random(1, 1.5);

//        if ( this.alpha <= this.decay ) {
//            particles.splice( index, 1 );
//        }
//    };

//    this.draw = function() {
//        ctx.save();
//        ctx.translate( ( this.x  ) , ( this.y ) );
//        ctx.scale( this.scale, this.scale );
//        ctx.rotate( this.angle );
//        ctx.translate( -( this.x ), -( this.y ) );
//        ctx.drawImage( colorRes['image'], this.x - colorRes['width'] / 2, this.y - colorRes['height'] / 2, colorRes['width'], colorRes['height'] );
//        ctx.restore();
//    }
//}