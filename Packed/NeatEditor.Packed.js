/*
 * JSMin
 * Javascript Compressor
 * http://www.crockford.com/
 * http://www.smallsharptools.com/Projects/Packer/
*/

// ../../../RangeHelper.js

if(typeof Narmand==="undefined"){Narmand={};}
$.extend(true,Narmand,{RangeHelper:{ToggleRangeSurroundingByTag:function(Range,TagName){if(this.DoesRangeContainTag(Range,TagName)){this.CleanRangeByTag(Range,TagName);return;}
var TagElement=document.createElement(TagName);this.SurroundRangeByElement(Range,TagElement);},SurroundRangeByElement:function(Range,Element){if(Range.canSurroundContents()){Range.surroundContents(Element);}},DoesRangeContainTag:function(Range,TagName){TagName=TagName.toLowerCase();var NodeIterator=Range.createNodeIterator();while(NodeIterator.hasNext()){var CurrentNode=NodeIterator.next();if(CurrentNode.nodeType===3&&CurrentNode.parentNode.tagName.toLowerCase()===TagName){return true;}
if(CurrentNode.nodeType===1&&CurrentNode.tagName.toLowerCase()===TagName){return true;}}
return false;},GetTagElementSurroundingRangeByTagName:function(Range,TagName){TagName=TagName.toLowerCase();var NodeIterator=Range.createNodeIterator();while(NodeIterator.hasNext()){var CurrentNode=NodeIterator.next();if(CurrentNode.nodeType===3&&CurrentNode.parentNode.tagName.toLowerCase()===TagName){return CurrentNode;}
if(CurrentNode.nodeType===1&&CurrentNode.tagName.toLowerCase()===TagName){return CurrentNode;}}
return null;},CleanRangeByTag:function(Range,TagName){TagName=TagName.toLowerCase();var NodeIterator=Range.createNodeIterator();while(NodeIterator.hasNext()){var CurrentNode=NodeIterator.next();if(CurrentNode.nodeType===3&&CurrentNode.parentNode.tagName.toLowerCase()===TagName){$(CurrentNode).unwrap();}
if(CurrentNode.nodeType===1&&CurrentNode.tagName.toLowerCase()===TagName){$(CurrentNode).contents().unwrap();}}
Range.commonAncestorContainer.normalize();}}});
// ../../../SanitizationHelper.js

if(typeof Narmand==="undefined"){Narmand={};}
$.extend(true,Narmand,{SanitizationHelper:{count:0,SanitizeElementContents:function(Element,WhiteList){WhiteList=this.NormalizeWhiteList(WhiteList);while(this.HasElementAnyBlackListedContent(Element,WhiteList)){var ElementNodes=this.GetElementNodesContentsOfElement(Element);this.count++;if(this.count>100){break;}
var CurrentElement=ElementNodes[0];while(CurrentElement!==undefined){var NextElement=$(CurrentElement).next()[0];this.SanitizeElementContent(CurrentElement,WhiteList);CurrentElement=NextElement;}}},NormalizeWhiteList:function(WhiteList){if(WhiteList===undefined){return"";}
if(WhiteList[0]!==" "){WhiteList=" "+WhiteList;}
if(WhiteList[WhiteList.length-1]!==" "){WhiteList=WhiteList+" ";}
return WhiteList.toLowerCase();},GetElementNodesContentsOfElement:function(Element){var ElementNodes=[];var Contents=$(Element).contents();for(var i=0;i<Contents.length;i++){switch(Contents[i].nodeType){case 1:ElementNodes.push(Contents[i]);break;case 8:this.ClearCommentNode(Contents[i]);break;}}
return ElementNodes;},ClearCommentNode:function(CommentNode){$(CommentNode).remove();},HasElementAnyBlackListedContent:function(Element,WhiteList){var ElementNodes=this.GetElementNodesContentsOfElement(Element);for(var i=0;i<ElementNodes.length;i++){ElementNodeTagName=ElementNodes[i].tagName;if(!this.IsTagNameWhiteListed(ElementNodeTagName,WhiteList)){return true;}
if(this.HasTagAnyBlackListedAttribute(ElementNodes[i],WhiteList)){return true;}}
return false;},HasTagAnyBlackListedAttribute:function(ElementContent,WhiteList){ElementContentTagName=ElementContent.tagName;var ElementAttributes=this.GetElementAttributes(ElementContent);for(var i=0;i<ElementAttributes.length;i++){if(!this.IsTagAttributeWhiteListed(ElementContentTagName,ElementAttributes[i],WhiteList)){return true;}}
return false;},SanitizeElementContent:function(ElementContent,WhiteList){ElementContentTagName=ElementContent.tagName;if(!this.IsTagNameWhiteListed(ElementContentTagName,WhiteList)){var TagContents=$(ElementContent).contents();if(TagContents.length>0){TagContents.fixedUnwrap();}
else{$(ElementContent).remove();}
return;}
this.SanitizeElementAttributes(ElementContent,WhiteList);try{$(ElementContent).text($(ElementContent).text());}
catch(e){}},IsTagNameWhiteListed:function(TagName,WhiteList){TagName=TagName.toLowerCase();if(WhiteList.indexOf(" "+TagName+" ")>-1){return true;}
return false;},SanitizeElementAttributes:function(ElementContent,WhiteList){ElementContentTagName=ElementContent.tagName;var ElementAttributes=this.GetElementAttributes(ElementContent);for(var i=0;i<ElementAttributes.length;i++){if(!this.IsTagAttributeWhiteListed(ElementContentTagName,ElementAttributes[i],WhiteList)){$(ElementContent).removeAttr(ElementAttributes[i]);}}},GetElementAttributes:function(ElementContent){var ElementAttributeNames=[];var ElementAttributes=ElementContent.attributes;for(var i=0;i<ElementAttributes.length;i++){ElementAttributeNames.push(ElementAttributes.item(i).nodeName);}
return ElementAttributeNames;},IsTagAttributeWhiteListed:function(TagName,TagAttribute,WhiteList){TagName=TagName.toLowerCase();TagAttribute=TagAttribute.toLowerCase();if(TagAttribute==="shape"){return true;}
if(WhiteList.indexOf(" "+TagName+"["+TagAttribute+"] ")>-1){return true;}
return false;}}});$.fn.fixedUnwrap=function(){this.parent(':not(body)').each(function(){$(this).replaceWith(this.childNodes);});return this;};
// ../../../jquery.form.js
;(function($){"use strict";var feature={};feature.fileapi=$("<input type='file'/>").get(0).files!==undefined;feature.formdata=window.FormData!==undefined;$.fn.ajaxSubmit=function(options){if(!this.length){log('ajaxSubmit: skipping submit process - no element selected');return this;}
var method,action,url,$form=this;if(typeof options=='function'){options={success:options};}
method=this.attr('method');action=this.attr('action');url=(typeof action==='string')?$.trim(action):'';url=url||window.location.href||'';if(url){url=(url.match(/^([^#]+)/)||[])[1];}
options=$.extend(true,{url:url,success:$.ajaxSettings.success,type:method||'GET',iframeSrc:/^https/i.test(window.location.href||'')?'javascript:false':'about:blank'},options);var veto={};this.trigger('form-pre-serialize',[this,options,veto]);if(veto.veto){log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');return this;}
if(options.beforeSerialize&&options.beforeSerialize(this,options)===false){log('ajaxSubmit: submit aborted via beforeSerialize callback');return this;}
var traditional=options.traditional;if(traditional===undefined){traditional=$.ajaxSettings.traditional;}
var elements=[];var qx,a=this.formToArray(options.semantic,elements);if(options.data){options.extraData=options.data;qx=$.param(options.data,traditional);}
if(options.beforeSubmit&&options.beforeSubmit(a,this,options)===false){log('ajaxSubmit: submit aborted via beforeSubmit callback');return this;}
this.trigger('form-submit-validate',[a,this,options,veto]);if(veto.veto){log('ajaxSubmit: submit vetoed via form-submit-validate trigger');return this;}
var q=$.param(a,traditional);if(qx){q=(q?(q+'&'+qx):qx);}
if(options.type.toUpperCase()=='GET'){options.url+=(options.url.indexOf('?')>=0?'&':'?')+q;options.data=null;}
else{options.data=q;}
var callbacks=[];if(options.resetForm){callbacks.push(function(){$form.resetForm();});}
if(options.clearForm){callbacks.push(function(){$form.clearForm(options.includeHidden);});}
if(!options.dataType&&options.target){var oldSuccess=options.success||function(){};callbacks.push(function(data){var fn=options.replaceTarget?'replaceWith':'html';$(options.target)[fn](data).each(oldSuccess,arguments);});}
else if(options.success){callbacks.push(options.success);}
options.success=function(data,status,xhr){var context=options.context||this;for(var i=0,max=callbacks.length;i<max;i++){callbacks[i].apply(context,[data,status,xhr||$form,$form]);}};var fileInputs=$('input[type=file]:enabled[value!=""]',this);var hasFileInputs=fileInputs.length>0;var mp='multipart/form-data';var multipart=($form.attr('enctype')==mp||$form.attr('encoding')==mp);var fileAPI=feature.fileapi&&feature.formdata;log("fileAPI :"+fileAPI);var shouldUseFrame=(hasFileInputs||multipart)&&!fileAPI;var jqxhr;if(options.iframe!==false&&(options.iframe||shouldUseFrame)){if(options.closeKeepAlive){$.get(options.closeKeepAlive,function(){jqxhr=fileUploadIframe(a);});}
else{jqxhr=fileUploadIframe(a);}}
else if((hasFileInputs||multipart)&&fileAPI){jqxhr=fileUploadXhr(a);}
else{jqxhr=$.ajax(options);}
$form.removeData('jqxhr').data('jqxhr',jqxhr);for(var k=0;k<elements.length;k++)
elements[k]=null;this.trigger('form-submit-notify',[this,options]);return this;function deepSerialize(extraData){var serialized=$.param(extraData).split('&');var len=serialized.length;var result={};var i,part;for(i=0;i<len;i++){serialized[i]=serialized[i].replace(/\+/g,' ');part=serialized[i].split('=');result[decodeURIComponent(part[0])]=decodeURIComponent(part[1]);}
return result;}
function fileUploadXhr(a){var formdata=new FormData();for(var i=0;i<a.length;i++){formdata.append(a[i].name,a[i].value);}
if(options.extraData){var serializedData=deepSerialize(options.extraData);for(var p in serializedData)
if(serializedData.hasOwnProperty(p))
formdata.append(p,serializedData[p]);}
options.data=null;var s=$.extend(true,{},$.ajaxSettings,options,{contentType:false,processData:false,cache:false,type:method||'POST'});if(options.uploadProgress){s.xhr=function(){var xhr=jQuery.ajaxSettings.xhr();if(xhr.upload){xhr.upload.onprogress=function(event){var percent=0;var position=event.loaded||event.position;var total=event.total;if(event.lengthComputable){percent=Math.ceil(position/total*100);}
options.uploadProgress(event,position,total,percent);};}
return xhr;};}
s.data=null;var beforeSend=s.beforeSend;s.beforeSend=function(xhr,o){o.data=formdata;if(beforeSend)
beforeSend.call(this,xhr,o);};return $.ajax(s);}
function fileUploadIframe(a){var form=$form[0],el,i,s,g,id,$io,io,xhr,sub,n,timedOut,timeoutHandle;var useProp=!!$.fn.prop;var deferred=$.Deferred();if($('[name=submit],[id=submit]',form).length){alert('Error: Form elements must not have name or id of "submit".');deferred.reject();return deferred;}
if(a){for(i=0;i<elements.length;i++){el=$(elements[i]);if(useProp)
el.prop('disabled',false);else
el.removeAttr('disabled');}}
s=$.extend(true,{},$.ajaxSettings,options);s.context=s.context||s;id='jqFormIO'+(new Date().getTime());if(s.iframeTarget){$io=$(s.iframeTarget);n=$io.attr('name');if(!n)
$io.attr('name',id);else
id=n;}
else{$io=$('<iframe name="'+id+'" src="'+s.iframeSrc+'" />');$io.css({position:'absolute',top:'-1000px',left:'-1000px'});}
io=$io[0];xhr={aborted:0,responseText:null,responseXML:null,status:0,statusText:'n/a',getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(status){var e=(status==='timeout'?'timeout':'aborted');log('aborting upload... '+e);this.aborted=1;try{if(io.contentWindow.document.execCommand){io.contentWindow.document.execCommand('Stop');}}
catch(ignore){}
$io.attr('src',s.iframeSrc);xhr.error=e;if(s.error)
s.error.call(s.context,xhr,e,status);if(g)
$.event.trigger("ajaxError",[xhr,s,e]);if(s.complete)
s.complete.call(s.context,xhr,e);}};g=s.global;if(g&&0===$.active++){$.event.trigger("ajaxStart");}
if(g){$.event.trigger("ajaxSend",[xhr,s]);}
if(s.beforeSend&&s.beforeSend.call(s.context,xhr,s)===false){if(s.global){$.active--;}
deferred.reject();return deferred;}
if(xhr.aborted){deferred.reject();return deferred;}
sub=form.clk;if(sub){n=sub.name;if(n&&!sub.disabled){s.extraData=s.extraData||{};s.extraData[n]=sub.value;if(sub.type=="image"){s.extraData[n+'.x']=form.clk_x;s.extraData[n+'.y']=form.clk_y;}}}
var CLIENT_TIMEOUT_ABORT=1;var SERVER_ABORT=2;function getDoc(frame){var doc=frame.contentWindow?frame.contentWindow.document:frame.contentDocument?frame.contentDocument:frame.document;return doc;}
var csrf_token=$('meta[name=csrf-token]').attr('content');var csrf_param=$('meta[name=csrf-param]').attr('content');if(csrf_param&&csrf_token){s.extraData=s.extraData||{};s.extraData[csrf_param]=csrf_token;}
function doSubmit(){var t=$form.attr('target'),a=$form.attr('action');form.setAttribute('target',id);if(!method){form.setAttribute('method','POST');}
if(a!=s.url){form.setAttribute('action',s.url);}
if(!s.skipEncodingOverride&&(!method||/post/i.test(method))){$form.attr({encoding:'multipart/form-data',enctype:'multipart/form-data'});}
if(s.timeout){timeoutHandle=setTimeout(function(){timedOut=true;cb(CLIENT_TIMEOUT_ABORT);},s.timeout);}
function checkState(){try{var state=getDoc(io).readyState;log('state = '+state);if(state&&state.toLowerCase()=='uninitialized')
setTimeout(checkState,50);}
catch(e){log('Server abort: ',e,' (',e.name,')');cb(SERVER_ABORT);if(timeoutHandle)
clearTimeout(timeoutHandle);timeoutHandle=undefined;}}
var extraInputs=[];try{if(s.extraData){for(var n in s.extraData){if(s.extraData.hasOwnProperty(n)){if($.isPlainObject(s.extraData[n])&&s.extraData[n].hasOwnProperty('name')&&s.extraData[n].hasOwnProperty('value')){extraInputs.push($('<input type="hidden" name="'+s.extraData[n].name+'">').attr('value',s.extraData[n].value).appendTo(form)[0]);}else{extraInputs.push($('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n]).appendTo(form)[0]);}}}}
if(!s.iframeTarget){$io.appendTo('body');if(io.attachEvent)
io.attachEvent('onload',cb);else
io.addEventListener('load',cb,false);}
setTimeout(checkState,15);form.submit();}
finally{form.setAttribute('action',a);if(t){form.setAttribute('target',t);}else{$form.removeAttr('target');}
$(extraInputs).remove();}}
if(s.forceSync){doSubmit();}
else{setTimeout(doSubmit,10);}
var data,doc,domCheckCount=50,callbackProcessed;function cb(e){if(xhr.aborted||callbackProcessed){return;}
try{doc=getDoc(io);}
catch(ex){log('cannot access response document: ',ex);e=SERVER_ABORT;}
if(e===CLIENT_TIMEOUT_ABORT&&xhr){xhr.abort('timeout');deferred.reject(xhr,'timeout');return;}
else if(e==SERVER_ABORT&&xhr){xhr.abort('server abort');deferred.reject(xhr,'error','server abort');return;}
if(!doc||doc.location.href==s.iframeSrc){if(!timedOut)
return;}
if(io.detachEvent)
io.detachEvent('onload',cb);else
io.removeEventListener('load',cb,false);var status='success',errMsg;try{if(timedOut){throw'timeout';}
var isXml=s.dataType=='xml'||doc.XMLDocument||$.isXMLDoc(doc);log('isXml='+isXml);if(!isXml&&window.opera&&(doc.body===null||!doc.body.innerHTML)){if(--domCheckCount){log('requeing onLoad callback, DOM not available');setTimeout(cb,250);return;}}
var docRoot=doc.body?doc.body:doc.documentElement;xhr.responseText=docRoot?docRoot.innerHTML:null;xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;if(isXml)
s.dataType='xml';xhr.getResponseHeader=function(header){var headers={'content-type':s.dataType};return headers[header];};if(docRoot){xhr.status=Number(docRoot.getAttribute('status'))||xhr.status;xhr.statusText=docRoot.getAttribute('statusText')||xhr.statusText;}
var dt=(s.dataType||'').toLowerCase();var scr=/(json|script|text)/.test(dt);if(scr||s.textarea){var ta=doc.getElementsByTagName('textarea')[0];if(ta){xhr.responseText=ta.value;xhr.status=Number(ta.getAttribute('status'))||xhr.status;xhr.statusText=ta.getAttribute('statusText')||xhr.statusText;}
else if(scr){var pre=doc.getElementsByTagName('pre')[0];var b=doc.getElementsByTagName('body')[0];if(pre){xhr.responseText=pre.textContent?pre.textContent:pre.innerText;}
else if(b){xhr.responseText=b.textContent?b.textContent:b.innerText;}}}
else if(dt=='xml'&&!xhr.responseXML&&xhr.responseText){xhr.responseXML=toXml(xhr.responseText);}
try{data=httpData(xhr,dt,s);}
catch(e){status='parsererror';xhr.error=errMsg=(e||status);}}
catch(e){log('error caught: ',e);status='error';xhr.error=errMsg=(e||status);}
if(xhr.aborted){log('upload aborted');status=null;}
if(xhr.status){status=(xhr.status>=200&&xhr.status<300||xhr.status===304)?'success':'error';}
if(status==='success'){if(s.success)
s.success.call(s.context,data,'success',xhr);deferred.resolve(xhr.responseText,'success',xhr);if(g)
$.event.trigger("ajaxSuccess",[xhr,s]);}
else if(status){if(errMsg===undefined)
errMsg=xhr.statusText;if(s.error)
s.error.call(s.context,xhr,status,errMsg);deferred.reject(xhr,'error',errMsg);if(g)
$.event.trigger("ajaxError",[xhr,s,errMsg]);}
if(g)
$.event.trigger("ajaxComplete",[xhr,s]);if(g&&!--$.active){$.event.trigger("ajaxStop");}
if(s.complete)
s.complete.call(s.context,xhr,status);callbackProcessed=true;if(s.timeout)
clearTimeout(timeoutHandle);setTimeout(function(){if(!s.iframeTarget)
$io.remove();xhr.responseXML=null;},100);}
var toXml=$.parseXML||function(s,doc){if(window.ActiveXObject){doc=new ActiveXObject('Microsoft.XMLDOM');doc.async='false';doc.loadXML(s);}
else{doc=(new DOMParser()).parseFromString(s,'text/xml');}
return(doc&&doc.documentElement&&doc.documentElement.nodeName!='parsererror')?doc:null;};var parseJSON=$.parseJSON||function(s){return window['eval']('('+s+')');};var httpData=function(xhr,type,s){var ct=xhr.getResponseHeader('content-type')||'',xml=type==='xml'||!type&&ct.indexOf('xml')>=0,data=xml?xhr.responseXML:xhr.responseText;if(xml&&data.documentElement.nodeName==='parsererror'){if($.error)
$.error('parsererror');}
if(s&&s.dataFilter){data=s.dataFilter(data,type);}
if(typeof data==='string'){if(type==='json'||!type&&ct.indexOf('json')>=0){data=parseJSON(data);}else if(type==="script"||!type&&ct.indexOf("javascript")>=0){$.globalEval(data);}}
return data;};return deferred;}};$.fn.ajaxForm=function(options){options=options||{};options.delegation=options.delegation&&$.isFunction($.fn.on);if(!options.delegation&&this.length===0){var o={s:this.selector,c:this.context};if(!$.isReady&&o.s){log('DOM not ready, queuing ajaxForm');$(function(){$(o.s,o.c).ajaxForm(options);});return this;}
log('terminating; zero elements found by selector'+($.isReady?'':' (DOM not ready)'));return this;}
if(options.delegation){$(document).off('submit.form-plugin',this.selector,doAjaxSubmit).off('click.form-plugin',this.selector,captureSubmittingElement).on('submit.form-plugin',this.selector,options,doAjaxSubmit).on('click.form-plugin',this.selector,options,captureSubmittingElement);return this;}
return this.ajaxFormUnbind().bind('submit.form-plugin',options,doAjaxSubmit).bind('click.form-plugin',options,captureSubmittingElement);};function doAjaxSubmit(e){var options=e.data;if(!e.isDefaultPrevented()){e.preventDefault();$(this).ajaxSubmit(options);}}
function captureSubmittingElement(e){var target=e.target;var $el=$(target);if(!($el.is("[type=submit],[type=image]"))){var t=$el.closest('[type=submit]');if(t.length===0){return;}
target=t[0];}
var form=this;form.clk=target;if(target.type=='image'){if(e.offsetX!==undefined){form.clk_x=e.offsetX;form.clk_y=e.offsetY;}else if(typeof $.fn.offset=='function'){var offset=$el.offset();form.clk_x=e.pageX-offset.left;form.clk_y=e.pageY-offset.top;}else{form.clk_x=e.pageX-target.offsetLeft;form.clk_y=e.pageY-target.offsetTop;}}
setTimeout(function(){form.clk=form.clk_x=form.clk_y=null;},100);}
$.fn.ajaxFormUnbind=function(){return this.unbind('submit.form-plugin click.form-plugin');};$.fn.formToArray=function(semantic,elements){var a=[];if(this.length===0){return a;}
var form=this[0];var els=semantic?form.getElementsByTagName('*'):form.elements;if(!els){return a;}
var i,j,n,v,el,max,jmax;for(i=0,max=els.length;i<max;i++){el=els[i];n=el.name;if(!n){continue;}
if(semantic&&form.clk&&el.type=="image"){if(!el.disabled&&form.clk==el){a.push({name:n,value:$(el).val(),type:el.type});a.push({name:n+'.x',value:form.clk_x},{name:n+'.y',value:form.clk_y});}
continue;}
v=$.fieldValue(el,true);if(v&&v.constructor==Array){if(elements)
elements.push(el);for(j=0,jmax=v.length;j<jmax;j++){a.push({name:n,value:v[j]});}}
else if(feature.fileapi&&el.type=='file'&&!el.disabled){if(elements)
elements.push(el);var files=el.files;if(files.length){for(j=0;j<files.length;j++){a.push({name:n,value:files[j],type:el.type});}}
else{a.push({name:n,value:'',type:el.type});}}
else if(v!==null&&typeof v!='undefined'){if(elements)
elements.push(el);a.push({name:n,value:v,type:el.type,required:el.required});}}
if(!semantic&&form.clk){var $input=$(form.clk),input=$input[0];n=input.name;if(n&&!input.disabled&&input.type=='image'){a.push({name:n,value:$input.val()});a.push({name:n+'.x',value:form.clk_x},{name:n+'.y',value:form.clk_y});}}
return a;};$.fn.formSerialize=function(semantic){return $.param(this.formToArray(semantic));};$.fn.fieldSerialize=function(successful){var a=[];this.each(function(){var n=this.name;if(!n){return;}
var v=$.fieldValue(this,successful);if(v&&v.constructor==Array){for(var i=0,max=v.length;i<max;i++){a.push({name:n,value:v[i]});}}
else if(v!==null&&typeof v!='undefined'){a.push({name:this.name,value:v});}});return $.param(a);};$.fn.fieldValue=function(successful){for(var val=[],i=0,max=this.length;i<max;i++){var el=this[i];var v=$.fieldValue(el,successful);if(v===null||typeof v=='undefined'||(v.constructor==Array&&!v.length)){continue;}
if(v.constructor==Array)
$.merge(val,v);else
val.push(v);}
return val;};$.fieldValue=function(el,successful){var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(successful===undefined){successful=true;}
if(successful&&(!n||el.disabled||t=='reset'||t=='button'||(t=='checkbox'||t=='radio')&&!el.checked||(t=='submit'||t=='image')&&el.form&&el.form.clk!=el||tag=='select'&&el.selectedIndex==-1)){return null;}
if(tag=='select'){var index=el.selectedIndex;if(index<0){return null;}
var a=[],ops=el.options;var one=(t=='select-one');var max=(one?index+1:ops.length);for(var i=(one?index:0);i<max;i++){var op=ops[i];if(op.selected){var v=op.value;if(!v){v=(op.attributes&&op.attributes['value']&&!(op.attributes['value'].specified))?op.text:op.value;}
if(one){return v;}
a.push(v);}}
return a;}
return $(el).val();};$.fn.clearForm=function(includeHidden){return this.each(function(){$('input,select,textarea',this).clearFields(includeHidden);});};$.fn.clearFields=$.fn.clearInputs=function(includeHidden){var re=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var t=this.type,tag=this.tagName.toLowerCase();if(re.test(t)||tag=='textarea'){this.value='';}
else if(t=='checkbox'||t=='radio'){this.checked=false;}
else if(tag=='select'){this.selectedIndex=-1;}
else if(t=="file"){if($.browser.msie){$(this).replaceWith($(this).clone());}else{$(this).val('');}}
else if(includeHidden){if((includeHidden===true&&/hidden/.test(t))||(typeof includeHidden=='string'&&$(this).is(includeHidden)))
this.value='';}});};$.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=='function'||(typeof this.reset=='object'&&!this.reset.nodeType)){this.reset();}});};$.fn.enable=function(b){if(b===undefined){b=true;}
return this.each(function(){this.disabled=!b;});};$.fn.selected=function(select){if(select===undefined){select=true;}
return this.each(function(){var t=this.type;if(t=='checkbox'||t=='radio'){this.checked=select;}
else if(this.tagName.toLowerCase()=='option'){var $sel=$(this).parent('select');if(select&&$sel[0]&&$sel[0].type=='select-one'){$sel.find('option').selected(false);}
this.selected=select;}});};$.fn.ajaxSubmit.debug=false;function log(){if(!$.fn.ajaxSubmit.debug)
return;var msg='[jquery.form] '+Array.prototype.join.call(arguments,'');if(window.console&&window.console.log){window.console.log(msg);}
else if(window.opera&&window.opera.postError){window.opera.postError(msg);}}})(jQuery);
// ../../../NeatEditor.js

if(typeof Narmand==="undefined"){Narmand={};}
$.extend(true,Narmand,{NeatEditor:{_LastEditorID:0,Init:function(Options){$.extend(true,this.Options,Options);this.ConstructEditorElemets();},Options:{Container:null,Direction:"ltr",AutoSyncTextareaWithEditor:true},ConstructEditorElemets:function(){this._LastEditorID++;var EditorWrapper=null;if(this.HasTextareaAssociatedEditorWrapper()){EditorWrapper=this.GetAssociatedEditorWrapperOfTextarea();EditorWrapper.empty();}
else{this.Options.Container.data("NarmandNeatEditorID",this._LastEditorID);EditorWrapper=$("<div>").addClass("NarmandNeatEditor").attr("id","NarmandNeatEditor_"+this._LastEditorID).data("Options",this.Options);}
if(this.Options.Direction==="rtl"){EditorWrapper.addClass("NarmandNeatEditorRightToLeft");}
else{EditorWrapper.removeClass("NarmandNeatEditorRightToLeft");}
var Sections=$("<div>").addClass("Sections").appendTo(EditorWrapper);var SectionAdders=$("<div>").addClass("SectionAdders").appendTo(EditorWrapper);$("<div>").addClass("Tag").text("+").appendTo(SectionAdders);Sections.append(SectionAdders);for(var ProviderName in this.SectionProviders){var Provider=Narmand.NeatEditor.SectionProviders[ProviderName];var AdderButtonBase=this.CreateAdderButtonBase(ProviderName);SectionAdders.append(Provider.CreateAdderButton(AdderButtonBase));}
SectionAdders.find(".SectionAdder").click(function(){Narmand.NeatEditor.TrySyncingTextareaWithEditor($(this));});this.ParseHtmlToEditor(this.Options.Container.val(),EditorWrapper);this.Options.Container.after(EditorWrapper);this.SectionProvidersHelper.MakeSectionsSortable();},HasTextareaAssociatedEditorWrapper:function(){if(this.Options.Container.data("NarmandNeatEditorID")!==undefined){return true;}
return false;},GetAssociatedEditorWrapperOfTextarea:function(){var TextareaNeatEditorID=this.Options.Container.data("NarmandNeatEditorID");if(TextareaNeatEditorID!==undefined){return $("#NarmandNeatEditor_"+TextareaNeatEditorID);}
else{throw"There is no editor associated with this textarea";}},CreateAdderButtonBase:function(SectionProviderName){var AdderButtonBase=$("<a>").addClass("SectionAdder").addClass(SectionProviderName).text("+ "+SectionProviderName);return AdderButtonBase;},RelocateSectionAdderBelowSection:function(SectionElement){if(!SectionElement.next().is(".SectionAdders")){var EditorWrapper=SectionElement.closest(".NarmandNeatEditor")
var SectionAdders=EditorWrapper.find(".SectionAdders");EditorHeight=EditorWrapper.height();EditorWrapper.height(EditorWrapper.height());SectionAdders.children().hide();SectionAdders.slideUp("fast",function(){SectionElement.after(SectionAdders);SectionAdders.slideDown("fast",function(){SectionAdders.children().fadeIn("fast");EditorWrapper.css("height","auto");});});}},ParseHtmlToEditor:function(HtmlCode,EditorWrapper){var RootElementsWrapper=$("<div>").html(HtmlCode);while(RootElementsWrapper.children()[0]!=undefined){var NextRootElement=RootElementsWrapper.children()[0];var TagName=NextRootElement.nodeName;var SectionProvider=Narmand.NeatEditor.GetSectionProviderByTagName(TagName);if(typeof SectionProvider.ExtractAnyDefinedTagsFromSection!=="undefined"){SectionProvider.ExtractAnyDefinedTagsFromSection($(NextRootElement));}
SectionProvider.AddSectionToEditor($(NextRootElement),EditorWrapper);$(NextRootElement).remove();}
this.TrySyncingTextareaWithEditor(EditorWrapper.children(":first"));},TrySyncingTextareaWithEditor:function(EditorInsideElement){var NarmandEditor=EditorInsideElement.closest(".NarmandNeatEditor");var Options=NarmandEditor.data("Options");if(Options.AutoSyncTextareaWithEditor){this.SyncTextareaWithEditor(NarmandEditor);}},SyncTextareaWithEditor:function(EditorWrapper){var HtmlCode="";$(EditorWrapper).find(".Sections .Section").each(function(){var SectionProviderName=$(this).data("SectionProviderName");HtmlCode+=Narmand.NeatEditor.SectionProviders[SectionProviderName].ExportSectionHtml($(this))+"\r\n";});HtmlCode=HtmlCode.replace(/<\/?[A-Z]+.*?>/g,function(m){return m.toLowerCase();});EditorWrapper.data("Options").Container.val(HtmlCode);},SectionProviders:{},SectionProvidersHelper:{CreateSectionElement:function(SectionProviderName){var SectionToolsWrapper=$("<div>").addClass("ToolsWrapper");$("<div>").addClass("CloseButton").text("x").click(function(){var SectionsWrapper=$(this).closest(".Sections");$(this).closest(".Section").remove();Narmand.NeatEditor.TrySyncingTextareaWithEditor(SectionsWrapper);return false;}).appendTo(SectionToolsWrapper);var Content=$("<div>").addClass("Content");var SectionTag=$("<div>").addClass("Tag").text(SectionProviderName);return $("<div>").addClass("Section").data("SectionProviderName",SectionProviderName).append(SectionToolsWrapper).append(Content).append(SectionTag).focusin(function(Event){if($(Event.target).is("a.Tool")){return false;}
Narmand.NeatEditor.RelocateSectionAdderBelowSection($(this));Narmand.NeatEditor.Toolbar.CreateToolbarForSection($(this));}).keyup(function(){Narmand.NeatEditor.TrySyncingTextareaWithEditor($(this));});},MakeSectionsSortable:function(){$(".Sections").sortable({handle:'.Tag',forceHelperSize:true,forcePlaceholderSize:true,containment:$(".Sections").parent(),over:function(){Narmand.NeatEditor.Toolbar.Hide();},stop:function(event,ui){Narmand.NeatEditor.TrySyncingTextareaWithEditor(ui.item);},axis:'y'});}},Extend:function(Section){$.extend(true,Narmand.NeatEditor.SectionProviders,Section);},GetSectionProviderByTagName:function(TagName){TagName=TagName.toLowerCase();for(var ProviderName in this.SectionProviders){var Provider=this.SectionProviders[ProviderName];if(Provider.TagName===TagName){return Provider;}}
return Narmand.NeatEditor.SectionProviders.HtmlCode},Toolbar:{CreateToolbarForSection:function(SectionElement){var EditorWrapper=SectionElement.closest(".NarmandNeatEditor");var EditorToolbar=this.CunstructToolbarElementIfNotExists(EditorWrapper);var SectionProviderName=SectionElement.data("SectionProviderName");var Provider=Narmand.NeatEditor.SectionProviders[SectionProviderName];this.AppendProviderToolsToEditorToolbar(Provider,EditorToolbar);this.PositionToolbarAccordingToSection(EditorToolbar,SectionElement);},CunstructToolbarElementIfNotExists:function(EditorWrapper){var EditorToolbar=EditorWrapper.find(".Toolbar:first");if(EditorToolbar.length===0){EditorToolbar=$("<div>").addClass("Toolbar").appendTo(EditorWrapper);}
return EditorToolbar.empty();},AppendProviderToolsToEditorToolbar:function(Provider,EditorToolbar){if(Provider.Tools===undefined){return;}
for(var ProviderToolName in Provider.Tools){$("<a>").addClass("Tool").addClass(ProviderToolName).data("ToolName",ProviderToolName).data("SectionProvider",Provider).attr("title",Provider.Tools[ProviderToolName].Title).attr("href","").click(function(Event){try{Narmand.NeatEditor.Toolbar.ToolSelected($(this));}
catch(e){console.info(e);}
return false;}).appendTo(EditorToolbar);}},PositionToolbarAccordingToSection:function(ToolbarElement,SectionElement){if(ToolbarElement.children().length===0){ToolbarElement.hide();return;}
SectionElement.append(ToolbarElement);ToolbarElement.show();},Hide:function(){$(".NarmandNeatEditor .Toolbar").hide();},ToolSelected:function(ToolElement){var ToolsWrapperElement=ToolElement.parent();var ToolName=ToolElement.data("ToolName");var SectionProvider=ToolElement.data("SectionProvider");SectionProvider.Tools[ToolName].Act();Narmand.NeatEditor.TrySyncingTextareaWithEditor(ToolsWrapperElement);}}}});Narmand.NeatEditor.Extend({HtmlCode:{CreateAdderButton:function(AdderButtonBase){AdderButtonBase.click(function(){var EditorWrapper=$(this).closest(".NarmandNeatEditor");Narmand.NeatEditor.SectionProviders.HtmlCode.AddSectionToEditor($("<code>replace with your html code</code>"),EditorWrapper);return false;}).text("+ HTML Code");return AdderButtonBase;},AddSectionToEditor:function(Content,EditorWrapper){var SectionsWrapper=EditorWrapper.find(".Sections");var HtmlCode=$("<div>").append(Content).html();if(this._IsLastSectionHtmlCode(SectionsWrapper)){var LastHtmlCodeTextarea=SectionsWrapper.find(".Section:last textarea");LastHtmlCodeTextarea.val(LastHtmlCodeTextarea.val()+"\r\n"+HtmlCode);return;}
var HtmlCodeSection=Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("HtmlCode");HtmlCodeSection.addClass("HtmlCode");var EditableSection=$("<textarea>").val(HtmlCode).css("width","100%").appendTo(HtmlCodeSection.find(".Content"));EditorWrapper.find(".SectionAdders").before(HtmlCodeSection);},_IsLastSectionHtmlCode:function(SectionsWrapper){var SectionBeforeSectionAddersElement=SectionsWrapper.find(".SectionAdders").prev();if(SectionBeforeSectionAddersElement.length===0){return false;}
var SectionProviderName=SectionBeforeSectionAddersElement.data("SectionProviderName");if(SectionProviderName==="HtmlCode"){return true;}
return false;},TagName:null,ExportSectionHtml:function(SectionElement){var EncodedHtml=SectionElement.find(".Content > textarea").val();return this._HtmlDecode(EncodedHtml);},_HtmlDecode:function(HtmlToDecode){return HtmlToDecode.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');},_HtmlEncode:function(HtmlToEncode){return HtmlToEncode.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}}});$.fn.extend({NeatEditor:function(Options){if(Options===undefined){var Options={};}
return this.each(function(){Options.Container=$(this);Narmand.NeatEditor.Init(Options);});}});
// ../../../NeatEditor.SectionProviders.Pragraph.js

Narmand.NeatEditor.Extend({Paragraph:{CreateAdderButton:function(AdderButtonBase){AdderButtonBase.click(function(){var EditorWrapper=$(this).closest(".NarmandNeatEditor");Narmand.NeatEditor.SectionProviders.Paragraph.AddSectionToEditor($("<p>Replace this with you text</p>"),EditorWrapper);return false;}).text("+ Paragraph");return AdderButtonBase;},ExtractAnyDefinedTagsFromSection:function(RootElement){RootElement.find("img").insertBefore(RootElement);},AddSectionToEditor:function(Section,EditorWrapper){this.Sanitization.Sanitize(Section);var SectionsWrapper=EditorWrapper.find(".Sections");var ParagraphSection=Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Paragraph");ParagraphSection.addClass("Paragraph");var EditableSection=$("<div>").html(Section.html()).attr("contentEditable",true).bind("paste",function(){Narmand.NeatEditor.SectionProviders.Paragraph.Sanitization.SanitizeWithDelay($(this));}).bind("keypress",function(Event){if(Event.keyCode===13){var sel=rangy.getSelection();if(sel.rangeCount>0){var range=sel.getRangeAt(0);range.deleteContents();var frag=range.createContextualFragment("<br/>");var lastChild=frag.lastChild;range.insertNode(frag);range.collapseAfter(lastChild);sel.setSingleRange(range);}
Narmand.NeatEditor.TrySyncingTextareaWithEditor($(this));return false;}}).appendTo(ParagraphSection.find(".Content"));if(Section.attr("dir")!==undefined){EditableSection.attr("dir",Section.attr("dir"));}
EditorWrapper.find(".SectionAdders").before(ParagraphSection);},TagName:"p",Tools:{MakeStrong:{Title:"Make selection strong",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];if(!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)){return;}
Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range,"strong");Selection.removeAllRanges();}},Emphasize:{Title:"Emphasize on selection",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];if(!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)){return;}
Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range,"em");Selection.removeAllRanges();}},Strikethrough:{Title:"Strike selection out",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];if(!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)){return;}
Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range,"del");Selection.removeAllRanges();}},CreateLink:{Title:"Create or modify link",PromptMessage:"Please link target URL",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];if(!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)){return;}
if(Narmand.RangeHelper.DoesRangeContainTag(Range,"a")){this.ModifyExistingLink(Range);return;}
var AnchorHref=prompt(this.PromptMessage,"http://");if(AnchorHref===null||AnchorHref===""){return;}
var AnchorElement=$("<a>").attr("href",AnchorHref)[0];Narmand.RangeHelper.SurroundRangeByElement(Range,AnchorElement);Selection.removeAllRanges();},ModifyExistingLink:function(Range){SurroundingAnchor=Narmand.RangeHelper.GetTagElementSurroundingRangeByTagName(Range,"a");AnchorHref=$(SurroundingAnchor).attr("href");var AnchorHref=prompt(this.PromptMessage,AnchorHref);if(AnchorHref===null){return;}
AnchorHref=AnchorHref.trim();if(AnchorHref!==""){$(SurroundingAnchor).attr("href",AnchorHref);}
else{Narmand.RangeHelper.CleanRangeByTag(Range,"a");}}},ClearFormatting:{Title:"Clear selection formatting",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];if(!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)){return;}
Narmand.NeatEditor.SectionProviders.Paragraph._ClearFormattingInRange(Range);Selection.removeAllRanges();}},ChanegeDirectionToLeftToRight:{Title:"Change paragraph direction left to right",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];var ParentElement=$(Range.commonAncestorContainer);var ParagraphSelector=".NarmandNeatEditor .Section .Content > div";if(ParentElement.is(ParagraphSelector)){ParentElement.css("direction","ltr");}
else{ParentElement.closest(ParagraphSelector).attr("dir","ltr");}}},ChanegeDirectionToRightToLeft:{Title:"Change paragraph direction right to left",Act:function(){var Selection=rangy.getSelection();var Range=Selection.getAllRanges()[0];var ParentElement=$(Range.commonAncestorContainer);var ParagraphSelector=".NarmandNeatEditor .Section .Content > div";if(ParentElement.is(ParagraphSelector)){ParentElement.css("direction","rtl");}
else{ParentElement.closest(ParagraphSelector).attr("dir","rtl");}}}},Sanitization:{WhiteList:"strong em del a a[href] a[target] br",Sanitize:function(Element){Narmand.SanitizationHelper.SanitizeElementContents(Element,this.WhiteList);},SanitizeWithDelay:function(Element){setTimeout(function(){var WhiteList=Narmand.NeatEditor.SectionProviders.Paragraph.Sanitization.WhiteList;Narmand.SanitizationHelper.SanitizeElementContents(Element,WhiteList);Narmand.NeatEditor.TrySyncingTextareaWithEditor(Element);},100);}},_CanToolActOnRange:function(Range){var ParentElement=$(Range.commonAncestorContainer);var ParagraphSelector=".NarmandNeatEditor .Section .Content > div";if(ParentElement.is(ParagraphSelector)){return true;}
if(ParentElement.closest(ParagraphSelector).length>0){return true;}
return false;},_ClearFormattingInRange:function(Range){var NodeIterator=Range.createNodeIterator();while(NodeIterator.hasNext()){var CurrentNode=NodeIterator.next();if(CurrentNode.nodeType===3&&CurrentNode.parentNode.tagName.toLowerCase()!=="div"){$(CurrentNode).unwrap();}}
Range.commonAncestorContainer.normalize();},ExportSectionHtml:function(SectionElement){var ParagraphTag=SectionElement.find(".Content > div");var DirectionAttribute=(ParagraphTag.attr("dir")!==undefined)?" dir='"+ParagraphTag.attr("dir")+"'":"";ParagraphTagHtml="<p"+DirectionAttribute+">"+
ParagraphTag.html().replace(/<br>/gi,"<br/>")+"</p>";return ParagraphTagHtml;}}});
// ../../../NeatEditor.SectionProviders.Heading.js

Narmand.NeatEditor.Extend({Heading:{CreateAdderButton:function(AdderButtonBase){AdderButtonBase.click(function(){var EditorWrapper=$(this).closest(".NarmandNeatEditor");Narmand.NeatEditor.SectionProviders.Heading.AddSectionToEditor($("<span>Replace with your heading</span>"),EditorWrapper);return false;}).text("+ Heading");return AdderButtonBase;},AddSectionToEditor:function(Content,EditorWrapper){var SectionsWrapper=EditorWrapper.find(".Sections");var HeadingText=$("<div>").append(Content).text();var HeadingSection=Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Heading");HeadingSection.addClass("Heading");var EditableSection=$("<input type='text'>").val(HeadingText).keydown(function(Event){if(Event.which===13){return false;}}).css("width","100%").appendTo(HeadingSection.find(".Content"));EditorWrapper.find(".SectionAdders").before(HeadingSection);},TagName:"h2",ExportSectionHtml:function(SectionElement){var EncodedHeadingValue=this._HtmlEncode(SectionElement.find(".Content > input").val());return"<h2>"+EncodedHeadingValue+"</h2>";},_HtmlEncode:function(HtmlToEncode){return HtmlToEncode.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}}});
// ../../../NeatEditor.SectionProviders.Image.js

Narmand.NeatEditor.Extend({Image:{CreateAdderButton:function(AdderButtonBase){AdderButtonBase.click(function(){var EditorWrapper=$(this).closest(".NarmandNeatEditor");Narmand.NeatEditor.SectionProviders.Image.AddSectionToEditor($("<img src='' alt=''/>"),EditorWrapper);return false;}).text("+ Image");return AdderButtonBase;},AddSectionToEditor:function(Content,EditorWrapper){var SectionsWrapper=EditorWrapper.find(".Sections");var ImageElement=$("<div>").append(Content);var ImageUrl=ImageElement.find("img").attr("src");var ImageAlternativeText=ImageElement.find("img").attr("alt");var ImageSection=Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Image");ImageSection.addClass("Image");var ConfigSection=$("<div>").html(this._SectionTemplate);this.InitConfigSectionBindings(ConfigSection);ConfigSection.find("input.Url").val(ImageUrl);ConfigSection.find("input.Description").val(ImageAlternativeText);ConfigSection.appendTo(ImageSection.find(".Content"));EditorWrapper.find(".SectionAdders").before(ImageSection);},InitConfigSectionBindings:function(ConfigSectionElement){ConfigSectionElement.find("input").keydown(function(Event){if(Event.which===13){return false;}});ConfigSectionElement.find("form input[name=NeatEditorImageFile]").change(function(){if($(this).val()===""){return;}
var Form=$(this).closest("form");Form.ajaxSubmit({type:"POST",dataType:"text",url:"Uploaders/Default.aspx",success:function(result,statusText,xhr,$form){Form.closest(".Content").find("img.Preview").attr("src",result).end().find("input[name=Url]").val(result).end().find("input[name=NeatEditorImageFile]").val("");Narmand.NeatEditor.TrySyncingTextareaWithEditor(Form);},error:function(xhr,ajaxOptions,thrownError){},complete:function(){}});});},TagName:"img",ExportSectionHtml:function(SectionElement){var ImageUrl=SectionElement.find("input.Url").val();ImageUrl=this._HtmlEncode(ImageUrl);var AlternativeText=SectionElement.find("input.Description").val();AlternativeText=(AlternativeText==="")?'':' alt="'+AlternativeText+'" ';AlternativeText=jQuery.trim(this._HtmlEncode(AlternativeText));return'<img src="'+ImageUrl+'" '+AlternativeText+'/>';},_SectionTemplate:"<img class='Preview' src='' alt='' width='40' height='40' />"+"<label>Url:</label><input type='text' name='Url' class='Url'/>"+" — OR — "+"<form class='ImageUplaodForm' action='#' method='post' enctype='multipart/form-data'>"+"<input type='file' name='NeatEditorImageFile' class='FileInput' />"+"<input class='FakeFileInput' type='submit' value='Upload' />"+"</form>"+"<br/>"+"<label>Description:</label><input type='text' class='Description' />",_HtmlEncode:function(HtmlToEncode){return HtmlToEncode.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}}});
