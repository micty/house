window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
        };
})();

function random( min, max ) {
    return Math.random() * ( max - min ) + min;
}

function calculateDistance( p1x, p1y, p2x, p2y ) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// 数组删除执行值
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var num = 0, index;
    for ( var i = 0; i< this.length; i++ ) {
        if ( this[i] == val ) num++;
    }

    for ( var i = 0; i< num; i++ ) {
        index = this.indexOf(val);
        if ( index > -1 ) {
            this.splice(index, 1);
        }
    }
};
Array.prototype.foreach = function(callback){
    for(var i=0;i< this.length;i++){
        callback.apply(this[i] , [i])
    }
};

var console = (function(){
    return window.console
        || {
        log : new Function(),
        debug : new Function(),
        warn : new Function(),
        error : new Function(),
        clear : new Function()
    };
})();

/**
 * -> 将三维投射到二维（三维直角坐标系转平面直角坐标系） <-
 * 三维空间下的坐标系不止直角坐标一种，还有 圆柱坐标系，球坐标系等等。
 * 下面我们将iso方法转换一下，是输入使用球坐标系值（θ,Φ,r）——转角，仰角，球半径。
 * 首先我们先要知道，三维直角坐标系于球坐标系的换算式：
 * x=rsinθcosφ 　
 * y=rsinθsinφ 　　
 * z=rcosθ
 * */
function iso(a,b,r){
    var theta = 4.2; //转角
    var eleva = 0.6; //仰角
    var x, y, z;
    x = r * Math.cos( a + theta ) * Math.sin( b );
    y = r * Math.sin( a + theta ) * Math.sin( b );
    z = r * Math.cos( b );
    var fact = ( y * Math.cos( eleva ) + z * Math.sin( eleva ) + 8 ) / 8;
    y = y * Math.sin( eleva ) + z * Math.cos( eleva );
    x *= fact;
    y *= fact;
    return {
        x: x,
        y: y
    };
}

/**
 * 3D坐标旋转
 * */
function rotateX(vectors , angleX){
    var cos = Math.cos(angleX);
    var sin = Math.sin(angleX);
    vectors.foreach(function(){
        var y1 = this.y * cos - this.z * sin;
        var z1 = this.z * cos + this.y * sin;
        this.y = y1;
        this.z = z1;
    });
};

function rotateY(vectors , angleY){
    var cos = Math.cos(angleY);
    var sin = Math.sin(angleY);
    vectors.foreach(function(){
        var x1 = this.x * cos - this.z * sin;
        var z1 = this.z * cos + this.x * sin;
        this.x = x1;
        this.z = z1;
    });
};

function rotateP(vectors , angle ,  p){
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    vectors.foreach(function(){
        var u = p.x;
        var v = p.y;
        var w = p.z;

        var uu = u * u;
        var uv = u * v;
        var uw = u * w;
        var vv = v * v;
        var vw = v * w;
        var ww = w * w;
        var cosd = 1-cos;

        var p00 = cos + uu * cosd;
        var p01 = uv * cosd + w * sin;
        var p02 = uw * cosd - v * sin;

        var p10 = uv * cosd - w * sin;
        var p11 = cos + vv * cosd;
        var p12 = vw * cosd + u * sin;

        var p20 = uw * cosd + v * sin;
        var p21 = vw * cosd - u * sin;
        var p22 = cos + ww * cosd;

        var x = this.x;
        var y = this.y;
        var z = this.z;

        this.x = this.x * p00 + this.y * p10 + this.z * p20;
        this.z = this.x * p02 + this.y * p12 + this.z * p22;
        this.y = this.x * p01 + this.y * p11 + this.z * p21;
    });
};

function angle2Degree( angle ) {
    return Math.PI / 180 * angle;
}

function randomRgb() {
    return 'rgb('+ parseInt(random(0, 255)) +','+ parseInt(random(0, 255))+', '+ parseInt(random(0, 255)) +')';
}

function randomRgba( alpha ) {
    if ( !alpha ) alpha = 0.75;
    return 'rgba('+ parseInt( random(0, 255) ) +','+ parseInt( random(0, 255) )+', '+ parseInt( random(0, 255)) +', '+ alpha +')';
}


function getUrlParam ( name ) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

