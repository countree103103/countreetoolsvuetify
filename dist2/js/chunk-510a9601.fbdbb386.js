(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-510a9601"],{"11f8":function(t,e,i){"use strict";(function(e){var n=i("3022");function s(t){if("string"!==typeof t)throw new TypeError("Path must be a string. Received "+n.inspect(t))}function r(t,e){for(var i=[],n=0;n<t.length;n++){var s=t[n];s&&"."!==s&&(".."===s?i.length&&".."!==i[i.length-1]?i.pop():e&&i.push(".."):i.push(s))}return i}function o(t){for(var e=t.length-1,i=0;i<=e;i++)if(t[i])break;for(var n=e;n>=0;n--)if(t[n])break;return 0===i&&n===e?t:i>n?[]:t.slice(i,n+1)}var l=/^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/,a=/^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/,c={};function u(t){var e=l.exec(t),i=(e[1]||"")+(e[2]||""),n=e[3],s=a.exec(n),r=s[1],o=s[2],c=s[3];return[i,r,o,c]}function f(t){var e=l.exec(t),i=e[1]||"",n=!!i&&":"!==i[1];return{device:i,isUnc:n,isAbsolute:n||!!e[2],tail:e[3]}}function d(t){return"\\\\"+t.replace(/^[\\\/]+/,"").replace(/[\\\/]+/g,"\\")}c.resolve=function(){for(var t="",i="",n=!1,o=arguments.length-1;o>=-1;o--){var l;if(o>=0?l=arguments[o]:t?(l=Object({NODE_ENV:"production",BASE_URL:"/"})["="+t],l&&l.substr(0,3).toLowerCase()===t.toLowerCase()+"\\"||(l=t+"\\")):l=e.cwd(),s(l),""!==l){var a=f(l),c=a.device,u=a.isUnc,p=a.isAbsolute,h=a.tail;if((!c||!t||c.toLowerCase()===t.toLowerCase())&&(t||(t=c),n||(i=h+"\\"+i,n=p),t&&n))break}}return u&&(t=d(t)),i=r(i.split(/[\\\/]+/),!n).join("\\"),t+(n?"\\":"")+i||"."},c.normalize=function(t){s(t);var e=f(t),i=e.device,n=e.isUnc,o=e.isAbsolute,l=e.tail,a=/[\\\/]$/.test(l);return l=r(l.split(/[\\\/]+/),!o).join("\\"),l||o||(l="."),l&&a&&(l+="\\"),n&&(i=d(i)),i+(o?"\\":"")+l},c.isAbsolute=function(t){return s(t),f(t).isAbsolute},c.join=function(){for(var t=[],e=0;e<arguments.length;e++){var i=arguments[e];s(i),i&&t.push(i)}var n=t.join("\\");return/^[\\\/]{2}[^\\\/]/.test(t[0])||(n=n.replace(/^[\\\/]{2,}/,"\\")),c.normalize(n)},c.relative=function(t,e){s(t),s(e),t=c.resolve(t),e=c.resolve(e);for(var i=t.toLowerCase(),n=e.toLowerCase(),r=o(e.split("\\")),l=o(i.split("\\")),a=o(n.split("\\")),u=Math.min(l.length,a.length),f=u,d=0;d<u;d++)if(l[d]!==a[d]){f=d;break}if(0===f)return e;var p=[];for(d=f;d<l.length;d++)p.push("..");return p=p.concat(r.slice(f)),p.join("\\")},c._makeLong=function(t){if("string"!==typeof t)return t;if(!t)return"";var e=c.resolve(t);return/^[a-zA-Z]\:\\/.test(e)?"\\\\?\\"+e:/^\\\\[^?.]/.test(e)?"\\\\?\\UNC\\"+e.substring(2):t},c.dirname=function(t){var e=u(t),i=e[0],n=e[1];return i||n?(n&&(n=n.substr(0,n.length-1)),i+n):"."},c.basename=function(t,e){if(void 0!==e&&"string"!==typeof e)throw new TypeError('"ext" argument must be a string');var i=u(t)[2];return e&&i.substr(-1*e.length)===e&&(i=i.substr(0,i.length-e.length)),i},c.extname=function(t){return u(t)[3]},c.format=function(t){if(null===t||"object"!==typeof t)throw new TypeError('Parameter "pathObject" must be an object, not '+typeof t);var e=t.root||"";if("string"!==typeof e)throw new TypeError('"pathObject.root" must be a string or undefined, not '+typeof t.root);var i=t.dir,n=t.base||"";return i?i[i.length-1]===c.sep?i+n:i+c.sep+n:n},c.parse=function(t){s(t);var e=u(t);return{root:e[0],dir:e[0]+e[1].slice(0,-1),base:e[2],ext:e[3],name:e[2].slice(0,e[2].length-e[3].length)}},c.sep="\\",c.delimiter=";";t.exports=c}).call(this,i("4362"))},1580:function(t,e,i){"use strict";i("9c2b")},"28a4":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",[i("v-container",{staticClass:"d-flex flex-column",attrs:{id:"fileControlGroup",dense:""}},[i("v-container",{staticClass:"d-flex flex-column"},[i("p",[t._v("ID: "+t._s(t.id))]),i("p",{staticStyle:{color:"green"}},[t._v("当前路径: "+t._s(t.currentUrl))])]),i("v-container",{staticClass:"d-flex flex-column flex-shrink-0"},[i("v-text-field",{attrs:{dense:""},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.openDir(t.currentUrl)}},model:{value:t.currentUrl,callback:function(e){t.currentUrl=e},expression:"currentUrl"}}),i("v-btn-toggle",{attrs:{"background-color":"transparent",dense:"",max:"0",multiple:""}},[i("v-btn",{attrs:{outlined:"",small:""},on:{click:function(e){return t.openDir(t.currentUrl)}}},[t._v("读取目录")]),i("v-btn",{attrs:{outlined:"",small:""},on:{click:t.goBack}},[t._v("返回")]),t.selectedFile&&!t.selectedFile.isDir?[i("v-btn",{attrs:{outlined:"",small:""},on:{click:function(e){return t.download(t.selectedFile.name)}}},[t._v("下载选择文件")]),i("v-btn",{attrs:{outlined:"",small:""}},[t._v("显示选择文件内容")])]:t._e()],2)],1)],1),i("div",{staticClass:"fileGroup"},[i("div",{staticClass:"fileLstat",staticStyle:{position:"absolute"}},[i("div",{staticClass:"fileName",on:{click:function(e){return t.switchSort("文件名")}}},[t._v(" 文件名"),t.calSortShow("文件名","降序")?i("i",{staticClass:"fa fa-angle-up"}):t._e(),t.calSortShow("文件名","升序")?i("i",{staticClass:"fa fa-angle-down"}):t._e()]),i("div",{staticClass:"fileInfo"},[i("p",{staticClass:"fileInfo_ctime",on:{click:function(e){return t.switchSort("时间")}}},[t._v(" 修改时间"),t.calSortShow("时间","降序")?i("i",{staticClass:"fa fa-angle-up"}):t._e(),t.calSortShow("时间","升序")?i("i",{staticClass:"fa fa-angle-down"}):t._e()]),i("p",{staticClass:"fileInfo_size",on:{click:function(e){return t.switchSort("文件大小")}}},[t._v(" 文件大小"),t.calSortShow("文件大小","降序")?i("i",{staticClass:"fa fa-angle-up"}):t._e(),t.calSortShow("文件大小","升序")?i("i",{staticClass:"fa fa-angle-down"}):t._e()])])]),i("div",{staticClass:"filesWrapper",staticStyle:{"margin-top":"30px"},on:{dblclick:t.goBack}},[t._m(0)]),t._l(t.sortedFileList,(function(e,n){return[i("div",{key:n,staticClass:"filesWrapper",class:t.isSelected(e),on:{contextmenu:function(i){return t.showFileContextMenu(e.name)},click:function(e){return t.selectFile(t.fileList[n])},dblclick:function(i){return t.openDir(e.name)}}},[i("div",{staticClass:"fileName"},[i("p",[i("i",{class:t.getExtCssObj(e.name).class,style:t.getExtCssObj(e.name).style}),t._v(" "+t._s(e.name)+" ")])]),i("div",{staticClass:"fileInfo"},[e.lstat.ctime?i("p",{staticClass:"fileInfo_ctime"},[t._v(" "+t._s(new Date(e.lstat.mtime).toLocaleString())+" ")]):t._e(),e.lstat.size?i("p",{staticClass:"fileInfo_size"},[t._v(" "+t._s(t.calcFileSize(e))+" ")]):t._e()])])]}))],2)],1),i("context-menu",{attrs:{contextMenu:t.$store.state.contextMenu,msg:t.msg,template:t.contextMenu.template}})],1)},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"fileName"},[i("p",[t._v("..\\")])])}],r=i("d4ec"),o=(i("b0c0"),i("99af"),i("b680"),i("11f8")),l=i.n(o),a=i("6825"),c=i("6adc"),u=i("b85c"),f=(i("fb6a"),i("ac1f"),i("1276"),"1px 0px 1px black"),d={EXT_UNKNOW:[{class:"fa fa-file-o",style:null},""],EXT_EXCEL:[{class:"fa fa-file-excel-o",style:null},"xls"],EXT_WORD:[{class:"fa fa-file-word-o",style:null},"word","docx","doc"],EXT_IMAGE:[{class:"fa fa-file-image-o",style:null},"jpeg","jpg"],EXT_ARCHIVE:[{class:"fa fa-file-zip-o",style:null},"rar","zip","7zip","7z"],EXT_AUDIO:[{class:"fa fa-file-audio-o",style:null},"mp3"],EXT_VIDEO:[{class:"fa fa-file-video-o",style:null},"mp4"],EXT_POWERPOINT:[{class:"fa fa-file-powerpoint-o",style:null},"ppt"],EXT_DIR:[{class:"fa fa-folder",style:{color:"yellow","text-shadow":f}}],calcClass:function(t){if(""==t)return d["EXT_DIR"][0];for(var e in d)if(Object.hasOwnProperty.call(d,e)){if(!(d[e]instanceof Array))continue;var i,n=d[e][0],s=d[e].slice(1),r=Object(u["a"])(s);try{for(r.s();!(i=r.n()).done;){var o=i.value;if(t.split(".")[1]==o)return n}}catch(l){r.e(l)}finally{r.f()}}return d.EXT_UNKNOW[0]}},p=d,h=function t(){Object(r["a"])(this,t)};h.IdIndex=function(t){for(var e=0;e<window.clientArr.length;e++)if(window.clientArr[e].id===t)return e;return-1};var v={name:"fileexplorer",data:function(){return{id:"",currentUrl:"c:\\Users",fileList:[],sortedFileList:[],selectedFile:null,msg:{},sortedBy:{name:"文件名",type:"升序"},contextMenu:{template:[{label:"下载此文件",click:function(){}},{label:"显示此文件内容",click:function(){}}]}}},watch:{sortedBy:{handler:function(t,e){this.sortFileList()},deep:!0}},computed:{isDir:function(){return function(t){return t?{color:"red"}:{}}},isSelected:function(){var t=this;return function(e){var i=[];return e==t.selectedFile&&i.push("file-selected"),i}},getExtCssObj:function(){return function(t){var e=l.a.extname(t);return p.calcClass(e)}},calSortShow:function(){var t=this;return function(e,i){return e==t.sortedBy.name&&i==t.sortedBy.type}}},beforeMount:function(){var t=this,e=this;this.$nextTick((function(){t.openDir(".")})),window.io.on("apilistdir",(function(t,i){t.length&&(e.fileList=t,e.sortedFileList=e.fileList,e.currentUrl=i,e.sortFileList())})),window.io.on("apidownloadfile",(function(t){window.open("".concat(c["SERVER_ADDRESS"],":7071/tmpDir/").concat(t))})),window.io.on("apishowfilecontent",(function(t){})),this.id=this.$route.query.id,this.interval=setInterval((function(){-1==h.IdIndex(t.id)&&(clearInterval(t.interval),t.$router.push("/trojan/clients"))}),200)},methods:{switchSort:function(t){this.sortedBy.name==t?"升序"==this.sortedBy.type?this.sortedBy.type="降序":"降序"==this.sortedBy.type&&(this.sortedBy.type="升序"):this.sortedBy={name:t,type:"升序"},console.log(this.sortedBy)},sortFileList:function(){switch(this.sortedBy.name){case"文件名":switch(this.sortedBy.type){case"升序":this.sortedFileList=this.fileList.sort((function(t,e){return t>e?1:-1}));break;case"降序":this.sortedFileList=this.fileList.sort((function(t,e){return t<e?1:-1}));break}break;case"时间":switch(this.sortedBy.type){case"升序":this.sortedFileList=this.fileList.sort((function(t,e){return t.lstat.mtime>e.lstat.mtime?-1:1}));break;case"降序":this.sortedFileList=this.fileList.sort((function(t,e){return t.lstat.mtime<e.lstat.mtime?-1:1}));break}break;case"文件大小":switch(this.sortedBy.type){case"升序":this.sortedFileList=this.fileList.sort((function(t,e){return t.lstat.size>e.lstat.size?-1:1}));break;case"降序":this.sortedFileList=this.fileList.sort((function(t,e){return t.lstat.size<e.lstat.size?-1:1}));break}break}},selectFile:function(t){this.selectedFile!=t?this.selectedFile=t:this.selectedFile=null},calcFileSize:function(t){var e=t.lstat.size;return t.isDir?null:e<1025?e.toFixed(2)+"B":e<1026e3?(e/1024).toFixed(2)+"KB":e<1027e6?(e/1024/1024).toFixed(2)+"MB":e<1028e9?(e/1024/1024/1024).toFixed(2)+"GB":void 0},showFileContextMenu:function(t){l.a.resolve(this.currentUrl,t)},goBack:function(){this.currentUrl=l.a.resolve(this.currentUrl,".."),window.io.emit("apilistdir",this.id,this.currentUrl)},openDir:function(t){var e=l.a.resolve(this.currentUrl,t);window.io.emit("apilistdir",this.id,e)},download:function(t){var e=this,i=l.a.resolve(this.currentUrl,t);window.io.emit("apidownloadfile",e.id,i)},showFileContent:function(t){window.io.emit("apishowfilecontent",this.id,t)},showDetails:function(){}},components:{"context-menu":a["a"]}},m=v,w=(i("1580"),i("2877")),b=i("6544"),y=i.n(b),g=i("8336"),_=i("a609"),x=i("a523"),k=i("8654"),C=Object(w["a"])(m,n,s,!1,null,null,null);e["default"]=C.exports;y()(C,{VBtn:g["a"],VBtnToggle:_["a"],VContainer:x["a"],VTextField:k["a"]})},"9c2b":function(t,e,i){}}]);
//# sourceMappingURL=chunk-510a9601.fbdbb386.js.map