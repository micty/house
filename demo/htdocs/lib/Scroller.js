
define('Scroller', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    
    var Scroller = KISP.require('Scroller');


    var prototype = Scroller.prototype;
    var pulldown = prototype.pulldown;
    var pullup = prototype.pullup;


    var loading = KISP.create('Loading', {
        top: 47,
        presetting: 'scroller.pulldown',
        'z-index': 9999, //避免给 NoData 覆盖
    });


    var loading2 = KISP.create('Loading', {
        bottom: 55,
        presetting: 'scroller.pullup',
    });


    //重写
    $.Object.extend(prototype, {

        setLastPage:function (isLastPage){
            this.isLastPage = isLastPage;
        },

        pulldown: function (config) {
            var tip = $(config.tip || '#div-pulldown');
            var min = config.min || 20;
            var max = config.max || 65;
            var load = config.load || function () { };
            var top = config.top || 46;
            var release = config.release || 32;

            pulldown.call(this, min, max); //调用原来的

           

            //上拉时，把下拉的提示隐藏
            this.on('pullup', {
                start: function () {
                    this.isReloading = false;
                    tip.hide();
                },
            });

            this.on('pulldown', {
                start: function () {
                    
                    tip.hide();
                },

                enter: function () {
                    loading.hide();
                    tip.html('下拉刷新').show().css({
                        top: top + 'px'
                    });
                },

                reach: function () {
                    loading.hide();
                    tip.html('释放立即刷新');
                },

                release: function () {
                    this.to(release);

                    tip.hide();

                    loading.show({
                        top: top,
                    });

                   
                    if (this.isReloading) {
                        //console.log('isReloading, return!');
                        return;
                    }


                    this.isReloading = true;
                    var self = this;

                    load(function (fn) {
                        loading.hide();

                        tip.show().html('刷新成功');

                        setTimeout(function () { //reset
                            tip.hide();
                            self.isReloading = false;
                            self.reset();

                        }, 500);

                    });

                },
            });

        },

        pullup: function (config) {

            var tip = $('#div-pullup');
            var min = config.min || 35;
            var max = config.max || 65;
            var load = config.load || function () { };
            var bottom = config.bottom || 0;
            var loadingBottom = config.loadingBottom;

            pullup.call(this, min, max);


            //下拉时，把上拉的提示隐藏
            this.on('pulldown', {
                start: function () {
                    this.isLoadingMore = false;
                    tip.hide();

                },
            });


            this.on('pullup', {
                start: function () {
                    tip.hide();
                    loading2.hide();
                },

                enter: function () {
                    if (this.isLastPage) {
                        return;
                    }

                    tip.html('上拉加载更多').show().css({
                        bottom: bottom + 'px'
                    });
                    loading2.hide();

                },

                reach: function () {

                    if (this.isLastPage) {
                        return;
                    }
                   
                    tip.html('释放立即加载');
                    loading2.hide();

                },

                release: function () {

                    if (this.isLastPage) { //最后一页
                        tip.hide();
                        loading2.hide();

                        this.toBottom(10);
                        this.refresh();
                        return;
                    }
                    
                    this.toBottom(50);
                    

                    if (loadingBottom) {
                        loading2.show({
                            'bottom': loadingBottom,
                        });
                    }
                    else {
                        loading2.show();
                    }


                    tip.hide();

                    if (this.isLoadingMore) {
                        console.log('isLoadingMore, return!');
                        return;
                    }

                    this.isLoadingMore = true;
                    var self = this;

                    load(function () {
                        //tip.hide();
                        loading2.hide();

                        self.isLoadingMore = false;
                    });



                   
                },
            });

        },

    });


    return Scroller;

});

