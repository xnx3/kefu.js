//var goodsUrl = 'https://yunkefu.obs.cn-north-4.myhuaweicloud.com/html/json/';
var goodsUrl = 'https://yunkefu.obs.cn-north-4.myhuaweicloud.com/html/json/';

/* 生成一个随机UUID */
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/**
 * 获取网址的get参数。
 * @param name get参数名
 * @returns value
 */
function getUrlParams(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}



//时间戳转时间的数据转化
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 如 1587653254
 * format：返回格式，如 'Y-M-D h:m:s'
*/
function formatTime(number,format) {
	var formateArr  = ['Y','M','D','h','m','s'];
	var returnArr   = [];
	if((number + '').length == 10){
		number = number * 1000;
  	}
	var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr){
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * ajax请求 不依赖任何框架及其他文件
 * 作者：管雷鸣
 * 个人网站：www.guanleiming.com
 * 个人微信: xnx3com
 * 公司：潍坊雷鸣云网络科技有限公司
 * 公司官网：www.leimingyun.com
 */
var request = {
	/**
	 * get请求
	 * @param url 请求的接口URL，传入如 http://www.xxx.com/a.php
	 * @param data 请求的参数数据，传入如 {"goodsid":"1", "author":"管雷鸣"}
	 * @param func 请求完成的回调，传入如 function(data){ console.log(data); }
	 */
	get:function(url, data, func){
		var headers = {
			'content-type':'application/x-www-form-urlencoded'
		};
		this.send(url, data, func, 'get', true, headers, null);
	},
	/**
	 * post请求
	 * @param url 请求的接口URL，传入如 http://www.xxx.com/a.php
	 * @param data 请求的参数数据，传入如 {"goodsid":"1", "author":"管雷鸣"}
	 * @param func 请求完成的回调，传入如 function(data){ console.log(data); }
	 */
	post:function(url, data, func){
		var headers = {
			'content-type':'application/x-www-form-urlencoded'
		};
		this.send(url, data, func, 'POST', true, headers, null);
	},
	/**
	 * 发送请求
	 * url 请求的url
	 * data 请求的数据，如 {"author":"管雷鸣",'site':'www.guanleiming.com'} 
	 * func 请求完成的回调，传入如 function(data){}
	 * method 请求方式，可传入 post、get
	 * isAsynchronize 是否是异步请求， 传入 true 是异步请求，传入false 是同步请求
	 * headers 设置请求的header，传入如 {'content-type':'application/x-www-form-urlencoded'};
	 * abnormalFunc 响应异常所执行的方法，响应码不是200就会执行这个方法 ,传入如 function(xhr){}
	 */
	send:function(url, data, func, method, isAsynchronize, headers, abnormalFunc){
		//post提交的参数
		var params = '';
		if(data != null){
			for(var index in data){
				if(params.length > 0){
					params = params + '&';
				}
				params = params + index + '=' + data[index];
			}
		}
		
		var xhr=null;
		try{
			xhr=new XMLHttpRequest();
		}catch(e){
			xhr=new ActiveXObject("Microsoft.XMLHTTP");
		}
		//2.调用open方法（true----异步）
		xhr.open(method,url,isAsynchronize);
		//设置headers
		if(headers != null){
			for(var index in headers){
				xhr.setRequestHeader(index,headers[index]);
			}
		}
		xhr.send(params);
		//4.请求状态改变事件
		xhr.onreadystatechange=function(){
		    if(xhr.readyState==4){
		        if(xhr.status==200){
		        	//请求正常，响应码 200
		        	var json = null;
		        	try{
		        		json = JSON.parse(xhr.responseText);
		        	}catch(e){
		        		console.log(e);
		        	}
		        	if(json == null){
		        		func(xhr.responseText);
		        	}else{
		        		func(json);
		        	}
		        }else{
		        	if(abnormalFunc != null){
		        		abnormalFunc(xhr);
		        	}
		        }
		    }
		}
	},

	/**
	 * 文件上传
	 * url 请求的url
	 * data 请求的数据，如 {"author":"管雷鸣",'site':'www.guanleiming.com'} 
	 * file 要上传的文件。可以通过input的 e.srcElement.files[0] 获取
	 * successFunc 请求成功的回调，响应码是200就会执行这个。传入如 function(data){}
	 * headers 设置请求的header，传入如 {'content-type':'application/x-www-form-urlencoded'};
	 * abnormalFunc 响应异常所执行的方法，响应码不是200就会执行这个方法 ,传入如 function(xhr){}
	 */
	upload:function(url,data, file, successFunc, headers, abnormalFunc){
		//post提交的参数
		var fd = new FormData();
		fd.append('file', file);
		if(data != null){
			for(var index in data){
				fd.append(index, data[index]);
			}
		}
		
		var xhr=null;
		try{
			xhr=new XMLHttpRequest();
		}catch(e){
			xhr=new ActiveXObject("Microsoft.XMLHTTP");
		}
		//2.调用open方法（true----异步）
		xhr.open('POST',url,true);
		//设置headers
		if(headers != null){
			for(var index in headers){
				xhr.setRequestHeader(index,headers[index]);
			}
		}
		xhr.send(fd);
		//4.请求状态改变事件
		xhr.onreadystatechange=function(){
		    if(xhr.readyState==4){
		        if(xhr.status==200){
		        	//请求正常，响应码 200
		        	var json = null;
		        	try{
		        		json = JSON.parse(xhr.responseText);
		        	}catch(e){
		        		console.log(e);
		        	}
		        	if(json == null){
		        		successFunc(xhr.responseText);
		        	}else{
		        		successFunc(json);
		        	}
		        }else{
		        	if(abnormalFunc != null){
		        		abnormalFunc(xhr);
		        	}
		        }
		    }
		}
	}

}

var kefu = {
	api:{
		getMyUser:'',			//获取当前用户，我自己的用户信息。传入如 http://xxxx.com/user/getMyUser.json
		getChatOtherUser:'',	//获取chat一对一聊天窗口中，当前跟我沟通的对方的用户信息。传入如 http://xxxx.com/user/getUserById.json 会自动携带当前登录用户的token、以及对方的userid
		chatLog:'',				//获取我跟某人的历史聊天记录列表的接口
		uploadImage:''			//图片上传接口
	},
	user:{},	//当前用户信息，如： {"id":"youke_c302af1bb55de708a99fbc7266ddf016","nickname":"游客302a","head":"https://res.hc-cdn.com/cnpm-common-resource/2.0.2/base/header/components/images/logo.png","type":"youke"}
	currentPage:'',	//当前所在哪个页面， 有 list 、 chat
	mode:'mobile',	//pc、mobile  两种模式。 pc模式是左侧是list、右侧是chat，  mobile是一栏要么是list要么是chat。  默认是mobile模式
	extendIconColor:'#808080',	//插件图标的颜色，在chat底部显示的插件图标。 16进制颜色编码
	remindVoicePath:'https://res.weiunity.com/kefu/media/voice.mp3',	//声音提醒的声音路径，可传入如  https://xxxxxx.com/a.mp3
	//初始化，当kefu.js 加载完毕后，可以执行这个，进行im的初始化
	init:function(){
		var head0 = document.getElementsByTagName('head')[0];

		for(var key in kefu.extend){
			//加载模块的js
			if(kefu.extend[key].js != null && kefu.extend[key].js.length > 0){
				var script = document.createElement("script");  //创建一个script标签
				script.type = "text/javascript";
				script.src = kefu.extend[key].js;
				head0.appendChild(script);
			}

			//加载模块的css
			if(kefu.extend[key].css != null && kefu.extend[key].css.length > 0){
				var link = document.createElement('link');
				link.type='text/css';
				link.rel = 'stylesheet';
				link.href = kefu.extend[key].css;
				head0.appendChild(link);
			}
			
			//如果模块有初始化，那么执行其初始化 init() 方法的代码
			if(kefu.extend[key].init != null){
				try{
					//避免某个模块中的初始化失败，导致整个im 初始化中断
					kefu.extend[key].init();
				}catch(e){ console.log(e); }
			}
		
		}
		
		//下载音频文件
		kefu.notification.audio.load();
	},
	//新消息通知、提醒
	notification:{
		use:true,	//是否使用通知，默认为true，使用。如果不使用，那么就是false，false不再播放声音通知、桌面通知
		audioPath:'https://res.weiunity.com/kefu/media/voice.mp3',	//播放的音频文件路径，格式如： https://res.weiunity.com/kefu/media/voice.mp3 。不设置默认便是  https://res.weiunity.com/kefu/media/voice.mp3
		//播放提醒，执行提醒
		execute:function(title,text){
			if(!kefu.notification.use){
				//不使用
				return;
			}
			
			//播放声音
			try{
				kefu.notification.audio.play();
			}catch(e){
				console.log(e);
			}
			
			if(document.location.protocol != 'https:'){
				console.log('当前使用的不是https请求！只有https请求才可以有浏览器消息通知。这里只是声音通知');
				return;
			}
			
			//是https，那么支持Notification通知，使用通知提醒
			if (window.Notification != null){
				//支持通知
				
				if(Notification.permission === 'granted'){
					var notification = new Notification(title, {
						body: text,
						silent: false	//不播放声音。播放声音交给 kefu.notification.audio.play
						//sound:kefu.notification.audioPath
						//icon: 'https://res.weiunity.com/kefu/images/head.png'
					});
				}else {
					//未授权，弹出授权提示
					Notification.requestPermission();
				};
			}
		},
		audio:{
			audioBuffer:null,	//声音文件的音频流，通过url加载远程的音频流
			audioContext : new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext),
			//初始化预加载，将加载远程的mp3文件下载下来。这项应该在socket建立完链接之后在进行下载，不然会提前占用网速，导致socket建立连接过慢
			load:function(){
				if(kefu.notification.audioPath == null || kefu.notification.audioPath.length < 1){
					console.log('已将 kefu.notification.audioPath 设为空，将不再出现声音提醒');
					return;
				}
				var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
		        xhr.open('GET', kefu.notification.audioPath, true);
		        xhr.responseType = 'arraybuffer';
		        xhr.onload = function (e) { //下载完成
		        	kefu.notification.audio.audioContext.decodeAudioData(this.response, function (buffer) { //解码成功时的回调函数
		        		kefu.notification.audio.audioBuffer = buffer;
		        	}, function (e) { //解码出错时的回调函数
		        		console.log('kefu.notification.load() Error decoding file', e);
		        	});
		        };
		        xhr.send();
			},
			//进行播放声音
			play:function(){
				if(kefu.notification.audio.audioBuffer == null){
					//网络加载音频文件。就不判断是否正在加载中了，多加载几次也无所谓了
					kefu.notification.audio.load();
					return; 
				}
				var audioSource = kefu.notification.audio.audioContext.createBufferSource();
				audioSource.buffer = kefu.notification.audio.audioBuffer;
				audioSource.connect(kefu.notification.audio.audioContext.destination);
				audioSource.start(0); //立即播放
			}
		}
	},
	//存储，比如存储聊天记录、用户信息等。都是以key、value方式存储。其中value是string字符串类型。可重写，自定义自己的存储方式
	storage:{
		get:function(key){
			return localStorage.getItem(key);
		},
		set:function(key, value){
			localStorage.setItem(key,value);
		}
	},
	token:{
		/* 如果用户已登录，这里存储的是用户的session，如果用户未登录，这里存储的是生成的 "youke+uuid" */
		token:null,
		/**
		 * 获取token，也就是 session id。获取的字符串如 f26e7b71-90e2-4913-8eb4-b32a92e43c00
		 * 如果用户未登录，那么获取到的是  youke_uuid。 这个会设置成layim 的  mine.id
		 */
		get:function(){
			if(this.token == null){
				this.token = kefu.storage.get('token');
			}
			if(this.token == null || this.token.length < 5){
				this.token = 'youke_'+generateUUID();
			}
			this.set(this.token);
			return this.token;
		},
		/**
		 * 设置token，也就是session id
		 * 格式如 f26e7b71-90e2-4913-8eb4-b32a92e43c00
		 */
		set:function(t){
			this.token = t;
			kefu.storage.set('token',this.token);
		}
	},
	/**
	 * 获取当前用户(我)的User信息
	 */
	getMyUser:function(){
		if(kefu.api.getMyUser == null || kefu.api.getMyUser.length < 1){
			msg.popups('请设置 kefu.api.getMyUser 接口，用于获取当前用户(我)的信息');
			return;
		}
		request.post(kefu.api.getMyUser,{token:kefu.token.get()}, function(data){
			kefu.user = data;
		});
	},
	//过滤html标签，防XSS攻击
	filterXSS:function (text) {
		text = text.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
		text = text.replace(/[|]*\n/, '') //去除行尾空格
		text = text.replace(/&npsp;/ig, ''); //去掉npsp
		return text;
	},
	//将[ul][li][br]等转化为html
	ubb:function(text){
		return text.replace(/\[ul\]/g, '<ul>')
			.replace(/\[\/ul\]/g, '</ul>')
			.replace(/\[li\]/g, '<li onclick="kefu.chat.question(this);">')
			.replace(/\[\/li\]/g, '</li>')
			.replace(/\[br\]/g, '<br>');
	},
	//获取接收到的消息的text内容。 msg:socket传过来的消息，会把这个消息进行处理，返回最终显示给用户看的消息体
	getReceiveMessageText:function(message){
		if(message.extend != null && message.extend.extend != null){
			//如果是插件，那么将json变为插件显示的样式
			message = kefu.extend[message.extend.extend].format(message);
		}
		//将[ul][li][br]等转化为html
		message['text'] = kefu.ubb(message['text']);
		return message['text'];
	},
	//UI界面方面
	ui:{
		//图片
		images:{
			//chat底部的更多，chat底部的输入方式切换
			more:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603880506122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7418" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512.512 112.384c-219.6992 0-398.4896 178.7392-398.4896 398.4896 0 219.6992 178.7392 398.4896 398.4896 398.4896 219.6992 0 398.4896-178.7392 398.4896-398.4896s-178.7392-398.4896-398.4896-398.4896z m167.8848 424.0384H538.112v142.2848c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6v-142.2848H344.6784c-14.1312 0-25.6-11.4688-25.6-25.6s11.4688-25.6 25.6-25.6H486.912V342.9888c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v142.2848h142.2848c14.1312 0 25.6 11.4688 25.6 25.6s-11.4688 25.5488-25.6 25.5488z" fill="#1296db" p-id="7419"></path></svg>',
			//键盘输入，chat底部的输入方式切换
			jianpan:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603880701592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10768" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M513.788813 938.289925c-113.566274 0-220.223734-44.167967-300.444149-124.388381-80.220415-80.220415-124.388382-186.877876-124.388382-300.44415s44.167967-220.227983 124.388382-300.448398c165.543834-165.548083 435.348714-165.548083 600.892548 0 165.548083 165.548083 165.548083 435.348714 0 600.892548-80.220415 80.220415-186.877876 124.388382-300.44415 124.388381z m0-785.973112c-92.538158 0-185.072066 35.453344-255.379651 105.756681-68.2001 68.204349-105.75668 158.63927-105.756681 255.3839s37.556581 187.175303 105.756681 255.379652c68.204349 68.2001 158.936697 106.054108 255.379651 105.75668 96.74888 0 187.179552-37.556581 255.379652-105.75668 140.912598-140.912598 140.912598-369.850954 0-510.759303-70.303336-70.307585-162.841494-105.75668-255.379652-105.756681z" p-id="10769" fill="#1296db"></path><path d="M318.672199 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545228 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.738589c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM488.630705 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545229 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.73859c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM658.589212 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545228 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.738589c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM318.672199 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332H318.672199c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM488.630705 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.313693c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM658.589212 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.313693c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM458.887967 660.378025h106.224066c17.420747 0 31.86722 14.446473 31.86722 31.86722s-14.446473 31.86722-31.86722 31.86722h-106.224066c-17.420747 0-31.86722-14.446473-31.86722-31.86722s14.446473-31.86722 31.86722-31.86722z" p-id="10770" fill="#1296db"></path></svg>'
		},
		list:{
			renderAreaId:'',		//渲染区域的id，如果不赋值，那么默认就是渲染到body
			listItemTemplate:'', //当list页面渲染出来后，这里自动从html中取
			html:`
				<section id="chatlist">

			        <section class="item" onclick="kefu.ui.chat.render('{id}');">
			            <div class="head" style="background-image: url({head});"></div>
			            <div>
			                <div class="nickname">
			                    <span class="time">{time}</span>
			                    {nickname}
			                </div>
			                <div>
			                    <span class="num">{num}</span>
			                    <div class="text">{text}</div>
			                </div>
			            </div>
			        </section>

			    </section>

			    <!-- <div style="position: absolute;bottom: 1rem;">
			        <a href="javascript:kefu.ui.chat.render('243');" >测试聊天</a>
			    </div> -->
			`,
			getListItemByTemplate:function(item){
			    return kefu.ui.list.listItemTemplate
			            .replace(/{id}/g, item['id'])
			            .replace(/{text}/g, item['text'])
			            .replace(/{nickname}/g, item['nickname'])
			            .replace(/{head}/g, item['head'])
			            .replace(/{time}/g, formatTime(item['time'], 'M-D h:m'))
			            .replace(/{num}/g, '<div>&nbsp;</div>');
			},
			render:function(){
				if(kefu.ui.list.renderAreaId.length > 0){
					//有设置渲染区域，那么渲染到设置的id上
					document.getElementById(kefu.ui.list.renderAreaId).innerHTML = kefu.ui.list.html;
				}else{
					document.body.innerHTML = kefu.ui.list.html;
				}
				
				if(kefu.ui.list.listItemTemplate.length < 1){
					//设置某个用户聊天item的模板
					kefu.ui.list.listItemTemplate = document.getElementById('chatlist').innerHTML;   
				}

			    var chatList = kefu.cache.getChatList();
			    var chatListLength = chatList.length;
			    var html = '';
			    for (var i = 0; i < chatListLength; i++) {
			        html = kefu.ui.list.getListItemByTemplate(chatList[i]) + html;
			    }
			    document.getElementById('chatlist').innerHTML = html;

			    //下面注释的这写应该是在chat中的，待测试正常后删除
			    //去掉chat一对一聊天窗中的监听
			    //window.onscroll = null;
			    //如果chat显示，那么自动执行插件的initChat 方法,如果插件设置了的话
//			    for(var key in kefu.extend){
//					if(kefu.extend[key].initList != null){
//						try{
//							//避免某个模块中的初始化失败，导致整个im 初始化中断
//							kefu.extend[key].initList();
//						}catch(e){ console.log(e); }
//					}
//				}
			    
			    //kefu.currentPage = 'list';	//赋予当前所在页面为list
			}
		},
		
		chat:{
			renderAreaId:'',		//渲染区域的id，如果不赋值，那么默认就是渲染到body
			html:`
				<header class="chat_header" id="head">
			        <div class="back" id="back" onclick="kefu.ui.list.render();">&nbsp;</div>
			        <div class="title" id="title"><span id="nickname">在线咨询</span><span id="onlineState">在线</span></div>
			    </header>
				<div id="newMessageRemind">
					<!-- 新消息：消息内容消息内容 -->
				</div>
				
			    <section id="chatcontent" onclick="kefu.ui.chat.textInputClick();">
			    </section>
			    
			    <footer id="chat_footer">
			        <div id="input_area">
			            <div id="textInput">
			            	<div id="shuruType" onclick="kefu.chat.shuruTypeChange();"><!--输入方式--></div>
			                <!-- 键盘输入 -->
			                <!-- <input type="text" id="text111" onclick="kefu.ui.chat.textInputClick();"> -->
			                <div id="text" contenteditable="true" onclick="kefu.ui.chat.textInputClick();"></div>
			                <input type="submit" value="发送" class="send" id="sendButton" onclick="kefu.chat.sendButtonClick();">
			            </div>
			            <div id="inputExtend">
			                <!-- 其他，如图片、商品、订单 -->

			            </div>    
			            <div id="inputExtendShowArea">
			                <!-- inputExtend的显示区域，如表情的显示 -->
			            </div>
			        </div>
			    </footer>
			`,
			//发送一条消息，在双方聊天的消息末尾追加消息
			appendMessage: function(message){
				if(typeof(message) == 'string'){
			        message = JSON.parse(message);   //转成json
			    }
			    //判断一下，消息的类型。
			    if(message == null){
			        return;
			    }
			    if(message.type == 'SYSTEM'){
			        //系统类型消息
			        kefu.ui.chat.appendSystemMessage(kefu.filterXSS(message['text']));
			    }else{
			        //其他类型，那么出现对话框的
			        var section = kefu.ui.chat.generateMessageSection(message);
			    
			        document.getElementById('chatcontent').appendChild(section);
			        //滚动条滚动到最底部
			        kefu.ui.chat.scrollToBottom();
			    }
			},
			//创建聊天正常沟通收发消息的 section dom 元素
			generateMessageSection:function(message){
				message['text'] = kefu.getReceiveMessageText(message);
			    //发送文本消息后绘制对话窗口
			    var section = document.createElement("section");
			    //要用kefu.chat.otherUser来判断，不能用 kefu.user, kefu.user 异步获取，有可能kefu.user 还没获取到
			    if(message['receiveId'] == kefu.chat.otherUser.id){
			        //是自己发送的这条消息，那么显示在右侧
			        section.className = 'chat user '+message['type'];
			        section.innerHTML = '<div class="head"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
			    }else if(message['sendId'] == kefu.chat.otherUser.id){
			        //是自己接受的这个消息，那么显示在左侧
			        section.className = 'chat otherUser '+message['type'];
			        section.innerHTML = '<div class="head" style="background-image: url('+kefu.chat.otherUser.head+');"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
			    }
			    return section;
			},
			//创建聊天系统提示消息的 section dom 元素 
			generateSystemMessageSection:function(text){
				var section = document.createElement("section");
				section.className = 'chat bot systemChat';
				section.innerHTML = '<div class="text systemText">'+text+'</div>';
				return section;
			},
			//聊天窗口滚动到最底部
			scrollToBottom:function(){
				//console.log('height:'+document.getElementById('chatcontent').scrollHeight);
				document.getElementById('chatcontent').scrollTo(0,document.getElementById('chatcontent').scrollHeight);
			},
			//在当前chat一对一聊天界面的消息最末尾追加显示一条系统消息, text:要显示的消息内容
			appendSystemMessage:function(text){
				chatcontent = document.getElementById('chatcontent');
				chatcontent.innerHTML =  chatcontent.innerHTML + 
					'<section class="chat bot systemChat"><div class="text systemText">'+text+'</div></section>';
				window.scrollTo(0,chatcontent.scrollHeight);
			},
			//文字输入框被点击，隐藏扩展功能区域
			textInputClick:function (){
				//隐藏扩展功能输入区域
				document.getElementById('inputExtend').style.display = '';
				document.getElementById('inputExtendShowArea').style.display = 'none';
				if(kefu.chat.shuruType != 'jianpan'){
					kefu.chat.shuruTypeChange();
				}
				
			},
			//渲染出chat一对一聊天页面。 otherUserId跟我聊天的对方的userid
			render:function(otherUserId){
				if(kefu.ui.list.renderAreaId.length > 0){
					//有设置渲染区域，那么渲染到设置的id上
					document.getElementById(kefu.ui.chat.renderAreaId).innerHTML = kefu.ui.chat.html;
				}else{
					//赋予chat聊天窗html的大框信息显示
					document.body.innerHTML = kefu.ui.chat.html;
				}
				
				//加载跟这个人聊天的历史对话记录。不过当前是在获取对方数据之前先拉历史记录，kefu.chat.otherUser 肯定是null，所以先赋予默认值
				kefu.chat.otherUser = {
						id:otherUserId,	
						nickname:'加载中..',
						head:'./images/head.png'
				}
		        var chatCacheList = kefu.cache.getUserMessageList(kefu.chat.otherUser.id);
		        for(var i = 0; i<chatCacheList.length; i++){
		            var message = chatCacheList[i];
		            kefu.ui.chat.appendMessage(message);
		        }
				
			    //获取聊天对方的用户信息
			    kefu.chat.getOtherUser(otherUserId, function(data){
			        //设置网页聊天窗title 的对方昵称
					document.getElementById('nickname').innerHTML = kefu.chat.otherUser.nickname;
					//对方在线状态
			        document.getElementById('onlineState').innerHTML = data.onlineState;
			        
			        //将对方用户发言的头像换为接口拉取的真实头像。如果当前chat模板中显示头像的话
			        try{
			        	var heads = document.getElementsByClassName("otherUser");
				        for(var i = 0; i < heads.length; i++){
				        	heads[i].getElementsByClassName("head")[0].style.backgroundImage = 'url(\''+kefu.chat.otherUser.head+'\')';
				        }
			        }catch(e){
			        	console.log('当前chat聊天模板中没有显示头像吧？下面这个错误只是个提示，无需理会');
			        	console.log(e);
			        }
			        
			        //取得跟这个用户聊天时，聊天窗口中显示的聊天记录的开始时间，用这个时间来获取往上滑动时的更多消息记录
			        if(chatCacheList.length > 0){
			            var lastMsg = chatCacheList[0];
			            if(lastMsg.time != null){
			                kefu.chat.chatMessageStartTime = lastMsg.time;
			            }
			        }
			        //如果kefu.chat.chatMessageStartTime还是0，那么赋予当前的13位时间戳
			        if(kefu.chat.chatMessageStartTime < 1){
			            kefu.chat.chatMessageStartTime = new Date().getTime();
			        }
			        console.log('getOtherUser:');
			        console.log(kefu.chat.otherUser);
			        //拉取对方设置的自动回复欢迎语
			        var autoReplyInterval = setInterval(function(){
			            if(typeof(kefu.chat.otherUser.id) != 'undefined' && kefu.user != null && typeof(kefu.user.id) != 'undefined'){
			            	if(typeof(socket.socket) != 'undefined' && socket.socket.readyState == socket.socket.OPEN){
			            		//socket也已经打开了
			            		//拉对方的自动回复欢迎语
			            		socket.send(JSON.stringify({
				                    token: kefu.token.get()
				                    ,receiveId: kefu.chat.otherUser.id
				                    ,type:"AUTO_REPLY"
				                }));
			            		
			            		
			            		
			            		//拉取历史记录。 这个暂时用离线消息取代
//			            		console.log('---');
//			            		if(chatCacheList != null && chatCacheList.length > 0){
//			            			//取出本地缓存的最新的一条记录
//			            			var lastMessage = chatCacheList[chatCacheList.length-1];
//			            			console.log(lastMessage);
//			            			//拉取当前时间以后的离线消息。这个应该是socket在拉取离线消息结束后，再执行这个
//				    				request.post(kefu.api.chatLog,{token:kefu.token.get(),otherId:kefu.chat.otherUser.id, time:lastMessage.time, type:'after'}, function(data){
//				    					if(data.result == '0'){
//				    						//失败，弹出提示
//				    						msg.failure(data.info);
//				    					}else if(data.result == '1'){
//				    						//成功
//				    						//判断一下请求到的消息记录有多少条
//
//				    						if(data.number > 0){
//				    							//有消息记录，那么绘制出来
//				    							
//				    							//判断一下当前是否已经有自动回复了，如果有先删除掉自动回复的消息，同步完在显示自动回复
//				    							var auto = document.getElementsByClassName('AUTO_REPLY')[0];
//				    							if(typeof(auto) != 'undefined'){
//				    								auto.parentElement.removeChild(auto);
//				    							}
//				    							
//				    							//绘制同步过来的消息
//				    							var chatcontent = document.getElementById('chatcontent');
//						    					//取第一个正常聊天沟通的section，用来作为插入的定位
//						    					var firstItem = chatcontent.getElementsByTagName("section")[0];
//						    					//遍历最新消息，绘制到界面，也加入本地缓存
//				    							for(var i = data.list.length-1; i >= 0; i--){
//				    								var message = data.list[i];
//				    								console.log(message);
//				    								var msgSection = kefu.ui.chat.generateMessageSection(message);
//				    								chatcontent.appendChild(msgSection);	//在聊天最后插入这条发言信息
//				    								kefu.cache.add(message) //将这条消息加入本地缓存
//				    							}
//				    							
//				    							//同步消息结束，再将自动回复加入进来
//				    							chatcontent.appendChild(auto);
//				    							
//				    							kefu.ui.chat.scrollToBottom()	//滚动到最底部
//				    						}else{
//				    							//没有离线消息
//				    							console.log('信息同步检测完毕，没有离线消息');
//				    						}
//				    					}
//				    				});
//			            		}
			            		
			            		
			            		clearInterval(autoReplyInterval);//停止
				                console.log('autoReplyInterval stop');
			            	}
			            }
			        }, 200);
			        
			        kefu.chat.init(); //执行chat的初始化

			        //监听滚动条，如果上滑超过多少，那么从服务器拉历史聊天记录
			        document.getElementById('chatcontent').onscroll = function(){
			            //console.log(document.getElementById('chatcontent').scrollTop);
			            if(document.getElementById('chatcontent').scrollTop < 900){
			                //还剩一页半了，那么提前开始加载上一页
			                kefu.chat.loadHistoryList();
			            }
			        }

			    });

				
				//如果chat显示，那么自动执行插件的initChat 方法,如果插件设置了的话
				for(var key in kefu.extend){
					if(kefu.extend[key].initChat != null){
						try{
							//避免某个模块中的初始化失败，导致整个im 初始化中断
							kefu.extend[key].initChat();
						}catch(e){ console.log(e); }
					}
				}
				
				kefu.currentPage = 'chat';	//赋予当前所在页面为chat
			}
		}
	},
	/* 在聊天窗口中使用的 */
	chat:{
		otherUser:{},	//当前用户正在跟谁聊天，对方的user信息。每当打开一个跟某人的聊天窗时，会自动初始化此信息
		chatMessageStartTime:0,	//当前正在跟这个用户聊天时，聊天窗口中显示的消息列表的开始时间，13位时间戳，会根据这个来加载用户的网上滑动的消息
		shuruType:'jianpan',	//当前输入方式，默认进入是键盘方式输入。取值两个， jianpan:键盘方式输入； more:更多输入方式
		
		/**
		 * 获取当前聊天窗口中，跟我聊天的对方的user信息
		 * @param userid 当前谁在跟谁聊天，对方的userid
		 * @param func 获取到对方的用户信息后，要执行的方法
		 */
		getOtherUser:function(userid, func){
			if(kefu.api.getChatOtherUser == null || kefu.api.getChatOtherUser.length < 1){
				msg.popups('请设置 kefu.api.getChatOtherUser 接口，用于获取跟我沟通的对方的信息');
				return;
			}
			request.post(kefu.api.getChatOtherUser,{token:kefu.token.get(), id:userid}, function(data){
				kefu.chat.otherUser = data.user;
				if(typeof(func) != 'undefined'){
					func(data);
				}
			});
		},
		//进入一对一聊天窗口时，先进行的初始化。主要是加载插件方面的设置
		init:function(){
			kefu.chat.currentLoadHistoryList=false;	//允许拉去所有历史聊天记录
			
			//聊天窗口最下方用户输入项的插件显示
//			var inputExtendHtml = '';
//			for(var key in kefu.extend){
//				if(kefu.extend[key].icon != null && kefu.extend[key].icon.length > 0){
//			        inputExtendHtml = inputExtendHtml + '<span onclick="kefu.extend[\''+key+'\'].onclick();">'+ kefu.extend[key].name + '</span>';
//			    }
//			}
//			document.getElementById('inputExtend').innerHTML = inputExtendHtml;
			
			
			//设置底部的输入方式切换
			if(document.getElementById('shuruType') != null){
				document.getElementById('shuruType').innerHTML = kefu.ui.images.more;
			}
		},
		currentLoadHistoryList:false,	//跟loadHistoryList() 一起用，当加载历史列表时，此处为true，加载完后，此处变为false
		/* 加载历史聊天列表 */
		loadHistoryList(){
			if(!kefu.chat.currentLoadHistoryList){
				kefu.chat.currentLoadHistoryList = true;	//标记正在请求历史记录中
				if(kefu.cache.getUserMessageList(kefu.chat.otherUser.id).length < kefu.cache.everyUserNumber){
					//如果跟对方聊天的记录，本地缓存的几率条数小于本地缓存最大条数，那么就是刚开始聊天，都还没超过缓存最大数，那么也就没必要在从服务器拉更多聊天记录了
					console.log('聊天记录不足，没必要再拉更多');
					return;
				}

				var chatcontent = document.getElementById('chatcontent');
				var firstItem = chatcontent.getElementsByTagName("section")[0];

				//创建加载中的提示
				var section = document.createElement("section");
				section.className = 'chat bot systemChat';
				section.id = 'historyListLoading';
				section.innerHTML = '<div class="text systemText">历史聊天加载中...</div>';
				chatcontent.insertBefore(section,firstItem);

				//创建网络请求
				request.post(kefu.api.chatLog,{token:kefu.token.get(),otherId:kefu.chat.otherUser.id, time:kefu.chat.chatMessageStartTime, type:'before'}, function(data){
					kefu.chat.currentLoadHistoryList = false;	//标记请求历史记录已请求完成，可以继续请求下一次聊天记录了

					var chatcontent = document.getElementById('chatcontent');
					//删除聊天记录加载中的提示
					chatcontent.removeChild(document.getElementById('historyListLoading'));
					//删除聊天记录加载中的提示section后，取第一个正常聊天沟通的section，用来作为插入的定位
					var firstItem = chatcontent.getElementsByTagName("section")[0];

					if(data.result == '0'){
						//失败，弹出提示
						msg.failure(data.info);
					}else if(data.result == '1'){
						//成功
						//判断一下请求到的消息记录有多少条

						if(data.number > 0){
							//有消息记录，那么绘制出来
							for(var i = data.list.length-1; i >= 0; i--){
								var message = data.list[i];
								var msgSection = kefu.ui.chat.generateMessageSection(message);
								chatcontent.insertBefore(msgSection,firstItem);
							}
							//重新标记历史消息的开始时间
							kefu.chat.chatMessageStartTime = data.startTime;
						}else{
							//没有更多消息了
							kefu.chat.currentLoadHistoryList = true;	//标记请求历史记录不再继续请求了，因为已经没有更多记录了
							//msg.info('没有更多消息了');
							chatcontent.insertBefore(kefu.ui.chat.generateSystemMessageSection('没有更多了'),firstItem);
						}

						
						
						
					}
				});
			}
		},
		/* 常见问题 */
		question:function(obj){
			var text = obj.innerHTML;
			kefu.chat.sendTextMessage(text);
		},
		/* 发送文本格式消息  text:要发送的文本消息。 返回json对象的message */
		sendTextMessage:function(text){
			var data = {
		    	token:kefu.token.get(),
		    	type:'MSG',	//消息类型
		    	sendId:kefu.user.id,		//发送者ID
		    	receiveId:kefu.chat.otherUser.id,	//接受者id
		    	text:text,
		        time:new Date().getTime()      
		    }
		    var message = JSON.stringify(data);
		    kefu.ui.chat.appendMessage(message);    //聊天窗口增加消息
		    socket.send(message);       //socket发送
		    kefu.cache.add(message);   //缓存

		    return message;
		},
		/*
		 * 发送插件消息。只有插件消息的发送才使用这个。正常发送文字消息使用的是 sendTextMessage
		 * @param data 要发送的插件消息的消息体对象，如 {goodsid:'123',goodsName:'西瓜', price:'12元'} ，但是为json对象的格式
		 * @param name 发送这个消息的插件的名字，比如这个插件是 kefu.extend.explain ，那么这里传入的是 'explain'
		 */
		sendPluginMessage:function(data, name){
			if(name == null){
				msg.popups('kefu.chat.sendPluginMessage(data,name) 方法中，请传入name的值。<br/>name是发送这个消息的插件的名字，比如这个插件是 kefu.extend.explain ，那么这里传入的是 \'explain\'');
				return;
			}
			if(data != null){
				data.extend = name;
			}else{
				data = {};
			}
			//组合后的消息体
			var message = {
				token:kefu.token.get(),
				receiveId:kefu.chat.otherUser.id,
				sendId:kefu.user.id,
				type:'EXTEND',
				time:new Date().getTime(),
				extend:data
			};
			//更新聊天窗口
			message.text = kefu.extend[name].format(message);
			kefu.ui.chat.appendMessage(message);
			
			//socket发送消息
			message.text = '';	//清理掉message.text 因为这个本来就是自动生成出来的不必额外占用带宽、流量
			socket.send(message);

			kefu.cache.add(message);   //缓存
		},
		//text文本，打字沟通交流， 点击提交按钮后发送
		sendButtonClick:function (){
		    var value = document.getElementById('text').innerHTML;
		    if(value.length == 0){
		        msg.info('尚未输入');
		        return;
		    }

		    //接口提交-文本对话，输入文字获取对话结果
		    msg.loading("发送中");    //显示“更改中”的等待提示
		    
		    kefu.chat.sendTextMessage(document.getElementById('text').innerHTML);
			msg.close();	//关闭发送中提示
		    //清空内容区域
		    document.getElementById('text').innerHTML = '';

		    //隐藏表情等符号输入区域
		    kefu.ui.chat.textInputClick();
		},
		//输入类型改变，切换，比如有更多切换到键盘输入
		shuruTypeChange:function(){
			//设置底部的输入方式切换
			if(document.getElementById('shuruType') == null){
				return;
			}
			if(kefu.chat.shuruType == 'jianpan'){
				//当前是键盘输入，切换到更多输入方式
				kefu.chat.shuruType = 'more';
				document.getElementById('shuruType').innerHTML = kefu.ui.images.jianpan;
				
				//更多输入放大
				var inputExtendHtml = '';
				for(var key in kefu.extend){
				    if(kefu.extend[key].icon != null && kefu.extend[key].icon.length > 0){
				    	inputExtendHtml = inputExtendHtml + 
					    	'<div class="item" onclick="kefu.extend[\''+key+'\'].onclick();"><div class="iconButton">'+(kefu.extend[key].icon.replace("{color}", kefu.extendIconColor))+'</div><div class="iconName">'+kefu.extend[key].name+'</div></div>'; 
				    }
				}
				document.getElementById('inputExtend').innerHTML = inputExtendHtml;
				
			}else{
				//当前是更多输入，切换到键盘输入方式
				kefu.chat.shuruType = 'jianpan';
				document.getElementById('shuruType').innerHTML = kefu.ui.images.more;
				
				//更多简化缩小
				var inputExtendHtml = '';
				for(var key in kefu.extend){
					if(kefu.extend[key].icon != null && kefu.extend[key].icon.length > 0){
						inputExtendHtml = inputExtendHtml + '<span class="smallIcon" onclick="kefu.extend[\''+key+'\'].onclick();">'+ (kefu.extend[key].icon.replace("{color}", kefu.extendIconColor)) + '</span>';
				    }
				}
				//document.getElementById('inputExtend').innerHTML = '<div class="extendSmallIcon">'+inputExtendHtml+'</div>';
				document.getElementById('inputExtend').innerHTML = '';	//缩小时不显示
				
			}
		}

	},
	cache:{
		everyUserNumber:20,	//每个用户缓存20条最后的聊天记录
		/* 根据userid，获取跟这个用户的本地缓存的20条最近聊天记录 */
		getUserMessageList:function(userid){
			var chatListStr = kefu.storage.get('userid:'+userid);
			if(chatListStr == null || chatListStr.length < 1){
				chatListStr = '[]';
			}
			var chatList = JSON.parse(chatListStr);
			return chatList;
		},
		/* 发送或者接收消息，都会加到这里，进行缓存 */
		add:function(message){
			if(typeof(message) == 'string'){
				var message = JSON.parse(message);	//转成json
			}
			var otherUserId = 0;	//聊天对方的userid
			if(message['sendId'] == kefu.user.id){
				//这条消息是自己发送出去的
				otherUserId = message['receiveId'];
			}else if(message['receiveId'] == kefu.user.id){
				//自己是消息接收者，别人发过来的消息
				otherUserId = message['sendId'];
			}
			//判断一下消息类型，如果是系统提示消息， type = 'SYSTEM' ，没意义的提醒，那么不保存
			if(message['type'] == 'SYSTEM'){
				return;
			}
			//console.log(otherUserId);
			if(otherUserId != '0' && otherUserId.length > 0){

				//保存单独跟这个用户的聊天记录
				var chatUserStr = kefu.storage.get('userid:'+otherUserId);
				if(chatUserStr == null || chatUserStr.length < 1){
					chatUserStr = '[]';
				}
				var chatUser = JSON.parse(chatUserStr);
				chatUser.push(message);
				if(chatUser.length > this.everyUserNumber) {
					//console.log('移除：'+chatUser[0]);
					chatUser.splice(0, 1);	//移除最后一个
				}
				kefu.storage.set('userid:'+otherUserId, JSON.stringify(chatUser));
				//console.log('保存：'+JSON.stringify(chatList))

				//保存聊天列表的最后一条聊天消息
				kefu.cache.pushChatList(kefu.chat.otherUser, message);
			}
		},
		/* 获取聊天列表的缓存 */
		getChatList:function(){
			var chatListStr = kefu.storage.get('list');
			if(chatListStr == null || chatListStr.length < 1){
				chatListStr = '[]';
			}
			var chatList = JSON.parse(chatListStr);
			return chatList;
		},
		// 往聊天列表中添加最后一次沟通的记录 otherUser 用户对象信息    message:消息json
		pushChatList:function(otherUser, message){
			if(otherUser == null){
				msg.popups('出错，kefu.cache.pushChatList 传入的 otherUser 为null');
				return;
			}
			var chatList = this.getChatList();

			//聊天内容
			var text = message.text;
		    if(message.type == 'EXTEND'){
		        text = kefu.extend[message.extend.extend].name;
		    }

			//组合新的消息
			var newMessage = {
				id:otherUser.id,	//对方的userid
				text:text,		//最后一次沟通的内容
				nickname:otherUser.nickname,	//对方的昵称
				head:otherUser.head, 	//对方的头像
				time:message.time 			//消息产生的时间。
			}
			if(newMessage.time == null){
				newMessage.time = parseInt(new Date().getTime()/1000);
			}

			var chatListLength = chatList.length;
			for (var i = 0; i < chatListLength; i++) {
				if(chatList[i] != null && chatList[i]['id'] == otherUser.id){
					chatList.splice(i, 1);	//移除跟这个用户的上一条记录。以便存最新的
					continue;
				}
			}
			chatList.push(newMessage);
			kefu.storage.set('list', JSON.stringify(chatList));
		},
		//通过userid，获取user对象信息 ,未完成
		getUser(userid){
			var user;
			var userStr = kefu.storage.get('user_id_'+userid);
			if(userStr == null){
				//从网络获取
				kefu.cache.getUser_linshijiluUser = null;
				
				new Promise((resolve, reject) => {
					console.log('Promise'+userid);
					request.send(kefu.api.getChatOtherUser,{token:kefu.token.get(), id:userid}, function(data){
						//请求完成
						kefu.cache.getUser_linshijiluUser = data.user;
						user = data.user;
						resolve(data);
					},'post', true, {'content-type':'application/x-www-form-urlencoded'}, function(xhr){
						//异常
						alert('异常');
					})
				}).then(function(data){
					console.log('then'+data.user.id);
					user = data.user;
				});
			}else{
				user = JSON.parse(userStr);
			}
			return user;
		}
	},
	/* 扩展，比如表情、图片、订单、商品 */
	extend:{
		/* 表情 */
		face:{
			name:'表情',
			icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603894373099" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2514" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512 979C263.472 979 62 777.528 62 529S263.472 79 512 79s450 201.472 450 450-201.472 450-450 450zM337 479c41.421 0 75-33.579 75-75s-33.579-75-75-75-75 33.579-75 75 33.579 75 75 75z m350 0c41.421 0 75-33.579 75-75s-33.579-75-75-75-75 33.579-75 75 33.579 75 75 75zM312 629c0 110.457 89.543 200 200 200s200-89.543 200-200H312z" fill="{color}" p-id="2515"></path></svg>',
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				return message;
			},
			faces:{
				xiaolian:'😀',
				huaixiao:'😁',
				se:'😍',
				feiwen:'😘',
				waiziuxiao:'😏',
				yumen:'😒',
				ai:'😔',
				tu:'🤮',
				yun:'😵',
				nanguo:'🙁',
				jingkong:'😲',
				ku:'😭',
				yangmei:'🤨',
				miyan:'😆',
				liuhan:'😅',
				weixiao:'🙂',
				xiaoxingxing:'🤩',
				sikao:'🤔',
				xu:'🤫',
				yanmaoqian:'🤑',
				shenshetou:'😝'
			},
			/* 点击后显示表情选择 */
			onclick:function (){
				var html = '<div id="inputExtend_Face">';
				for(var key in kefu.extend.face.faces){
					html = html + '<span onclick="kefu.extend.face.insert(\''+key+'\');">'+kefu.extend.face.faces[key]+'</span>';
				};
				html = html+'</div>';

				//隐藏扩展功能栏
				document.getElementById('inputExtend').style.display = 'none';
				document.getElementById('inputExtendShowArea').style.display = '';

				document.getElementById('inputExtendShowArea').innerHTML = html;
			},
			/* 向输入框中插入表情 */
			insert:function (key){
				document.getElementById('text').innerHTML = document.getElementById('text').innerHTML + kefu.extend.face.faces[key];
			}

		},
		/* 图片上传 */
		image:{
			name:'图片',
			icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603894900121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2954" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M955.733333 136.533333H68.266667c-37.546667 0-68.266667 30.72-68.266667 68.266667v614.4c0 37.546667 30.72 68.266667 68.266667 68.266667h887.466666c37.546667 0 68.266667-30.72 68.266667-68.266667V204.8c0-37.546667-30.72-68.266667-68.266667-68.266667z m-154.146133 171.485867a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4z m48.520533 442.282667H174.1312c-32.392533 0-50.193067-37.6832-29.610667-62.702934l186.504534-226.781866a38.3488 38.3488 0 0 1 59.2384 0L556.373333 662.818133a38.3488 38.3488 0 0 0 59.2384 0l92.2624-112.1792a38.3488 38.3488 0 0 1 59.2384 0l112.64 136.977067c20.548267 25.002667 2.7648 62.685867-29.6448 62.685867z" fill="{color}" p-id="2955"></path></svg>',
			template:'<img style="max-width: 100%;" onclick="kefu.extend.image.fullScreen(\'{url}\');" src="{url}" />',
			initChat:function(){
				var inputEle = document.createElement("input");
				inputEle.setAttribute("accept", "image/gif,image/jpeg,image/jpg,image/png,image/svg,image/bmp");
				inputEle.id = 'imageInput';
				inputEle.style.display = 'none';
				inputEle.type = 'file';
				document.body.appendChild(inputEle);
			},
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = kefu.extend.image.template.replace(/{url}/g, kefu.filterXSS(message.extend.url));
				return message;
			},
			onclick:function(){
				//添加input改动监听
				if(document.getElementById('imageInput').oninput == null){
					document.getElementById('imageInput').oninput = function(e){
					    if(typeof(e.srcElement.files[0]) != 'undefined'){
					        var file = e.srcElement.files[0];
					        msg.loading('上传中');
					        request.upload(kefu.api.uploadImage, {token:kefu.token.get()}, file,function(data){
					            msg.close();
					            if(data.result == '1'){
					            	//组合extend的消息体
					            	var extend = {
					            			url:data.url
					            	};
					            	kefu.chat.sendPluginMessage(extend, 'image');
					            }else{
					            	msg.failure(data.info);
					            }
					            
					        }, null, function(){
					        	msg.close();
					            msg.failure('异常');
					        });
					        //清理掉input记录，避免上传两张相同的照片时第二次上传无反应
					        document.getElementById('imageInput').value = '';
					    }    
					}
				}

				document.getElementById('imageInput').click();
			},
			//放大全屏查看图片
			fullScreen:function(imageUrl){
				msg.popups({
					text:'<img src="'+imageUrl+'" style="width: 100%; max-width: 100%; " />',
					top:'1rem',
					width:'100%',
					left:'0rem',
					height:'30rem',
					opacity:100
				});
			}
		},
		/* 订单 */
		order:{
			name:'订单',
			icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603894275814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1559" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M128 891.663059h768a128 128 0 0 0 128-128V260.336941a128 128 0 0 0-128-128H128A128 128 0 0 0 0 260.336941v503.326118a128 128 0 0 0 128 128z m83.425882-475.376941v281.178353c0 31.051294-57.705412 31.171765-57.705411 0V334.697412c0-21.202824 7.589647-31.051294 22.64847-31.834353 12.137412-0.632471 25.057882 5.692235 38.701177 24.244706l202.390588 275.365647v-272.323765c0-37.255529 55.898353-37.225412 55.898353 0v362.767059c0 18.100706-7.559529 26.383059-22.648471 27.196235-13.673412 0.722824-24.786824-6.746353-36.261647-22.64847L211.425882 416.286118z m292.352 149.62447c0-213.232941 272.022588-212.781176 272.022589 0 0 206.667294-272.022588 208.956235-272.022589 0z m52.555294 0c0 128.813176 165.586824 133.782588 165.586824 0 0-73.667765-40.749176-103.695059-83.245176-102.912-42.496 0.783059-82.341647 32.406588-82.341648 102.912z m285.093648 97.249883c15.872 0 28.822588 12.950588 28.822588 28.822588s-12.950588 28.822588-28.822588 28.822588-28.822588-12.950588-28.822589-28.822588 12.950588-28.822588 28.822589-28.822588z" fill="{color}" p-id="1560"></path></svg>',
			js:'./extend/order/order.js',	//引入这个扩展的自定义js。引入的这个js会在加载完kefu.js后立马加载引入这里的js
			css:'./extend/order/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完kefu.js后立马加载引入这里的css
			//请求的api接口
			requestApi:goodsUrl+'orderList.json',
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = kefu.extend.order.getOrderByTemplate(message.extend);
				return message;
			},

			/*
				订单号 {order.no}
				订单时间 {order.time}
				订单商品的图片 {goods.image}
				订单商品的名字 {goods.name}
				商品的价格 {goods.price}
				订单的状态 {order.state}
			*/
			listTemplate:`
				<div class="extend_order_item" onclick="kefu.extend.order.sendOrder('{order.no}', this, '{id}');">  
				    <div class="orderInfo">
				        <div class="order_no">订单号：{order.no}</div>
				        <div class="order_time">{order.time}</div>
				    </div>
				    <div class="goodsInfo">
				    	<img class="image" src="{goods.image}" />
					    <div class="goodsAttr">
					        <div class="name">{goods.name}</div>
					        <div class="priceState">
					            <div class="price">{goods.price}</div>
					            <div class="state">{order.state}</div>
					        </div>
					    </div>
				    </div>
				</div>
				<hr class="extend_order_hr" />
			`,

			orderMap:{},	//key: goodsid

			getOrderByTemplate:function(order){
				return kefu.extend.order.listTemplate
							.replace(/{order.no}/g, kefu.filterXSS(order['no']+''))
							.replace(/{order.time}/g, kefu.filterXSS(order['time']+''))
							.replace(/{goods.image}/g, kefu.filterXSS(order['image']))
							.replace(/{id}/g, kefu.filterXSS(order['id']+''))		//唯一标识，仅此而已
							.replace(/{goods.name}/g, kefu.filterXSS(order['name']))
							.replace(/{goods.price}/g, kefu.filterXSS(order['price']+''))
							.replace(/{order.state}/g, kefu.filterXSS(order['state']+''));
			},
			onclick:function (){
				msg.loading('获取中');
				request.post(kefu.extend.order.requestApi,{token:kefu.token.get(), zuoxiid:kefu.chat.otherUser.id, myid:kefu.user.id}, function(data){
					msg.close();
					var html = '';
					for (var i = 0; i < data.length; i++) {
						kefu.extend.order.orderMap[data[i]['id']] = data[i];
						html = html + kefu.extend.order.getOrderByTemplate(data[i]);
					};
					msg.popups({
						text:html,
						top:'10%',
						height:'20rem'
					});
				});
			},
			//发送某个订单 orderid: 订单id、或订单号， obj:点击的当前dom对象， uniqueId:当前点击项在这个订单列表中的唯一id标识，在这些订单列表中是唯一
			sendOrder:function (orderid, obj, uniqueId){
				var parentClassName = obj.parentElement.className;	//获取当前触发的onclick div的父级元素的class 的 name
				if(parentClassName == 'text'){
					//在聊天窗口中点击的，那么调取原生直接进入订单详情页面
					kefu.extend.order.otherShow(orderid);
					return;
				}
				var order = kefu.extend.order.orderMap[uniqueId];
				msg.close();
				
				kefu.chat.sendPluginMessage(order, 'order');
			},
			//在第三方平台中，点击订单这个消息后打开的。 orderid 订单的id
			otherShow:function(orderid){
				if(typeof(window.webkit) != 'undefined' && typeof(window.webkit.messageHandlers) != 'undefined'){
					if(typeof(window.webkit.messageHandlers.appShowOrder.postMessage) == 'function'){
						window.webkit.messageHandlers.appShowOrder.postMessage(orderid);
					}
				}else{
					alert('待编写。这里应该是跳转到原生app的订单详情中进行查看');
				}
			}
		},
		/* 商品 */
		goods:{
			name:'商品',
			//chat:'<span onclick="">商品</span>',
			css:'./extend/goods/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完kefu.js后立马加载引入这里的css
			//初始化，kefu.js 加载完毕后会先引入指定路径的js，再执行此方法
			init:function(){

			},
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = kefu.extend.goods.getGoodsByTemplate(message.extend);
				return message;
			},
			/*
				商品图片 {image}
				商品名字 {name}
				商品价格 {price}
			*/
			template : `
				<!-- 弹出的商品发送 -->
			    <div class="extend_goods_item" onclick="kefu.extend.goods.sendGoods('{id}', this);">  
			        <img class="image" src="{image}" />
			        <div class="goodsInfo">
			            <div class="name">{name}</div>
			            <div class="priceDiv">
			            	<div class="price">{price}</div>
			            	<div class="sendButtonDiv"><button>发送商品</button></div></div>
			        </div>
			    </div>
			`,
			goods:{},
			getGoodsByTemplate : function (goods){
				return kefu.extend.goods.template
						.replace(/{id}/g, kefu.filterXSS(goods['id']))
						.replace(/{name}/g, kefu.filterXSS(goods['name']))
						.replace(/{price}/g, kefu.filterXSS(goods['price']))
						.replace(/{image}/g, kefu.filterXSS(goods['image']));
			},
			//发送商品
			sendGoods : function (goodsid, obj){
				var parentClassName = obj.parentElement.className;	//获取当前触发的onclick div的父级元素的class 的 name
				if(parentClassName == 'text'){
					//在聊天窗口中点击的，那么调取原生直接进入订单详情页面
					kefu.extend.goods.otherShow(goodsid);
					return;
				}

				if(goodsid != kefu.extend.goods.goods.id){
					msg.failure('商品id异常！');
				}
				msg.close();
				
				kefu.chat.sendPluginMessage(kefu.extend.goods.goods, 'goods');
			},
			//在第三方平台中，点击订单这个消息后打开的。 orderid 订单的id
			otherShow:function(goodsid){
				if(typeof(window.webkit) != 'undefined' && typeof(window.webkit.messageHandlers) != 'undefined'){
					//ios上用
					if(typeof(window.webkit.messageHandlers.appShowGoods.postMessage) == 'function'){
						window.webkit.messageHandlers.appShowGoods.postMessage(goodsid);
					}
				}else{
					alert('待编写。这里应该是跳转到原生app的商品详情中进行查看');
				}
			}
		}
	}
}

var socket = {
	url:'ws://xxxxxx',	//websocket链接的url，在 socket.connect时传入赋值
	socket:null,
	//连接成功时触发
	onopen:function(){
		socket.send(JSON.stringify({
	        'type': 'CONNECT' //第一次联通，登录
	        ,'token':kefu.token.get()
	    })); 
	},
	//监听收到的消息的function
	onmessage:function(res){ 
		var message = JSON.parse(res.data);
		message.text = kefu.getReceiveMessageText(message);
		kefu.cache.add(message);   //消息缓存
		
		if(kefu.mode == 'pc'){
			//pc
			
			kefu.ui.list.render();	//渲染list页面
			if(kefu.currentPage == 'chat'){
				//当前在chat,如果当前的chat沟通对象跟消息都是一个人，那么显示在当前chat
				if(message.sendId == kefu.chat.otherUser.id){
					kefu.ui.chat.appendMessage(message);    //聊天窗口增加消息
				}else{
					//不是这个人的，不再这个chat中显示消息
					console.log('不是这个人的，不再这个chat中显示消息');
				}
			}
		}else{
			//mobile模式，也就是要么在list页面，要么在chat页面
			
			if(kefu.currentPage == 'list'){
				//当前在list列表页
				kefu.ui.list.render();	//重新渲染页面
				//弹出新消息提醒
				msg.popups('<div class="listPopupsNewMessage" onclick="kefu.ui.chat.render(\''+message.sendId+'\');">您有新消息：<div style="padding-left:1rem">'+message.text+'</div></div>');
			}else{
				//当前在chat,如果当前的chat沟通对象跟消息都是一个人，那么显示在当前chat
				if(message.sendId == kefu.chat.otherUser.id || message.type == 'SYSTEM'){
					kefu.ui.chat.appendMessage(message);    //聊天窗口增加消息
				}else{
					//消息发送方跟当前chat聊天的用户不是同一个人，那么弹出个提醒吧
					msg.popups('<div onclick="kefu.ui.chat.render(\''+message.sendId+'\');">有新消息</div>');
				}
			}
		}
		
		//通知提醒
		kefu.notification.execute('您有新消息',message.text);
	},
	//连接
	connect:function(url){
		this.url = url;
		this.reconnect.connect();
		
		//socket断线重连
        var socketCloseAgainConnectInterval = setInterval(function(){
        	if(socket.socket.readyState == socket.socket.CLOSED){
                console.log('socketCloseAgainConnectInterval : socket closed , again connect ...');
                socket.reconnect.connect();
            }
        }, 3000);
	},
	//重新连接，主要用于断线重连
	reconnect:{
		connecting:false,	//当前websocket是否是正在连接中,断线重连使用
		//重新连接
		connect:function(){
			if(!this.connecting){
				console.log('socket connect ...');
				this.connecting = true;	//标记已经有socket正在尝试连接了
				socket.socket = new WebSocket(socket.url);
				socket.socket.onopen = function(){
					socket.onopen();
				};
				socket.socket.onmessage = function(res){
					//res为接受到的值，如 {"emit": "messageName", "data": {}}
					socket.onmessage(res);
				};
				this.connecting = false;
			}
		},
	},
	//发送消息
	send:function(text){
		if(this.socket.readyState == this.socket.OPEN){
			if(typeof(text) == 'object'){
				text = JSON.stringify(text);
			}
			this.socket.send(text);
		}else if(this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING){
			msg.info('socket 已关闭，正在开启重连');
			this.reconnect.connect();
			this.send(text);	//重新发送
		}
	}
}
