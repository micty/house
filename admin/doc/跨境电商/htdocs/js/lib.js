


var Lib = (function (MiniQuery, Lib) {

MiniQuery.use('$');

Lib.Pager = (function () {

    var sample = $.String.between(top.document.body.innerHTML, '<!--samples.pager', 'samples.pager-->');

    function Pager(config) {

        var id = config.id || 'divPager';

        var pageNo = config.pageNo || 1;
        var pageSize = config.pageSize;

        var totalCount = config.totalCount;
        var pageCount = Math.ceil(totalCount / pageSize);

        var beginIndex = (pageNo - 1) * pageSize;
        var endIndex = Math.min(beginIndex + pageSize, totalCount);

        

        this.config = {
            id: id,
            pageNo: totalCount == 0 ? 0: pageNo,
            pageSize: pageSize,
            totalCount: totalCount,
            pageCount: pageCount,
            beginIndex: beginIndex,
            endIndex: endIndex
        };


        var self = this;
        var pagechange = config.pagechange;

        MiniQuery.Event.bind(this, 'pagechange', function (pageNo) {

            var config = self.config;

            var pageSize = config.pageSize;
            var totalCount = config.totalCount;

            var beginIndex = (pageNo - 1) * pageSize;
            var endIndex = Math.min(beginIndex + pageSize, totalCount);

            $.Object.extend(config, {
                pageNo: pageNo,
                beginIndex: beginIndex,
                endIndex: endIndex
            });

            self.render();

            if (pagechange) {
                pagechange.call(self, pageNo);
            }
        });

        $('#' + id).delegate('a', 'click', function (event) {

            var a = event.currentTarget;
            var li = a.parentNode;
            if (li.className.indexOf('disabled') >= 0) {
                return;
            }

            var href = $(a).attr('href'); //javascript:void('final')
            var actionName = $.String.between(href, "void('", "')");
            self[actionName]();

        });


    }



    Pager.prototype = {
        constructor: Pager,

        render: function () {

            var config = this.config;

            var pageNo = config.pageNo;
            var pageCount = config.pageCount;

            var isFirstPage = pageNo == 1;
            var isFinalPage = pageNo == pageCount;

            var div = document.getElementById(config.id);
            $(div).addClass('pagination');

            div.innerHTML = $.String.format(sample, {
                pageNo: pageNo,
                pageCount: pageCount,
                beginIndex: config.beginIndex + 1,
                endIndex: config.endIndex,
                totalCount: config.totalCount,
                firstPageClass: isFirstPage ? 'disabled' : '',
                previousPageClass: isFirstPage ? 'disabled' : '',
                nextPageClass: isFinalPage ? 'disabled' : '',
                finalPageClass: isFinalPage ? 'disabled' : ''
            });


            var self = this;
            $(div).find('input').keydown(function (event) {
                if (event.keyCode == 13) {
                    var pageNo = Number($(this).val());
                    self.to(pageNo);
                }
            });

            var fn = config.pagechange;
            fn && fn(pageNo);

            



        },

        to: function (pageNo) {

            if (typeof pageNo != 'number' || pageNo < 1 || pageNo > this.config.pageCount) {
                alert('输入的页码有误');
                return;
            }

            MiniQuery.Event.trigger(this, 'pagechange', [pageNo]);
        },

        previous: function () {
            this.to(this.config.pageNo - 1);
        },

        next: function () {
            this.to(this.config.pageNo + 1);
        },

        first: function () {
            this.to(1);
        },

        final: function () {
            this.to(this.config.pageCount);
        },

        refresh: function () {
            this.to(this.config.pageNo);
        }
    };


    return {
        create: function (config) {
            return new Pager(config);
        }
    };


})();


Lib.API = (function () {


    var baseUrl = 'http://1.huarencang.sinaapp.com/1/huarencang/server/';


    function parseJSON(data) {
        
        try {
            data = data.replace(/^(\r\n)+/g, '');
            return (new Function('return ' + data))();
        }
        catch (ex){
            return null;
        }
        
    }

   

    function ajax(config) {

        var url = baseUrl + config.name + '.jsp';

        var method = (config.method || 'GET').toUpperCase();

        var data = config.data || null;
        if (data) {
            data = $.Object.toQueryString(data);

            if (method == 'GET') {
                url += '?' + data;
                data = null; //要发送的数据已附加到 url 参数上
            }
        }

        var fnSuccess = config.success;
        var fnFail = config.fail;
        var fnError = config.error;

        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);


        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4) {
                if (xhr.status == 200) {

                    var json = parseJSON(xhr.responseText);
                    if (!json) {
                        fnError && fnError();
                        return;
                    }

                    var code = json.code;
                    if (code == 0) {
                        fnSuccess && fnSuccess(json.data || {}, json);
                    }
                    else {
                        fnFail && fnFail(code, json);
                    }
                }
                else {
                    fnError && fnError();
                }
            }
        };

        if (method == 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(data);
    }


    function get(name, data, fnSuccess, fnFail, fnError) {

        if (typeof data == 'function') { //此时为 get(name, fnSuccess, fnFail, fnError)
            fnError = fnFail;
            fnFail = fnSuccess;
            fnSuccess = data;
        }


        ajax({
            method: 'GET',
            name: name,
            data: data,
            success: fnSuccess,
            fail: fnFail,
            error: fnError
        });


    }


    function post(name, data, fnSuccess, fnFail, fnError) {

        if (typeof data == 'function') { //此时为 post(name, fnSuccess, fnFail, fnError)
            fnError = fnFail;
            fnFail = fnSuccess;
            fnSuccess = data;
        }

        ajax({
            method: 'POST',
            name: name,
            data: data,
            success: fnSuccess,
            fail: fnFail,
            error: fnError
        });



    }


   

    return {
        get: get,
        post: post
    };

    
})();

Lib.LoadingTip = (function () {


    var div = top.document.getElementById('divLoadingTip');
    var classes = [
        'loading-info',
        'loading-warning',
        'loading-danger',
        'loading-success'
    ];

    var cls = classes.join(' ');
    var timeoutId;

    function show(index, msg, timeout) {

        $(div).removeClass(cls)
            .addClass(classes[index])
            .html(msg)
            .fadeIn('fast');

        if (timeout) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                hide();
            }, timeout);
        }
    }

    function info(msg, timeout) {
        show(0, msg, timeout);
    }

    function warn(msg, timeout) {
        show(1, msg, timeout);
    }

    function error(msg, timeout) {
        show(2, msg, timeout);
    }

    function success(msg, timeout) {
        show(3, msg, timeout);
    }

    function hide() {

        $(div).fadeOut(1500);
    }


    return {
        info: info,
        warn: warn,
        error: error,
        success: success,
        hide: hide
    };
})();



return Lib;


})(MiniQuery, {} );