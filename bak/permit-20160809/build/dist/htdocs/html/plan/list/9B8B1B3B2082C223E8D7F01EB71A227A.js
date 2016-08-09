!function(e,t,n,r,i,o,a,u,c,s,f,d,l,g,v,m,p,h,y,b,S,x,w,k){l("API",function(e,t,n){function r(t,n){var r=e("User"),o=r.get("token"),a=i.create("API",t,n),c=a.get.bind(a),s=a.post.bind(a);return a.get=function(e){return e=e||{},e.token=o,c(e)},a.post=function(e,n){return n=n||{},n.token=o,u.log(t,e),s({data:e},n)},a}var i=(e("$"),e("KISP"));return r}),l("Array",function(e,t,n){function r(e,t,n){return n===k&&(n=1),o.Array.keep(e,function(e,r){var i=e.value+t[r].value*n;return o.Object.extend({},e,{value:i})})}function i(e,t){return r(e,t,-1)}var o=e("$");e("MiniQuery"),e("NumberField");return{substract:i}}),l("Bridge",function(t,r){if(n!==e){var i=e.require(r.id);return{on:function(e,t){var r=[].slice.call(arguments,0);i.bind(n,r)},open:function(e,t,n){i.open(e,t,n)},close:function(){i.close(n)},refresh:function(e){i.refresh(e)},data:function(e,t){var n=[].slice.call(arguments,0);return i.data.apply(null,n)}}}var o=t("$"),a=t("MiniQuery"),u=a.require("Emitter"),c=a.require("Mapper"),s=new c,f=new u,d={};return{bind:function(e,t){var n=s.get(e);n||(n=new u,s.set(e,n)),n.on.apply(n,t)},fire:function(e,t,n){var r="object"==typeof t?t.id:t,i=o("iframe").toArray(),a=o.Array.findItem(i,function(e,t){var n=e.getAttribute("data-sn");return n==r});if(a){var u=a.contentWindow,c=s.get(u);if(c){n=n||[];var f=c.fire(e,n),d=f.length;return d>0?f[d-1]:void 0}}},open:function(e,t,n){f.fire("open",[e,t,n])},refresh:function(e){f.fire("refresh",[e])},close:function(e){var t=o("iframe").toArray(),n=o.Array.findItem(t,function(t,n){return t.contentWindow===e});if(n){var r=n.getAttribute("data-sn");f.fire("close",[r])}},data:function(e,t){return 1==arguments.length?(t=d[e],t=JSON.parse(t)):null===t?void delete d[e]:(t=JSON.stringify(t),d[e]=t,t)},on:f.on.bind(f)}}),l("Cell",function(e,t,n){function r(e,t){"object"==typeof e&&(t=e,e="");var n=0;return s.forEach(function(r){r=e+r;var i=t[r]||0;i=b(i)||0,n+=i}),n}function i(e,t){var n=r(e,t);return n=c.text(n)}function o(e,t){var n=e[t]||0;return c.text(n)}function a(e,t){return"object"==typeof e&&(t=e,e=""),u.Array.each(s,function(n){n=e+n,t[n]=o(t,n)}),t}var u=e("$"),c=(e("MiniQuery"),e("NumberField")),s=["residenceCell","commerceCell","officeCell","otherCell"];return{total:r,totalText:i,format:a,text:o}}),l("Chart",function(e,t,r){var i=(e("$"),e("MiniQuery"),n.Chart);return i}),l("DateTimePicker",function(e,t,n){function r(e,t,n){var r=c.get(e),i=r.$this,o=[].slice.call(n,0);return o=[t].concat(o),i.datetimepicker.apply(i,o)}function i(e,t){o.Object.isPlain(e)&&(t=e,e=t.selector,delete t.selector),t=o.Object.extend({},s,t);var n=o(e).datetimepicker(t),r={$this:n};c.set(this,r)}var o=e("$"),a=e("MiniQuery"),u=a.require("Mapper"),c=new u,s={format:"yyyy-mm-dd",autoclose:!0,minView:"month",todayBtn:!0,todayHighlight:!0,pickerPosition:"top-right"};return i.prototype={constructor:i,on:function(e,t){var n=c.get(this),r=n.$this;r.on(e,t)},remove:function(){r(this,"remove",arguments)},show:function(){r(this,"show",arguments)},hide:function(){r(this,"hide",arguments)},update:function(){r(this,"update",arguments)},setStartDate:function(){r(this,"setStartDate",arguments)},setEndDate:function(){r(this,"setEndDate",arguments)},setDaysOfWeekDisabled:function(){r(this,"setDaysOfWeekDisabled",arguments)}},o.Object.extend(i,{config:function(e){return 0==arguments.length?s:void o.Object.extend(s,e)},create:function(e,t){return new i(e,t)}})}),l("LocalStorage",function(e,t,n){function r(e,t){s[e]=t,u.set(c,s)}function i(e){return s[e]}function o(e){delete s[e],u.set(c,s)}var a=(e("$"),e("MiniQuery")),u=a.require("LocalStorage"),c="permit-5ED1A2BC804DC930",s=u.get(c)||{};return{set:r,get:i,remove:o}}),l("Logs",function(t,n,r){var i=(t("$"),t("MiniQuery"),t("KISP")),o=i.create("Panel"),a=null;return o.on("init",function(){a=i.create("Dialog",{title:"处理结果",text:"<textarea readonly></textarea>",buttons:[{text:"确定",name:"ok"}],cssClass:"dialog-Logs",height:500,width:800,autoClosed:!0,"z-index":9999}),a.on("show",function(){var t=e.document.body.scrollTop+20;a.$.css("top",t)}),a.on("button","ok",function(){var e=a.data("ok");e&&e()})}),o.on("render",function(e,t){g.isArray(e)&&(e=e.join("\n")),a.data("ok",t),a.show(),a.$.find("textarea").val(e)}),o.wrap()}),l("Multitask",function(e,t,n){function r(e){return u.Array.keep(e,function(e,t){return!1})}function i(e,t){var n=e&&e.length>0;n&&(u.Array.each(e,function(e,t){if(!e)return n=!1,!1}),n&&t&&t(e))}function o(e,t){var n=r(e);u.Array.each(e,function(e,r){if("function"==typeof e)e(function(e,o){n[r]=e,i(n,t)});else{var o=e.fn,a=e.args||[],u=e.context||null;a.push(function(e,o){n[r]=e,i(n,t)}),o.apply(u,a)}})}function a(e,t){var n=r(e),i=0,o=e.length;!function(){var r=arguments.callee,a=e[i];a(function(e){n[i]=e,i++,i<o?r():t&&t(n)})}()}var u=e("$");return{concurrency:o,serial:a}}),l("NumberField",function(e,t,n){function i(e){var t={};return u.Object.each(e,function(e,n){var r=d[e];if(r){var i=l[e];i&&(n=i[n]),t[r]=n}else t[e]=n}),t}function o(e,t,n){var r=f.get(e),i=r.$this,o=[].slice.call(n,0);return o=[t].concat(o),i.autoNumeric.apply(i,o)}function a(e,t){u.Object.isPlain(e)&&(t=e,e=t.selector,delete t.selector),t=u.Object.extend({},g,t),t=i(t);var n=u(e).autoNumeric(t),r={$this:n};f.set(this,r)}var u=e("$"),c=e("MiniQuery"),s=c.require("Mapper"),f=new s,d={groupSign:"aSep",groupCount:"dGroup",decimalSign:"aDec",decimalKey:"altDec",currencySign:"aSign",currencyPlace:"pSign",min:"vMin",max:"vMax",decimalCount:"mDec",round:"mRound",padded:"aPad",bracket:"nBracket",empty:"wEmpty",leadingZero:"lZero",formatted:"aForm"},l={currencyPlace:{left:"p",right:"s"}},g={groupSign:",",groupCount:3,decimalSign:".",decimalKey:null,currencySign:"",currencyPlace:"left",min:"0.00",max:"9999999999999.99",decimalCount:2,round:"S",padded:!1,bracket:null,empty:"empty",leadingZero:"allow",formatted:!0};a.prototype={constructor:a,init:function(){o(this,"init",arguments)},destroy:function(){o(this,"destroy",arguments)},update:function(e){e&&(arguments[0]=i(e)),o(this,"update",arguments)},set:function(){o(this,"set",arguments)},get:function(){return o(this,"get",arguments)},getString:function(){return o(this,"getString",arguments)},getArray:function(){return o(this,"getArray",arguments)},getSettings:function(){return o(this,"getSettings",arguments)}};var v=null,m=null;return u.Object.extend(a,{config:function(e){return 0==arguments.length?g:void u.Object.extend(g,e)},create:function(e,t){return new a(e,t)},update:function(e,t){new a(e).update(t)},value:function(e){var t=new a(e),n=t.get();return n=b(n)},text:function(e,t){return t=u.Object.extend(g,{min:"-9999999999999.99",currencySign:""},t),v||(v=r.createElement("input"),v.type="text",m=new a(v,t)),v.value=e,m.update(t),v.value},money:function(e,t){return t=u.Object.extend({},t,{currencySign:"¥"}),a.text(e,t)}})}),l("$Object",function(e,t){function n(e,t){t=t||".";var i={};return S.keys(e).forEach(function(o){var a=e[o];return r.Object.isPlain(a)?void S.keys(a).forEach(function(e){var r=a[e];if(r&&"object"==typeof r){var u=n(a,t);S.keys(u).forEach(function(e){i[o+t+e]=u[e]})}else i[o+t+e]=r}):void(i[o]=a)}),i}var r=e("$");return{linear:n}}),l("Pager/Helper",function(e,t){function n(e,t){return e<=10?[{from:1,to:e,more:!1}]:t<=3?[{from:1,to:5,more:!0}]:t<=5?[{from:1,to:t+2,more:!0}]:t>=e-1?[{from:1,to:2,more:!0},{from:e-5,to:e,more:!1}]:[{from:1,to:2,more:!0},{from:t-2,to:t+2,more:t+2!=e}]}function r(e,t,n){if(e<=1)return e;if(t==e)return e-1;var r;return t>n?r=t+1:(r=t-1,r<1&&(r=2)),r}e("$");return{getRegions:n,getJumpNo:r}}),l("Pager",function(e,t){function n(e,t,n,r){if("object"==typeof t){var i=t;t=i.from,n=i.to,r=i.more}var a=o.Array.pad(t,n+1),u=o.Array.keep(a,function(t,n){var r=t==e;return o.String.format(l.item,{no:t,active:r?"active":"","data-no":r?"":'data-no="'+t+'"'})}).join("");return r&&(u+=l.more),u}function i(e){function t(){var e=r.getElementById(v),t=e.value;h.to(t,!0)}var n=o.String.random().toLowerCase();this[f]="Pager-"+n;var i=e.container,a=e.current||1,u=e.size,s=e.total,l=y.ceil(s/u),g="ul-pager-"+n,v="txt-pager-"+n,m=new c(this),p={ulId:g,txtId:v,container:i,current:a,size:u,count:l,total:s,hideIfLessThen:e.hideIfLessThen||0,emitter:m,last:0};d.set(this,p);var h=this;o.Array.each(["change","error"],function(t,n){var r=e[t];r&&h.on(t,r)});var b={no:"#"+g+" [data-no]",button:"#"+g+" [data-button]:not(.disabled)",txt:"#"+v};o(i).delegate(b.no,"click",function(e){var t=this,n=+t.getAttribute("data-no");h.to(n,!0)}).delegate(b.button,"click",function(e){var n=this,r=n.getAttribute("data-button");"to"==r?t():h[r](!0)}).delegate(b.txt,"keydown",function(e){13==e.keyCode&&t()})}var o=e("$"),a=e("MiniQuery"),u=a.require("Mapper"),c=a.require("Emitter"),s=t.require("Helper"),f=u.getGuidKey(),d=new u,l=o.String.getTemplates(r.body.innerHTML,[{name:"ul",begin:"<!--Samples.Pager--!",end:"--Samples.Pager-->"},{name:"item",begin:"#--item.begin--#",end:"#--item.end--#",outer:"{items}"},{name:"more",begin:"#--more.begin--#",end:"#--more.end--#",outer:""}]);return i.prototype={constructor:i,render:function(){var e=d.get(this),t=e.count;if(t<e.hideIfLessThen)return void o(e.container).hide();var r=y.min(t,e.current),i=s.getRegions(t,r),a=o.Array.keep(i,function(e,t){return n(r,e)}).join(""),u=s.getJumpNo(t,r,e.last),c=o.String.format(l.ul,{"ul-id":e.ulId,"txt-id":e.txtId,current:r,count:t,total:e.total,toNo:u,"first-disabled-class":r==y.min(1,t)?"disabled":"","final-disabled-class":r==t?"disabled":"","jump-disabled-class":0==t?"disabled":"","txt-disabled":0==t?"disabled":"",items:a});o(e.container).html(c).show()},to:function(e,t){var n=d.get(this),r=n.emitter,i=/^\d+$/.test(e);if(!i)return void(t&&r.fire("error",["输入的页码必须是大于 0 的数字"]));e=parseInt(e);var o=n.count;return e<1||e>o?void(t&&r.fire("error",["输入的页码值只能从 1 到 "+o])):(n.last=n.current,n.current=e,this.render(),void(t&&r.fire("change",[e])))},previous:function(e){var t=d.get(this);this.to(t.current-1,e)},next:function(e){var t=d.get(this);this.to(t.current+1,e)},first:function(e){this.to(1,e)},final:function(e){var t=d.get(this);this.to(t.count,e)},refresh:function(e){var t=d.get(this);this.to(t.current,e)},on:function(){var e=d.get(this),t=e.emitter,n=[].slice.call(arguments,0);t.on.apply(t,n)},destroy:function(){var e=d.get(this);e.emitter.off();var t=e.container;o(t).html("").undelegate(),d.remove(this)}},o.Object.extend(i)}),l("SessionStorage",function(e,t,n){function r(e,t){s[e]=t,u.set(c,s)}function i(e){return s[e]}function o(e){delete s[e],u.set(c,s)}var a=(e("$"),e("MiniQuery")),u=a.require("SessionStorage"),c="permit-5ED1A2BC804DC930",s=u.get(c)||{};return{set:r,get:i,remove:o}}),l("Size",function(e,t,n){function r(e,t,n){"object"==typeof e&&(n=t,t=e,e="");var r=0,i="number"==typeof n?s[n]:u.Array.reduceDimension(s);return i.forEach(function(n){n=e+n;var i=t[n]||0;i=b(i)||0,r+=i}),r}function i(e,t,n){var i=r(e,t,n);return i=c.text(i)}function o(e,t){var n=e[t]||0;return c.text(n)}function a(e,t){"object"==typeof e&&(t=e,e="");var n=u.Array.reduceDimension(s);return u.Array.each(n,function(n){n=e+n,t[n]=o(t,n)}),t}var u=e("$"),c=(e("MiniQuery"),e("NumberField")),s=[["residenceSize","commerceSize","officeSize","otherSize"],["parkSize","otherSize1"]];return{total:r,totalText:i,format:a,text:o}}),l("StatUse",function(e,t,n){function r(e,t){var n=i.Array.keep(o,function(t){var n=t.key,r=0;return g.isArray(n)?n.forEach(function(t){r+=e[t]}):r=e[n],{name:t.name,value:r}});if(!t)return n;var r=0;return n.forEach(function(e){r+=e.value}),r/=2,n.unshift({name:t,value:r,group:!0,subGroup:!0}),n}var i=e("$"),o=(e("MiniQuery"),e("NumberField"),[{name:"计容面积",key:["residenceSize","commerceSize","officeSize","otherSize"]},{name:"住宅",key:"residenceSize"},{name:"商业",key:"commerceSize"},{name:"办公",key:"officeSize"},{name:"其它",key:"otherSize"},{name:"不计容面积",key:["parkSize","otherSize1"]},{name:"地下车库",key:"parkSize"},{name:"其它",key:"otherSize1"}]);return{get:r}}),l("Tabs",function(e,t,n){function r(e){var t=this;this[s]="Tabs-"+i.String.random();var n=e.container,r=e.selector,o=e.activedClass,a=e.event,f=new u(this),d={container:n,selector:r,activedClass:o,eventName:a,activedIndex:-1,emitter:f};c.set(this,d),a&&i(n).delegate(r,a,function(o){var a,u=this;if("indexKey"in e)a=+u.getAttribute(e.indexKey);else{var c=i(n).find(r).toArray();a=i.Array.findIndex(c,function(e,t){return e===u})}f.fire("event",[a,u]),t.active(a,!0)});var l=e.change;l&&this.on("change",l);var g=e.current;"number"==typeof g&&g>=0&&this.active(g,!0)}var i=e("$"),o=e("MiniQuery"),a=o.require("Mapper"),u=o.require("Emitter"),c=new a,s=a.getGuidKey();return r.prototype={constructor:r,active:function(e,t){var n=c.get(this),r=n.activedIndex;if(e!=r||!t){this.reset(),n.activedIndex=e;var o=n.activedClass,a=i(n.container).find(n.selector).toArray(),u=a[e];i(u).addClass(o),t&&n.emitter.fire("change",[e,u])}},reset:function(){var e=c.get(this);i(e.container).find(e.selector).removeClass(e.activedClass),e.activedIndex=-1},remove:function(e){var t=c.get(this),n=t.activedIndex;return e==n?void this.reset():(e<n&&n--,void this.active(n,!1))},destroy:function(){var e=c.get(this),t=e.eventName;t&&i(e.container).undelegate(e.selector,t),e.emitter.off(),c.remove(this)},on:function(e,t){var n=c.get(this),r=n.emitter,i=[].slice.call(arguments,0);r.on.apply(r,i)},getActivedIndex:function(){var e=c.get(this);return e.activedIndex}},i.Object.extend(r,{create:function(e){return new r(e)}})}),l("Url",function(e,t,n){function r(e){return!(!e||"string"!=typeof e)&&(e=e.toLowerCase(),0==e.indexOf("http://")||0==e.indexOf("https://"))}e("$"),e("MiniQuery");return{checkFull:r}}),l("User",function(e,t,n){function r(e){if(e===!0)return c.get("user");var t=s.get("user")||{};return e?t[e]:t}function i(e){s.set("user",e),c.set("user",e)}function o(){var e=r();return"administrator"==e.role}function a(e){var t=r();return t.role==e||"administrator"==t.role}function u(e){return a(e)?"":"display: none;"}var c=(e("$"),e("MiniQuery"),e("LocalStorage")),s=e("SessionStorage");return{get:r,set:i,isSuper:o,is:a,display:u}}),l("/Done/API",function(e,t,n){function r(e){switch(typeof e){case"number":e={pageNo:e};break;case"string":e={keyword:e,pageNo:1}}return e=a.Object.extend(g,e)}function i(e){e=r(e);var t=new s("Plan.page");t.on({request:function(){l=l||c.create("Loading",{mask:0}),l.show("加载中...")},response:function(){l.hide()},success:function(t,n,r){var i=t.list;d.fire("success","get",[i,{total:t.total,no:e.pageNo,size:e.pageSize}])},fail:function(e,t,n,r){c.alert("获取数据失败: {0}",t)},error:function(e,t,n,r){c.alert("获取数据错误: 网络繁忙，请稍候再试")}}),t.post(e)}function o(e){var t=new s("Plan.remove");t.on({request:function(){l=l||c.create("Loading"),l.show("删除中...")},response:function(){l.hide()},success:function(e,t,n){d.fire("success","remove",[])},fail:function(e,t,n,r){c.alert("删除数据失败: {0} ({1})",t,e)},error:function(e,t,n,r){c.alert("删除数据错误: 网络繁忙，请稍候再试")}}),t.get({id:e})}var a=e("$"),u=e("MiniQuery"),c=e("KISP"),s=e("API"),f=u.require("Emitter"),d=new f,l=null,g={pageNo:1,pageSize:c.data("pager").size,keyword:""};return{get:i,remove:o,on:d.on.bind(d)}}),l("/Done/List",function(t,n){var r=t("$"),i=t("KISP"),o=t("User"),a=t("$Object"),u=i.create("Panel","#div-done-list"),c=[];return u.on("init",function(){var t=o.display("plan");u.template(["row"],function(e,n){return{data:{"operate-display":t},list:e.list,fn:function(e,n){e=a.linear(e);var i=r.Object.extend({},e,{index:n,no:n+1,"operate-display":t,"diy-class":e["land.diy"]?"diy":""});return{data:i}}}}),u.$.on("click","[data-cmd]",function(t){var n=this,r=n.getAttribute("data-index"),i=n.getAttribute("data-cmd"),o=c[r].plan;if("remove"==i){var a="确认要删除规划许可【"+o.project+"】 同时也会删除其所拥有的许可证。";return void e.KISP.confirm(a,function(){u.fire("remove",[o])})}u.fire("cmd",[i,o])})}),u.on("render",function(e){c=e,u.fill({list:c}),u.$.toggleClass("nodata",0==c.length)}),u.wrap()}),l("/Done/Pager",function(e,t){var n=(e("$"),e("KISP")),r=e("Pager"),i=n.create("Panel","#div-done-pager"),o=null;return i.on("init",function(){}),i.on("render",function(e){o&&o.destroy(),o=new r({container:i.$.selector,hideIfLessThen:2,current:e.no,size:e.size,total:e.total});var t=null;o.on({change:function(e){clearTimeout(t),t=s(function(){i.fire("change",[e])},300)},error:function(e){n.alert(e)}}),o.render()}),i.wrap()}),l("/Done",function(e,t){var n=(e("$"),e("KISP")),r=(e("User"),e("$Object"),t.require("API")),i=t.require("List"),o=t.require("Pager"),a=n.create("Panel","#div-panel-done");return a.on("init",function(){r.on("success",{get:function(e,t){i.render(e),1==t.no&&o.render(t)},remove:function(){r.get(1)}}),o.on({change:function(e){r.get(e)}}),i.on({cmd:function(e,t){a.fire(e,[t])},remove:function(e){r.remove(e.id)}})}),a.on("render",function(e){r.get({pageNo:1,keyword:e||""})}),a.wrap()}),l("/Tabs",function(e,t){var n,r=(e("$"),e("KISP")),i=r.create("Panel","#ul-tabs"),o=null,a=[{key:"todo",name:"待办任务"},{key:"done",name:"已办列表"}];return i.on("init",function(){o=r.create("Tabs",{container:i.$.get(0),activedClass:"on",eventName:"click"}),o.on("change",function(e,t){n=t,e=a[t],i.fire("change",e.key,[])})}),i.on("render",function(e){e===k&&(e=n),e=e||0,o.render(a,function(e,t){return{index:t,name:e.name}}),o.active(e)}),i.wrap()}),l("/Todo/API",function(e,t,n){function r(e){switch(typeof e){case"number":e={pageNo:e};break;case"string":e={keyword:e,pageNo:1}}return e=o.Object.extend(l,e)}function i(e){e=r(e);var t=new c("Plan.todos");t.on({request:function(){d=d||u.create("Loading",{mask:0}),d.show("加载中...")},response:function(){d.hide()},success:function(t,n,r){var i=t.list;f.fire("success",[i,{total:t.total,no:e.pageNo,size:e.pageSize}])},fail:function(e,t,n,r){u.alert("获取数据失败: {0}",t)},error:function(e,t,n,r){u.alert("获取数据错误: 网络繁忙，请稍候再试")}}),t.post(e)}var o=e("$"),a=e("MiniQuery"),u=e("KISP"),c=e("API"),s=a.require("Emitter"),f=new s,d=null,l={pageNo:1,pageSize:u.data("pager").size,keyword:""};return{get:i,on:f.on.bind(f)}}),l("/Todo/List",function(e,t){var n=e("$"),r=e("KISP"),i=e("User"),o=e("Size"),a=r.create("Panel","#div-todo-list"),u=[];return a.on("init",function(){var e=i.display("plan");a.template(["row"],function(t,r){return{data:{"operate-display":e},list:t.list,fn:function(t,r){var i=n.Object.extend({},t,{index:r,no:r+1,"operate-display":e,datetime:t.datetime.split(" ")[0],totalSize:o.totalText(t),size:o.text(t,"size"),"diy-class":"是"==t.diy?"diy":""});return{data:i}}}}),a.$.on("click","[data-cmd]",function(e){var t=this,n=t.getAttribute("data-index"),r=t.getAttribute("data-cmd"),i=u[n];a.fire("cmd",[r,i])})}),a.on("render",function(e){u=e,a.fill({list:u}),a.$.toggleClass("nodata",0==u.length)}),a.wrap()}),l("/Todo/Pager",function(e,t){var n=(e("$"),e("KISP")),r=e("Pager"),i=n.create("Panel","#div-todo-pager"),o=null;return i.on("init",function(){}),i.on("render",function(e){o&&o.destroy(),o=new r({container:i.$.selector,hideIfLessThen:2,current:e.no,size:e.size,total:e.total});var t=null;o.on({change:function(e){clearTimeout(t),t=s(function(){i.fire("change",[e])},300)},error:function(e){n.alert(e)}}),o.render()}),i.wrap()}),l("/Todo",function(e,t){var n=(e("$"),e("KISP")),r=t.require("API"),i=t.require("List"),o=t.require("Pager"),a=n.create("Panel","#div-panel-todo");return a.on("init",function(){r.on("success",function(e,t){i.render(e),1==t.no&&o.render(t)}),o.on({change:function(e){r.get(e)}}),i.on({cmd:function(e,t){a.fire(e,[t])}})}),a.on("render",function(e){r.get({pageNo:1,keyword:e||""})}),a.wrap()}),d.launch(function(e,t){var n=(e("$"),e("MiniQuery")),r=(e("KISP"),n.require("Url"),e("Bridge")),i=t.require("Tabs"),o=t.require("Todo"),a=t.require("Done"),u=null;i.on("change",{todo:function(){a.hide(),o.render(),u=o},done:function(){o.hide(),a.render(),u=a}}),o.on({detail:function(e){r.open({name:"土地出让详情",url:"html/land/detail/index.html?id="+e.id})},edit:function(e){r.open(["plan","add"],{landId:e.id})}}),a.on({"land.detail":function(e){r.open({name:"土地出让详情",url:"html/land/detail/index.html?id="+e.landId})},detail:function(e){r.open({name:"规划许可详情",url:"html/plan/detail/index.html?id="+e.id})},edit:function(e){r.open(["plan","add"],{id:e.id})}}),r.on({search:function(e){u.render(e)}}),i.render()})}(top,parent,window,document,location,localStorage,sessionStorage,window.console||{log:function(){},dir:function(){},clear:function(){},error:function(){},info:function(){},debug:function(){},warn:function(){}},history,setTimeout,setInterval,KISP,KISP.require("Module").define,Array,Boolean,Date,Error,Function,Math,Number,Object,RegExp,String);