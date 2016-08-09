!function(e,t,n,r,i,o,a,u,c,s,f,l,d,v,m,g,h,y,p,b,S,x,k,w){d("API",function(e,t,n){function r(t,n){var r=e("User"),o=r.get("token"),a=i.create("API",t,n),c=a.get.bind(a),s=a.post.bind(a);return a.get=function(e){return e=e||{},e.token=o,c(e)},a.post=function(e,n){return n=n||{},n.token=o,u.log(t,e),s({data:e},n)},a}var i=(e("$"),e("KISP"));return r}),d("Array",function(e,t,n){function r(e,t,n){return n===w&&(n=1),o.Array.keep(e,function(e,r){var i=e.value+t[r].value*n;return o.Object.extend({},e,{value:i})})}function i(e,t){return r(e,t,-1)}var o=e("$");e("MiniQuery"),e("NumberField");return{substract:i}}),d("Bridge",function(t,r){if(n!==e){var i=e.require(r.id);return{on:function(e,t){var r=[].slice.call(arguments,0);i.bind(n,r)},open:function(e,t,n){i.open(e,t,n)},close:function(){i.close(n)},refresh:function(e){i.refresh(e)},data:function(e,t){var n=[].slice.call(arguments,0);return i.data.apply(null,n)}}}var o=t("$"),a=t("MiniQuery"),u=a.require("Emitter"),c=a.require("Mapper"),s=new c,f=new u,l={};return{bind:function(e,t){var n=s.get(e);n||(n=new u,s.set(e,n)),n.on.apply(n,t)},fire:function(e,t,n){var r="object"==typeof t?t.id:t,i=o("iframe").toArray(),a=o.Array.findItem(i,function(e,t){var n=e.getAttribute("data-sn");return n==r});if(a){var u=a.contentWindow,c=s.get(u);if(c){n=n||[];var f=c.fire(e,n),l=f.length;return l>0?f[l-1]:void 0}}},open:function(e,t,n){f.fire("open",[e,t,n])},refresh:function(e){f.fire("refresh",[e])},close:function(e){var t=o("iframe").toArray(),n=o.Array.findItem(t,function(t,n){return t.contentWindow===e});if(n){var r=n.getAttribute("data-sn");f.fire("close",[r])}},data:function(e,t){return 1==arguments.length?(t=l[e],t=JSON.parse(t)):null===t?void delete l[e]:(t=JSON.stringify(t),l[e]=t,t)},on:f.on.bind(f)}}),d("Cell",function(e,t,n){function r(e,t){"object"==typeof e&&(t=e,e="");var n=0;return s.forEach(function(r){r=e+r;var i=t[r]||0;i=b(i)||0,n+=i}),n}function i(e,t){var n=r(e,t);return n=c.text(n)}function o(e,t){var n=e[t]||0;return c.text(n)}function a(e,t){return"object"==typeof e&&(t=e,e=""),u.Array.each(s,function(n){n=e+n,t[n]=o(t,n)}),t}var u=e("$"),c=(e("MiniQuery"),e("NumberField")),s=["residenceCell","commerceCell","officeCell","otherCell"];return{total:r,totalText:i,format:a,text:o}}),d("Chart",function(e,t,r){var i=(e("$"),e("MiniQuery"),n.Chart);return i}),d("DateTimePicker",function(e,t,n){function r(e,t,n){var r=c.get(e),i=r.$this,o=[].slice.call(n,0);return o=[t].concat(o),i.datetimepicker.apply(i,o)}function i(e,t){o.Object.isPlain(e)&&(t=e,e=t.selector,delete t.selector),t=o.Object.extend({},s,t);var n=o(e).datetimepicker(t),r={$this:n};c.set(this,r)}var o=e("$"),a=e("MiniQuery"),u=a.require("Mapper"),c=new u,s={format:"yyyy-mm-dd",autoclose:!0,minView:"month",todayBtn:!0,todayHighlight:!0,pickerPosition:"top-right"};return i.prototype={constructor:i,on:function(e,t){var n=c.get(this),r=n.$this;r.on(e,t)},remove:function(){r(this,"remove",arguments)},show:function(){r(this,"show",arguments)},hide:function(){r(this,"hide",arguments)},update:function(){r(this,"update",arguments)},setStartDate:function(){r(this,"setStartDate",arguments)},setEndDate:function(){r(this,"setEndDate",arguments)},setDaysOfWeekDisabled:function(){r(this,"setDaysOfWeekDisabled",arguments)}},o.Object.extend(i,{config:function(e){return 0==arguments.length?s:void o.Object.extend(s,e)},create:function(e,t){return new i(e,t)}})}),d("LocalStorage",function(e,t,n){function r(e,t){s[e]=t,u.set(c,s)}function i(e){return s[e]}function o(e){delete s[e],u.set(c,s)}var a=(e("$"),e("MiniQuery")),u=a.require("LocalStorage"),c="permit-5ED1A2BC804DC930",s=u.get(c)||{};return{set:r,get:i,remove:o}}),d("Logs",function(t,n,r){var i=(t("$"),t("MiniQuery"),t("KISP")),o=i.create("Panel"),a=null;return o.on("init",function(){a=i.create("Dialog",{title:"处理结果",text:"<textarea readonly></textarea>",buttons:[{text:"确定",name:"ok"}],cssClass:"dialog-Logs",height:500,width:800,autoClosed:!0,"z-index":9999}),a.on("show",function(){var t=e.document.body.scrollTop+20;a.$.css("top",t)}),a.on("button","ok",function(){var e=a.data("ok");e&&e()})}),o.on("render",function(e,t){v.isArray(e)&&(e=e.join("\n")),a.data("ok",t),a.show(),a.$.find("textarea").val(e)}),o.wrap()}),d("Multitask",function(e,t,n){function r(e){return u.Array.keep(e,function(e,t){return!1})}function i(e,t){var n=e&&e.length>0;n&&(u.Array.each(e,function(e,t){if(!e)return n=!1,!1}),n&&t&&t(e))}function o(e,t){var n=r(e);u.Array.each(e,function(e,r){if("function"==typeof e)e(function(e,o){n[r]=e,i(n,t)});else{var o=e.fn,a=e.args||[],u=e.context||null;a.push(function(e,o){n[r]=e,i(n,t)}),o.apply(u,a)}})}function a(e,t){var n=r(e),i=0,o=e.length;!function(){var r=arguments.callee,a=e[i];a(function(e){n[i]=e,i++,i<o?r():t&&t(n)})}()}var u=e("$");return{concurrency:o,serial:a}}),d("NumberField",function(e,t,n){function i(e){var t={};return u.Object.each(e,function(e,n){var r=l[e];if(r){var i=d[e];i&&(n=i[n]),t[r]=n}else t[e]=n}),t}function o(e,t,n){var r=f.get(e),i=r.$this,o=[].slice.call(n,0);return o=[t].concat(o),i.autoNumeric.apply(i,o)}function a(e,t){u.Object.isPlain(e)&&(t=e,e=t.selector,delete t.selector),t=u.Object.extend({},v,t),t=i(t);var n=u(e).autoNumeric(t),r={$this:n};f.set(this,r)}var u=e("$"),c=e("MiniQuery"),s=c.require("Mapper"),f=new s,l={groupSign:"aSep",groupCount:"dGroup",decimalSign:"aDec",decimalKey:"altDec",currencySign:"aSign",currencyPlace:"pSign",min:"vMin",max:"vMax",decimalCount:"mDec",round:"mRound",padded:"aPad",bracket:"nBracket",empty:"wEmpty",leadingZero:"lZero",formatted:"aForm"},d={currencyPlace:{left:"p",right:"s"}},v={groupSign:",",groupCount:3,decimalSign:".",decimalKey:null,currencySign:"",currencyPlace:"left",min:"0.00",max:"9999999999999.99",decimalCount:2,round:"S",padded:!1,bracket:null,empty:"empty",leadingZero:"allow",formatted:!0};a.prototype={constructor:a,init:function(){o(this,"init",arguments)},destroy:function(){o(this,"destroy",arguments)},update:function(e){e&&(arguments[0]=i(e)),o(this,"update",arguments)},set:function(){o(this,"set",arguments)},get:function(){return o(this,"get",arguments)},getString:function(){return o(this,"getString",arguments)},getArray:function(){return o(this,"getArray",arguments)},getSettings:function(){return o(this,"getSettings",arguments)}};var m=null,g=null;return u.Object.extend(a,{config:function(e){return 0==arguments.length?v:void u.Object.extend(v,e)},create:function(e,t){return new a(e,t)},update:function(e,t){new a(e).update(t)},value:function(e){var t=new a(e),n=t.get();return n=b(n)},text:function(e,t){return t=u.Object.extend(v,{min:"-9999999999999.99",currencySign:""},t),m||(m=r.createElement("input"),m.type="text",g=new a(m,t)),m.value=e,g.update(t),m.value},money:function(e,t){return t=u.Object.extend({},t,{currencySign:"¥"}),a.text(e,t)}})}),d("$Object",function(e,t){function n(e,t){t=t||".";var i={};return S.keys(e).forEach(function(o){var a=e[o];return r.Object.isPlain(a)?void S.keys(a).forEach(function(e){var r=a[e];if(r&&"object"==typeof r){var u=n(a,t);S.keys(u).forEach(function(e){i[o+t+e]=u[e]})}else i[o+t+e]=r}):void(i[o]=a)}),i}var r=e("$");return{linear:n}}),d("Pager/Helper",function(e,t){function n(e,t){return e<=10?[{from:1,to:e,more:!1}]:t<=3?[{from:1,to:5,more:!0}]:t<=5?[{from:1,to:t+2,more:!0}]:t>=e-1?[{from:1,to:2,more:!0},{from:e-5,to:e,more:!1}]:[{from:1,to:2,more:!0},{from:t-2,to:t+2,more:t+2!=e}]}function r(e,t,n){if(e<=1)return e;if(t==e)return e-1;var r;return t>n?r=t+1:(r=t-1,r<1&&(r=2)),r}e("$");return{getRegions:n,getJumpNo:r}}),d("Pager",function(e,t){function n(e,t,n,r){if("object"==typeof t){var i=t;t=i.from,n=i.to,r=i.more}var a=o.Array.pad(t,n+1),u=o.Array.keep(a,function(t,n){var r=t==e;return o.String.format(d.item,{no:t,active:r?"active":"","data-no":r?"":'data-no="'+t+'"'})}).join("");return r&&(u+=d.more),u}function i(e){function t(){var e=r.getElementById(m),t=e.value;y.to(t,!0)}var n=o.String.random().toLowerCase();this[f]="Pager-"+n;var i=e.container,a=e.current||1,u=e.size,s=e.total,d=p.ceil(s/u),v="ul-pager-"+n,m="txt-pager-"+n,g=new c(this),h={ulId:v,txtId:m,container:i,current:a,size:u,count:d,total:s,hideIfLessThen:e.hideIfLessThen||0,emitter:g,last:0};l.set(this,h);var y=this;o.Array.each(["change","error"],function(t,n){var r=e[t];r&&y.on(t,r)});var b={no:"#"+v+" [data-no]",button:"#"+v+" [data-button]:not(.disabled)",txt:"#"+m};o(i).delegate(b.no,"click",function(e){var t=this,n=+t.getAttribute("data-no");y.to(n,!0)}).delegate(b.button,"click",function(e){var n=this,r=n.getAttribute("data-button");"to"==r?t():y[r](!0)}).delegate(b.txt,"keydown",function(e){13==e.keyCode&&t()})}var o=e("$"),a=e("MiniQuery"),u=a.require("Mapper"),c=a.require("Emitter"),s=t.require("Helper"),f=u.getGuidKey(),l=new u,d=o.String.getTemplates(r.body.innerHTML,[{name:"ul",begin:"<!--Samples.Pager--!",end:"--Samples.Pager-->"},{name:"item",begin:"#--item.begin--#",end:"#--item.end--#",outer:"{items}"},{name:"more",begin:"#--more.begin--#",end:"#--more.end--#",outer:""}]);return i.prototype={constructor:i,render:function(){var e=l.get(this),t=e.count;if(t<e.hideIfLessThen)return void o(e.container).hide();var r=p.min(t,e.current),i=s.getRegions(t,r),a=o.Array.keep(i,function(e,t){return n(r,e)}).join(""),u=s.getJumpNo(t,r,e.last),c=o.String.format(d.ul,{"ul-id":e.ulId,"txt-id":e.txtId,current:r,count:t,total:e.total,toNo:u,"first-disabled-class":r==p.min(1,t)?"disabled":"","final-disabled-class":r==t?"disabled":"","jump-disabled-class":0==t?"disabled":"","txt-disabled":0==t?"disabled":"",items:a});o(e.container).html(c).show()},to:function(e,t){var n=l.get(this),r=n.emitter,i=/^\d+$/.test(e);if(!i)return void(t&&r.fire("error",["输入的页码必须是大于 0 的数字"]));e=parseInt(e);var o=n.count;return e<1||e>o?void(t&&r.fire("error",["输入的页码值只能从 1 到 "+o])):(n.last=n.current,n.current=e,this.render(),void(t&&r.fire("change",[e])))},previous:function(e){var t=l.get(this);this.to(t.current-1,e)},next:function(e){var t=l.get(this);this.to(t.current+1,e)},first:function(e){this.to(1,e)},final:function(e){var t=l.get(this);this.to(t.count,e)},refresh:function(e){var t=l.get(this);this.to(t.current,e)},on:function(){var e=l.get(this),t=e.emitter,n=[].slice.call(arguments,0);t.on.apply(t,n)},destroy:function(){var e=l.get(this);e.emitter.off();var t=e.container;o(t).html("").undelegate(),l.remove(this)}},o.Object.extend(i)}),d("SessionStorage",function(e,t,n){function r(e,t){s[e]=t,u.set(c,s)}function i(e){return s[e]}function o(e){delete s[e],u.set(c,s)}var a=(e("$"),e("MiniQuery")),u=a.require("SessionStorage"),c="permit-5ED1A2BC804DC930",s=u.get(c)||{};return{set:r,get:i,remove:o}}),d("Size",function(e,t,n){function r(e,t,n){"object"==typeof e&&(n=t,t=e,e="");var r=0,i="number"==typeof n?s[n]:u.Array.reduceDimension(s);return i.forEach(function(n){n=e+n;var i=t[n]||0;i=b(i)||0,r+=i}),r}function i(e,t,n){var i=r(e,t,n);return i=c.text(i)}function o(e,t){var n=e[t]||0;return c.text(n)}function a(e,t){"object"==typeof e&&(t=e,e="");var n=u.Array.reduceDimension(s);return u.Array.each(n,function(n){n=e+n,t[n]=o(t,n)}),t}var u=e("$"),c=(e("MiniQuery"),e("NumberField")),s=[["residenceSize","commerceSize","officeSize","otherSize"],["parkSize","otherSize1"]];return{total:r,totalText:i,format:a,text:o}}),d("StatUse",function(e,t,n){function r(e,t){var n=i.Array.keep(o,function(t){var n=t.key,r=0;return v.isArray(n)?n.forEach(function(t){r+=e[t]}):r=e[n],{name:t.name,value:r}});if(!t)return n;var r=0;return n.forEach(function(e){r+=e.value}),r/=2,n.unshift({name:t,value:r,group:!0,subGroup:!0}),n}var i=e("$"),o=(e("MiniQuery"),e("NumberField"),[{name:"计容面积",key:["residenceSize","commerceSize","officeSize","otherSize"]},{name:"住宅",key:"residenceSize"},{name:"商业",key:"commerceSize"},{name:"办公",key:"officeSize"},{name:"其它",key:"otherSize"},{name:"不计容面积",key:["parkSize","otherSize1"]},{name:"地下车库",key:"parkSize"},{name:"其它",key:"otherSize1"}]);return{get:r}}),d("Tabs",function(e,t,n){function r(e){var t=this;this[s]="Tabs-"+i.String.random();var n=e.container,r=e.selector,o=e.activedClass,a=e.event,f=new u(this),l={container:n,selector:r,activedClass:o,eventName:a,activedIndex:-1,emitter:f};c.set(this,l),a&&i(n).delegate(r,a,function(o){var a,u=this;if("indexKey"in e)a=+u.getAttribute(e.indexKey);else{var c=i(n).find(r).toArray();a=i.Array.findIndex(c,function(e,t){return e===u})}f.fire("event",[a,u]),t.active(a,!0)});var d=e.change;d&&this.on("change",d);var v=e.current;"number"==typeof v&&v>=0&&this.active(v,!0)}var i=e("$"),o=e("MiniQuery"),a=o.require("Mapper"),u=o.require("Emitter"),c=new a,s=a.getGuidKey();return r.prototype={constructor:r,active:function(e,t){var n=c.get(this),r=n.activedIndex;if(e!=r||!t){this.reset(),n.activedIndex=e;var o=n.activedClass,a=i(n.container).find(n.selector).toArray(),u=a[e];i(u).addClass(o),t&&n.emitter.fire("change",[e,u])}},reset:function(){var e=c.get(this);i(e.container).find(e.selector).removeClass(e.activedClass),e.activedIndex=-1},remove:function(e){var t=c.get(this),n=t.activedIndex;return e==n?void this.reset():(e<n&&n--,void this.active(n,!1))},destroy:function(){var e=c.get(this),t=e.eventName;t&&i(e.container).undelegate(e.selector,t),e.emitter.off(),c.remove(this)},on:function(e,t){var n=c.get(this),r=n.emitter,i=[].slice.call(arguments,0);r.on.apply(r,i)},getActivedIndex:function(){var e=c.get(this);return e.activedIndex}},i.Object.extend(r,{create:function(e){return new r(e)}})}),d("Url",function(e,t,n){function r(e){return!(!e||"string"!=typeof e)&&(e=e.toLowerCase(),0==e.indexOf("http://")||0==e.indexOf("https://"))}e("$"),e("MiniQuery");return{checkFull:r}}),d("User",function(e,t,n){function r(e){if(e===!0)return c.get("user");var t=s.get("user")||{};return e?t[e]:t}function i(e){s.set("user",e),c.set("user",e)}function o(){var e=r();return"administrator"==e.role}function a(e){var t=r();return t.role==e||"administrator"==t.role}function u(e){return a(e)?"":"display: none;"}var c=(e("$"),e("MiniQuery"),e("LocalStorage")),s=e("SessionStorage");return{get:r,set:i,isSuper:o,is:a,display:u}}),d("/API",function(e,t,n){function r(e){var t=new a("SaleLicense.get");t.on({request:function(){s=s||o.create("Loading",{mask:0}),s.show("加载中...")},response:function(){s.hide()},success:function(e,t,n){c.fire("success","get",[e])},fail:function(e,t,n,r){o.alert("获取数据失败: {0}",t)},error:function(e,t,n,r){o.alert("获取数据错误: 网络繁忙，请稍候再试")}}),t.get({id:e})}var i=(e("$"),e("MiniQuery")),o=e("KISP"),a=e("API"),u=i.require("Emitter"),c=new u,s=null;return{get:r,on:c.on.bind(c)}}),d("/Form",function(e,t,n){var r=e("$"),i=(e("MiniQuery"),e("KISP")),o=e("Cell"),a=e("Size"),u=(e("NumberField"),i.create("Panel","#div-form")),c={0:{number:"预售",title:"预售"},1:{number:"备案",title:"现售"}};return u.on("render",function(e){var t="land"in e;u.$.toggleClass("temp",t),S.keys(e).forEach(function(t){var n=t+"Desc";n in e||(e[n]="")});var n=c[e.type];e=r.Object.extend({},e,{"type.number":n.number,"type.title":n.title,totalSize0:a.totalText(e,0),totalSize1:a.totalText(e,1),totalSize:a.totalText(e),totalCell:o.totalText(e),"saled-totalSize0":a.totalText("saled-",e,0),"saled-totalSize1":a.totalText("saled-",e,1),"saled-totalSize":a.totalText("saled-",e),"saled-totalCell":o.totalText("saled-",e)}),e=a.format(e),e=o.format(e),e=a.format("saled-",e),e=o.format("saled-",e),u.fill(e)}),u.wrap()}),d("/Header",function(e,t,n){var r=(e("$"),e("MiniQuery"),e("KISP")),i=e("User"),o=r.create("Panel","#div-header"),a={0:"预售许可证",1:"现售备案"};return o.on("init",function(){o.$.on("click","button",function(){o.fire("submit")})}),o.on("render",function(e){o.fill({text:a[e.type]});var t="land"in e;o.$.toggleClass("noop",t||!i.is("sale"))}),o.wrap()}),l.launch(function(e,t){var r=(e("$"),e("MiniQuery")),i=e("KISP"),o=e("Bridge"),a=r.require("Url"),u=t.require("API"),c=t.require("Form"),s=t.require("Header");u.on("success",{get:function(e){s.render(e),c.render(e)}}),s.on("submit",function(){o.open({name:"编辑预售许可证",url:"html/sale/license/add/index.html?id="+v})});var f=a.getQueryString(n),l=f.key;if(l){var d=o.data(l);return s.render(d),void c.render(d)}var v=f.id;return v?void u.get(v):void i.alert("请传入 id")})}(top,parent,window,document,location,localStorage,sessionStorage,window.console||{log:function(){},dir:function(){},clear:function(){},error:function(){},info:function(){},debug:function(){},warn:function(){}},history,setTimeout,setInterval,KISP,KISP.require("Module").define,Array,Boolean,Date,Error,Function,Math,Number,Object,RegExp,String);