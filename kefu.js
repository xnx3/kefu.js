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
	var date = new Date(number);
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
	version:1.1, 	//当前kefu.js的版本
	api:{
		domain:'https://api.kefu.leimingyun.com/',				//domain域名，设置如 https://xxxxxxx.com/   前面要带协议 ，后面要带 /
		getMyUser:'/kefu/chat/user/init.json',			//获取当前用户，我自己的用户信息。传入如 http://xxxx.com/user/getMyUser.json
		getChatOtherUser:'/kefu/chat/zuoxi/getUserByZuoxiId.json',	//获取chat一对一聊天窗口中，当前跟我沟通的对方的用户信息。传入如 http://xxxx.com/user/getUserById.json 会自动携带当前登录用户的token、以及对方的userid
		getChatOtherUserByKefuChatid:'/kefu/chat/zuoxi/getUserByKefuChatId.json',	//通过kefu.chatid 来让客服后台自动分配一个当前在线的、且闲置的客服给用户。
		chatLog:'/kefu/chat/log/log.json',				//获取我跟某人的历史聊天记录列表的接口
		uploadImage:'/kefu/chat/file/uploadImage.json',			//图片上传接口
		uploadAudio:'/kefu/chat/file/uploadAudio.json',		//语音（录音）上传接口
		uploadFile:'/kefu/chat/file/uploadFile.json',		//文件上传接口
		//传入如  kefu.api.uploadImage ,返回请求的绝对路径。有时候用户只是设置了 domain，其他的接口都是用默认的，用这个获取，会自动拼接domain、path
		get:function(path){
			//判断是否是带有绝对路径的，如果是，直接原样返回
			if(path.indexOf('//') == 0 || path.indexOf('https://') == 0 || path.indexOf('http://') == 0){
				return path;
			}
			
			//没带有绝对路径，那么判断是否是为空，如果为空，那么也直接返回空
			if(path == null || kefu.api.domain.length < 1){
				return '';
			}
			
			//剩下一种可能就是相对路径了，进行domain组合
			return kefu.api.domain + path;
		}
	},
	user:{},	//当前用户信息，如： {"id":"youke_c302af1bb55de708a99fbc7266ddf016","nickname":"游客302a","head":"https://res.hc-cdn.com/cnpm-common-resource/2.0.2/base/header/components/images/logo.png","type":"youke"}
	currentPage:'list',	//当前所在哪个页面， 有 list 、 chat。 默认是list
	mode:'mobile',	//pc、mobile  两种模式。 pc模式是左侧是list、右侧是chat，  mobile是一栏要么是list要么是chat。  默认是mobile模式
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
		
		//获取聊天对方的用户信息
		kefu.getMyUser(function(data){
			kefu.user = data.user;
			kefu.user.otherUserId = data.otherUserId;
			kefu.socket.connect(kefu.socket.url);	//建立 socket 通讯
		});
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
	getMyUser:function(func){
		if(kefu.api.getMyUser == null || kefu.api.getMyUser.length < 1){
			msg.popups('请设置 kefu.api.getMyUser 接口，用于获取当前用户(我)的信息');
			return;
		}
		request.post(kefu.api.get(kefu.api.getMyUser),{token:kefu.token.get()}, function(data){
			kefu.user = data.user;
			if(typeof(func) == 'function'){
				func(data);
			}
		});
	},
	//过滤html标签，防XSS攻击
	filterXSS:function (text) {
		if(text == null){
			return null;
		}
		text = text.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
		text = text.replace(/[|]*\n/, '') //去除行尾空格
		text = text.replace(/&npsp;/ig, ''); //去掉npsp
		return text;
	},
	//获取图片的url，正常使用时图片路径可能是 //cdn.xxxx.com/a.jpg ，但是在本地测试时，就会自动加上 file: 导致图片破裂了。这个方法作用就是自动补上协议，如果是本地，那就补上http协议，让图片能正常显示
	getImageUrl:function(imgUrl){
		if(typeof(imgUrl) == 'undefined'){
			return '';
		}
		
		if(imgUrl.indexOf('http://') == 0 || imgUrl.indexOf('https://') == 0){
			//如果图片路径是正常带有协议的，那么直接原样返回
			return imgUrl;
		}
		
		//判断一下是否是以 // 开头的，如果不是，那么也是原样返回
		if(imgUrl.indexOf('//') != 0){
			return imgUrl;
		}
		
		//如果是自动补齐协议，那么就要判断一下是否是本地使用了
		if(window.location.protocol == 'file:'){
			//本地使用，那图片默认补上 http 协议
			return 'http:'+imgUrl;
		}
		
		//其他情况，直接原样返回
		return imgUrl;
	},
	//将[ul][li][br]等转化为html
	ubb:function(text){
		if(text == null || typeof(text) == 'undefined'){
			return '';
		}
		
		return text.replace(/\[ul\]/g, '<ul>')
			.replace(/\[\/ul\]/g, '</ul>')
			.replace(/\[li\]/g, '<li onclick="kefu.chat.question(this);" class="question">')
			.replace(/\[\/li\]/g, '</li>')
			.replace(/\[br\]/g, '<br>');
	},
	//客户端方面的，如判断是手机还是电脑
	client:{
		//判断当前是手机（包括平板）还是电脑访问。是手机访问，则返回true，否则返回false
		isMobile:function(){
			if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
		        return true;
		    }else{
		        return false;
		    }
		}
	},
	//获取接收到的消息的text内容。 msg:socket传过来的消息，会把这个消息进行处理，返回最终显示给用户看的消息体
	getReceiveMessageText:function(message){
		if(message.extend != null && message.extend.name != null){
			//如果是插件，判断 text 数据是否有数据，也就是text已经被赋予过了 
			if(message['text'] != null && message['text'].length < 0){
				//已经赋予过了，不需要再执行插件的 format方法
			}else{
				//将json变为插件显示的样式
				if(typeof(kefu.extend[message.extend.name]) != 'undefined' && typeof(kefu.extend[message.extend.name].format) == 'function'){
					//如果实现了 format 方法，则执行其
					message = kefu.extend[message.extend.name].format(message);
				}
			}
		}
		//将[ul][li][br]等转化为html
		message['text'] = kefu.ubb(message['text']);
		return message['text'];
	},
	//UI界面方面
	ui:{
		//颜色相关控制
		color:{
			// 默认蓝色， 键盘、鼠标、发送按钮
			shuruTypeColor:'#1296db',
			extendIconColor:'#808080',	//插件图标的颜色，在chat底部显示的插件图标。 16进制颜色编码
		},
		//图片
		images:{
			//chat底部的更多，chat底部的输入方式切换
			more:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603880506122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7418" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512.512 112.384c-219.6992 0-398.4896 178.7392-398.4896 398.4896 0 219.6992 178.7392 398.4896 398.4896 398.4896 219.6992 0 398.4896-178.7392 398.4896-398.4896s-178.7392-398.4896-398.4896-398.4896z m167.8848 424.0384H538.112v142.2848c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6v-142.2848H344.6784c-14.1312 0-25.6-11.4688-25.6-25.6s11.4688-25.6 25.6-25.6H486.912V342.9888c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v142.2848h142.2848c14.1312 0 25.6 11.4688 25.6 25.6s-11.4688 25.5488-25.6 25.5488z" fill="{color}" p-id="7419"></path></svg>',
			//键盘输入，chat底部的输入方式切换
			jianpan:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603880701592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10768" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M513.788813 938.289925c-113.566274 0-220.223734-44.167967-300.444149-124.388381-80.220415-80.220415-124.388382-186.877876-124.388382-300.44415s44.167967-220.227983 124.388382-300.448398c165.543834-165.548083 435.348714-165.548083 600.892548 0 165.548083 165.548083 165.548083 435.348714 0 600.892548-80.220415 80.220415-186.877876 124.388382-300.44415 124.388381z m0-785.973112c-92.538158 0-185.072066 35.453344-255.379651 105.756681-68.2001 68.204349-105.75668 158.63927-105.756681 255.3839s37.556581 187.175303 105.756681 255.379652c68.204349 68.2001 158.936697 106.054108 255.379651 105.75668 96.74888 0 187.179552-37.556581 255.379652-105.75668 140.912598-140.912598 140.912598-369.850954 0-510.759303-70.303336-70.307585-162.841494-105.75668-255.379652-105.756681z" p-id="10769" fill="{color}"></path><path d="M318.672199 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545228 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.738589c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM488.630705 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545229 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.73859c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM658.589212 341.705826h46.313693c11.047303 0 19.545228 8.497925 19.545228 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.738589c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695436v-46.738589c0-10.622407 8.497925-19.120332 19.120332-19.120332zM318.672199 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332H318.672199c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM488.630705 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.313693c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM658.589212 469.174705h46.313693c10.622407 0 19.120332 8.497925 19.120332 19.120332v46.313693c0 10.622407-8.497925 19.120332-19.120332 19.120332h-46.313693c-10.622407 0.424896-19.120332-8.073029-19.120332-18.695435v-46.73859c0-10.622407 8.497925-19.120332 19.120332-19.120332zM458.887967 660.378025h106.224066c17.420747 0 31.86722 14.446473 31.86722 31.86722s-14.446473 31.86722-31.86722 31.86722h-106.224066c-17.420747 0-31.86722-14.446473-31.86722-31.86722s14.446473-31.86722 31.86722-31.86722z" p-id="10770" fill="{color}"></path></svg>',
			//叉号，错误符号
			close:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1604403666528" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="1161" fill="{color}"></path></svg>',
		},
		list:{
			renderAreaId:'',		//渲染区域的id，如果不赋值，那么默认就是渲染到body
			listItemTemplate:'', //当list页面渲染出来后，这里自动从html中取
			html:`
				<section id="chatlist">

			        <section class="item" onclick="kefu.ui.chat.entry('{id}');">
			            <div class="head" style="background-image: url({head});"></div>
			            <div>
			                <div class="nickname">
			                    <span class="time">{time}</span>
			                    {nickname}
			                </div>
			                <div>
			                    <span class="num">{read}</span>
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
				//消息是否已读
				var read = '';
				if(typeof(item['read']) != 'undefined'){
					if(!item['read']){
						read = '<div>&nbsp;</div>'; 
					}
				}
			    return kefu.ui.list.listItemTemplate
			            .replace(/{id}/g, item['id'])
			            .replace(/{text}/g, item['text'])
			            .replace(/{nickname}/g, item['nickname'])
			            .replace(/{head}/g, kefu.getImageUrl(item['head']))
			            .replace(/{time}/g, formatTime(item['time'], 'M-D h:m'))
			            .replace(/{read}/g, read);
			},
			render:function(){
				if(kefu.ui.list.renderAreaId.length > 0){
					//有设置渲染区域，那么渲染到设置的id上
					if(document.getElementById(kefu.ui.list.renderAreaId) != null){
						document.getElementById(kefu.ui.list.renderAreaId).innerHTML = kefu.ui.list.html;
					}
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
			    if(html == ''){
			    	//还没有聊天记录
			    	html = '<div class="not_hostory_list">当前还没有沟通记录</div>';
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
			},
			//进入list页面，打开list页面。如从chat聊天页面，点击左上角返回按钮，跳转到list列表页面中，就是点击返回按钮触发的此方法。
			entry:function(){
				kefu.currentPage = 'list';
				kefu.ui.list.render();
			}
		},
		
		chat:{
			renderAreaId:'',		//渲染区域的id，如果不赋值，那么默认就是渲染到body
			html:`
				<div id="mobile">
					<header class="chat_header" id="head">
				        <div class="back" id="back" onclick="kefu.ui.list.entry();">&nbsp;</div>
				        <div class="title" id="title"><span id="nickname">在线咨询</span><span id="onlineState">在线</span></div>
				    </header>
					<div id="newMessageRemind">
						<div id="newMessageRemindText"><!-- 新消息：消息内容消息内容 --></div>
						<div id="newMessageRemindClose" onclick="document.getElementById('newMessageRemind').style.display='none';">X</div>
					</div>
					
				    <section id="chatcontent" onclick="kefu.chat.switchToJianpanShuruType();">
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
				</div>
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
				if(message != null && typeof(message.text) != 'undefined' && message.text != ''){
					//已经有显示出来的消息内容了，那可以直接显示出来
				}else{
					//没有直接显示出来的消息内容，需要正则一下，赋予 message.text 消息内容
					message['text'] = kefu.getReceiveMessageText(message);
				}
				
			    //发送文本消息后绘制对话窗口
			    var section = document.createElement("section");
			    //要用kefu.chat.otherUser来判断，不能用 kefu.user, kefu.user 异步获取，有可能kefu.user 还没获取到
			    if(message['receiveId'] == kefu.chat.otherUser.id){
			        //是自己发送的这条消息，那么显示在右侧
			        section.className = 'chat user '+message['type'];
			        section.innerHTML = '<div class="head"></div><div class="sanjiao"></div><div class="text">'+kefu.ubb(message['text'])+'</div>';
			    }else if(message['sendId'] == kefu.chat.otherUser.id){
			        //是自己接受的这个消息，那么显示在左侧
			        section.className = 'chat otherUser '+message['type'];
			        section.innerHTML = '<div class="head" style="background-image: url('+kefu.getImageUrl(kefu.chat.otherUser.head)+');"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
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
				kefu.ui.chat.scrollToBottom();
			},
			//新消息提醒，当我跟A用户一对一聊天时，恰好B用户给我发送消息了，这时要在当前的chat一对一聊天页面中，显示B用户给我发送消息的提示，提醒用户B用户也给我发消息了。
			//message:接收到的消息对象，json对象。这里message.text已经是可以显示给用户的消息内容，已经处理好了，直接调用显示即可。
			newMessageRemind:function(message){
				kefu.cache.getUser(message.sendId, function(user){
					var remindTextDiv = document.getElementById('newMessageRemindText');
					remindTextDiv.innerHTML = user.nickname + ' : ' + message.text;
					remindTextDiv.onclick = function(){
						//点击后跳转到跟这个人的聊天窗口中对话。
						kefu.ui.chat.render(message.sendId);
					};
					//显示这条消息
					document.getElementById('newMessageRemind').style.display = 'block';
				});
			},
			//文字输入框被点击，隐藏扩展功能区域,已废弃，有 kefu.chat.switchToJianpanShuruType() 代替
			textInputClick:function (){
				//隐藏扩展功能输入区域
//				document.getElementById('inputExtend').style.display = '';
//				document.getElementById('inputExtendShowArea').style.display = 'none';
//				if(kefu.chat.shuruType != 'jianpan'){
//					kefu.chat.shuruTypeChange();
//				}
				//切换到键盘输入方式
				kefu.chat.switchToJianpanShuruType();
			},
			//渲染出chat一对一聊天页面。 otherUserId跟我聊天的对方的userid
			render:function(otherUserId){
				if(kefu.ui.list.renderAreaId.length > 0){
					//有设置渲染区域，那么渲染到设置的id上
					if(document.getElementById(kefu.ui.chat.renderAreaId) != null){
						document.getElementById(kefu.ui.chat.renderAreaId).innerHTML = kefu.ui.chat.html;
					}
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
			    	if(data.result == 0){
			    		//接口返回失败响应，弹出失败提示
			    		msg.failure(data.info);
			    		return;
			    	}
			    	
			        //设置网页聊天窗title 的对方昵称
					document.getElementById('nickname').innerHTML = kefu.chat.otherUser.nickname;
					//对方在线状态
			        document.getElementById('onlineState').innerHTML = data.onlineState;
			        if(document.getElementById('otherUserHead') != null){
			        	//聊天窗口中对方用户的头像
			        	document.getElementById('otherUserHead').src = kefu.getImageUrl(data.user.head);
			        }
			        
			        //将对方用户发言的头像换为接口拉取的真实头像。如果当前chat模板中显示头像的话
			        try{
			        	var heads = document.getElementsByClassName("otherUser");
				        for(var i = 0; i < heads.length; i++){
				        	heads[i].getElementsByClassName("head")[0].style.backgroundImage = 'url(\''+kefu.getImageUrl(kefu.chat.otherUser.head)+'\')';
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
			        //拉取对方设置的自动回复欢迎语
			        var autoReplyInterval = setInterval(function(){
			            if(typeof(kefu.chat.otherUser.id) != 'undefined' && kefu.user != null && typeof(kefu.user.id) != 'undefined'){
			            	if(typeof(kefu.socket.socket) != 'undefined' && kefu.socket.socket != null && kefu.socket.socket.readyState == kefu.socket.socket.OPEN){
			            		//socket也已经打开了
			            		//拉对方的自动回复欢迎语
			            		kefu.socket.send(JSON.stringify({
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
			},
			//进入chat页面，打开chat页面。如从list列表页面中，点击某项打开跟某人的chat聊天窗口，点击触发的就是这个。
			//传入userid，字符串类型，跟谁聊天，就传入谁的userid
			entry:function(userid){
				kefu.currentPage = 'chat';
				kefu.ui.chat.render(userid);
				//从list中标记这个用户的聊天已经全部看过了，将未读消息变为已读消息
				var cacheList = kefu.cache.getChatList();
				var message = null;
				for(var i = cacheList.length; i >= 0; i--){ 
					if(typeof(cacheList[i]) != 'undefined' && userid == cacheList[i].id){
						message = cacheList[i];
					}
				}
				if(message != null){
					//如果这个chat窗口在list中有缓存消息，那么将其中的read变为已读
					if(!message.read){
						message.read = true;
						kefu.cache.getUser(userid, function(user) {
							kefu.cache.pushChatList(user, message);
							if(kefu.mode == 'pc'){
								//如果是pc模式，那么还要刷新list
								kefu.ui.list.render();
							}
						})
					}
				}
			},
			//PC端chat专用
			pc:{
				html : `
					<div id="pc">    	
						<header class="chat_header" id="head">
							<div class="back" id="back" onclick="kefu.ui.list.entry();">&nbsp;</div>
							<div class="title" id="title">
								<img src="https://res.weiunity.com/kefu/images/head.png" id="otherUserHead" />
								<div id="headNameState">
									<div id="nickname">在线咨询</div>
									<div id="onlineState">在线</div>
								</div>
							</div>
							<div id="windowControl">
								<div id="close" onclick="kefu.ui.chat.pc.close();">&nbsp;</div>
							</div>
						</header>
						<div id="newMessageRemind">
							<div id="newMessageRemindText"><!-- 新消息：消息内容消息内容 --></div>
							<div id="newMessageRemindClose" onclick="document.getElementById('newMessageRemind').style.display='none';">X</div>
						</div>
						
						<section id="chatcontent" onclick="kefu.ui.chat.pc.switchToJianpanShuruType();">
						</section>
						
						<footer id="chat_footer">
						    <div id="input_area">
						    	<div id="inputExtend">
						            <!-- 其他，如图片、商品、订单 -->
						
						        </div>
						        <div id="inputExtendShowArea">
						            <!-- inputExtend的显示区域，如表情的显示 -->
						        </div>
						        <div id="textInput">
						        	<div id="shuruType" onclick="kefu.chat.shuruTypeChange();"><!--输入方式--></div>
						            <!-- 键盘输入 -->
						            <div id="text" contenteditable="true" onclick="kefu.ui.chat.pc.switchToJianpanShuruType();"></div>
						        </div>
						        <div id="footerButton">
						        	<div id="copyright" onclick="window.open('http://www.kefu.zvo.cn');">power by 雷鸣云客服</div>
						        	<button class="send" onclick="kefu.ui.chat.pc.close();">关&nbsp;闭</button>
						        	<input type="submit" value="发&nbsp;送" class="send" id="sendButton" onclick="kefu.chat.sendButtonClick(); kefu.ui.chat.pc.switchToJianpanShuruType();">
						        </div>
						    </div>
						</footer>
					</div>
					`,
				//关闭chat窗口
				close:function(){
					document.getElementById('pc').parentNode.removeChild(document.getElementById('pc'));
					kefu.ui.list.entry();
				},
				//切换到正常键盘输入方式，也就是如果之前使用了表情，出现了表情选择，执行这个后就会将表情选择关掉，还原回刚打开聊天界面时的输入方式
				switchToJianpanShuruType:function(){
					//先切换到键盘输入方式
					kefu.chat.shuruType = 'more';
					kefu.chat.switchToJianpanShuruType();
					//在更改为插件输入方式
					kefu.chat.shuruTypeChange();
					//再切换一次到键盘输入方式
					kefu.chat.switchToJianpanShuruType();
				},
				//初始化pc端客服坐席
				init:function(){
					kefu.mode='pc';
					kefu.ui.list.renderAreaId = 'list';
					kefu.ui.chat.renderAreaId = 'chat';
					kefu.ui.chat.html = kefu.ui.chat.pc.html;
					
					/* pc chat */
					kefu.extend.pc={
						initChat:function(){
							kefu.chat.shuruType = 'jianpan'
							kefu.chat.shuruTypeChange();
							
							kefu.ui.chat.pc.moveInit();	//鼠标移动
							//kefu.ui.chat.pc.sizeChange.moveInit();	//拖动大小
							document.getElementById('close').innerHTML = kefu.ui.images.close.replace(/{color}/g,kefu.ui.color.extendIconColor);
						}
					};
					
					/*不再pc端显示订单输入*/
					kefu.extend.order.icon = null;
					kefu.extend.order.sendOrder=function(str, obj, str2){};
					/* 商品相关 */
					kefu.extend.goods.sendGoods=function(str,obj){};
					
					/* 重写 图片插件的放大方法 */
					kefu.extend.image.fullScreen = function(imagesUrl){
						window.open(imagesUrl);
					}
					
					//kefu.js 初始化
					kefu.init();
				},
//				//打开一个聊天窗口，比如可用于网站漂浮的在线客服，点击图标后打开chat聊天窗口
//				chat:function(userid){
//					//kefu.ui.chat.pc.init();
//					kefu.ui.chat.entry('403');
//				},
				chatWindowDiv : null, //chat窗口的dom
				chatHeadWindowDiv:null,	//chat窗口头部的dom，拖动头部进行拖动chat窗口
				x : 0,
				y : 0,
				left : 0,
				top : 0,
				isDown:false,
				
				
				//拖动改变大小
				sizeChange:{
					currentX:0,
					currentY:-1,	//上一次鼠标移动的鼠标在屏幕的y坐标
					chatWindowHeight:0,	//上一次的chat窗口高度
					height_chat_content_size:0,	//chat窗口高度-content聊天区域的高度等于多少
					moveInit:function(){
						var chatWindows = document.getElementById('pc');
						//var chatWindowsHeight = (chatWindows.offsetHeight+chatWindows.borderTop+chatWindows.borderBottom);
						var chatWindowsHeight = chatWindows.offsetHeight;
						//chatWindows.style.height =  chatWindowsHeight+'px';
			        	
						var contentWindows = document.getElementById('chatcontent');
						//var contentWindowsHeight = (contentWindows.offsetHeight+contentWindows.borderTop+contentWindows.borderBottom);
						var contentWindowsHeight = contentWindows.offsetHeight;
						//contentWindows.style.height = contentWindowsHeight+'px';
						
						console.log('chatWindowsHeight:'+chatWindowsHeight+", contentWindowsHeight:"+contentWindowsHeight)
						kefu.ui.chat.pc.sizeChange.height_chat_content_size = chatWindowsHeight - contentWindowsHeight; 
						//缩放效果
						var father = document.body;
						var scale = document.getElementById('footerButton');
					    scale.onmousedown = function (e) {
					      // 阻止冒泡,避免缩放时触发移动事件
					      e.stopPropagation();
					      e.preventDefault();
					      let pos = {
					        'w': kefu.ui.chat.pc.chatWindowDiv.offsetWidth,
					        'h': kefu.ui.chat.pc.chatWindowDiv.offsetHeight,
					        'x': e.clientX,
					        'y': e.clientY
					      };
					      father.onmousemove = function (ev) {
					        ev.preventDefault();
					        // 设置图片的最小缩放为30*30
					        let w = Math.max(300, ev.clientX - pos.x + pos.w)
					        let h = Math.max(300, ev.clientY - pos.y + pos.h)
					        //console.log("ev.clientY:"+ev.clientY+" , pos.y:"+pos.y+" , pos.h:"+pos.h);
					        h = pos.h;
					        var yuanheight =pos.h; 
					        
					        // 设置图片的最大宽高
					        w = w >= father.offsetWidth - kefu.ui.chat.pc.chatWindowDiv.offsetLeft ? father.offsetWidth - kefu.ui.chat.pc.chatWindowDiv.offsetLeft : w
					        //h = h >= father.offsetHeight - kefu.ui.chat.pc.chatWindowDiv.offsetTop ? father.offsetHeight - kefu.ui.chat.pc.chatWindowDiv.offsetTop : h
					        h=father.offsetHeight - kefu.ui.chat.pc.chatWindowDiv.offsetTop;
					        //console.log("w:"+w+", h:"+h);
					        
					        if(kefu.ui.chat.pc.sizeChange.currentY > 0){
					        	var height= kefu.ui.chat.pc.sizeChange.chatWindowHeight - (kefu.ui.chat.pc.sizeChange.currentY - ev.clientY) ;
					        	console.log((kefu.ui.chat.pc.sizeChange.currentY - ev.clientY)+", height:"+height);
					        	kefu.ui.chat.pc.chatWindowDiv.style.height = height + 'px';
					        	kefu.ui.chat.pc.sizeChange.chatWindowHeight = height;
					        	document.getElementById('chatcontent').style.height = (height-kefu.ui.chat.pc.sizeChange.height_chat_content_size)+'px';
					        }else{
					        	kefu.ui.chat.pc.sizeChange.chatWindowHeight = kefu.ui.chat.pc.chatWindowDiv.offsetHeight;
					        }
					        kefu.ui.chat.pc.chatWindowDiv.style.width = w + 'px';
					        
					        kefu.ui.chat.pc.sizeChange.currentY = ev.clientY;
					      }
					      father.onmouseleave = function () {
					        father.onmousemove = null;
					        father.onmouseup = null;
					      }
					      father.onmouseup = function () {
					        father.onmousemove = null;
					        father.onmouseup = null;
					      }
					    }
					    
					}
				},
				//鼠标点击移动、放大缩小的初始化
				moveInit:function(){
					kefu.ui.chat.pc.chatWindowDiv = document.getElementById('pc');
					kefu.ui.chat.pc.chatHeadWindowDiv = document.getElementById('head');
					
					//鼠标按下事件
					kefu.ui.chat.pc.chatHeadWindowDiv.onmousedown = function(e) {
					    //获取x坐标和y坐标
						kefu.ui.chat.pc.x = e.clientX;
						kefu.ui.chat.pc.y = e.clientY;

					    //获取左部和顶部的偏移量
					    kefu.ui.chat.pc.left = kefu.ui.chat.pc.chatHeadWindowDiv.offsetLeft;
					    kefu.ui.chat.pc.top = kefu.ui.chat.pc.chatHeadWindowDiv.offsetTop;
					    //开关打开
					    kefu.ui.chat.pc.isDown = true;
					    //设置样式  
					    kefu.ui.chat.pc.chatHeadWindowDiv.style.cursor = 'move';
					};
					//鼠标移动
					window.onmousemove = function(e) {
					    if (kefu.ui.chat.pc.isDown == false) {
					        return;
					    }
					    //获取x和y
					    var nx = e.clientX;
					    var ny = e.clientY;
					    //计算移动后的左偏移量和顶部的偏移量
					    var nl = nx - (kefu.ui.chat.pc.x - kefu.ui.chat.pc.left);
					    var nt = ny - (kefu.ui.chat.pc.y - kefu.ui.chat.pc.top);
					    kefu.ui.chat.pc.chatWindowDiv.style.marginLeft = nl + 'px';
					    kefu.ui.chat.pc.chatWindowDiv.style.marginTop = nt + 'px';
					};
					//鼠标抬起事件
					kefu.ui.chat.pc.chatHeadWindowDiv.onmouseup = function() {
					    //开关关闭
						kefu.ui.chat.pc.isDown = false;
					    kefu.ui.chat.pc.chatHeadWindowDiv.style.cursor = 'default';
					};
					
				}
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
		 * @param chatid 当前谁在跟谁聊天，对方的chatid。 如果是正常的坐席id，那么这里是32位uuid，如果是kefu.chatid，那么这里是 kefuchatid_ + 32位uuid
		 * @param func 获取到对方的用户信息后，要执行的方法
		 */
		getOtherUser:function(chatid, func){
			var gainApiUrl = '';
			if(chatid.indexOf('kefuchatid_') == 0){
				//是kefu.chatid
				if(kefu.api.getChatOtherUserByKefuChatid == null || kefu.api.getChatOtherUserByKefuChatid.length < 1){
					msg.popups('请设置 kefu.api.getUserByKefuChatId 接口，用于获取分配的客服坐席');
					return;
				}
				gainApiUrl = kefu.api.get(kefu.api.getChatOtherUserByKefuChatid);
			}else{
				//是正常的chatid
				if(kefu.api.getChatOtherUser == null || kefu.api.getChatOtherUser.length < 1){
					msg.popups('请设置 kefu.api.getChatOtherUser 接口，用于获取跟我沟通的对方的信息');
					return;
				}
				gainApiUrl = kefu.api.get(kefu.api.getChatOtherUser);
			}
			
			request.post(gainApiUrl,{token:kefu.token.get(), id:chatid}, function(data){
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
				//先设置输入方式是more，然后切换一次，切换回键盘输入
				kefu.chat.shuruType = 'more';
				kefu.chat.shuruTypeChange();
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
				request.post(kefu.api.get(kefu.api.chatLog),{token:kefu.token.get(),otherId:kefu.chat.otherUser.id, time:kefu.chat.chatMessageStartTime, type:'before'}, function(data){
					kefu.chat.currentLoadHistoryList = false;	//标记请求历史记录已请求完成，可以继续请求下一次聊天记录了

					var chatcontent = document.getElementById('chatcontent');
					//删除聊天记录加载中的提示
					chatcontent.removeChild(document.getElementById('historyListLoading'));
					//删除聊天记录加载中的提示section后，取第一个正常聊天沟通的section，用来作为插入的定位
					var firstItem = chatcontent.getElementsByTagName("section")[0];

					if(data.result == '0'){
						//如果失败了，那么就删掉绑定的滚动条监控，避免死循环一直请求
						document.getElementById('chatcontent').onscroll = function(){}
						//失败，弹出提示
						msg.failure(data.info);
					}else if(data.result == '1'){
						//成功
						//判断一下请求到的消息记录有多少条

						if(data.number > 0){
							//有消息记录，那么绘制出来
							for(var i = data.list.length-1; i >= 0; i--){
								var message = data.list[i];
								message.from = 'hostory';
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
			text = text.replace(/\n/g,'[br]');	//将用户输入的换行替换为[br]
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
		    kefu.socket.send(message);       //socket发送
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
				data.name = name;
			}else{
				data = {};
			}
			
			//接收人chatid
			var receivdId = '';
			if(kefu.chat.otherUser != null && typeof(kefu.chat.otherUser.id) != 'undefined'){
				receivdId = kefu.chat.otherUser.id;
			}else{
				receivdId = null;
			}
			
			//组合后的消息体
			var message = {
				token:kefu.token.get(),
				receiveId:receivdId,
				sendId:kefu.user.id,
				type:'EXTEND',
				time:new Date().getTime(),
				extend:data
			};
			//更新聊天窗口
			if(kefu.extend[name] != null && typeof(kefu.extend[name]) == 'undefined' && typeof(kefu.extend[name]).format != 'undefined'){
				message.text = kefu.extend[name].format(message);
			}else{
				console.log('提示: '+name+'插件中， format 方法未实现，那么聊天消息体中这个插件的消息将不会出现。如果你想这个插件发送的消息能出现在聊天窗口中，请重写实现这个插件的 format 方法。可参考文档：  https://gitee.com/leimingyun/dashboard/wikis/leimingyun/kefujs-api-interface-of/preview?sort_id=3663420&doc_id=1274007');
			}
			
			kefu.ui.chat.appendMessage(message);
			
			//socket发送消息
			message.text = '';	//清理掉message.text 因为这个本来就是自动生成出来的不必额外占用带宽、流量
			kefu.socket.send(message);

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
				document.getElementById('shuruType').innerHTML = kefu.ui.images.jianpan.replace(/{color}/g,kefu.ui.color.shuruTypeColor);
				
				//更多输入放大
				var inputExtendHtml = '';
				for(var key in kefu.extend){
				    if(kefu.extend[key].icon != null && kefu.extend[key].icon.length > 0){
				    	inputExtendHtml = inputExtendHtml + 
					    	'<div class="item" onclick="kefu.extend[\''+key+'\'].onclick();"><div class="iconButton">'+(kefu.extend[key].icon.replace(/{color}/g, kefu.ui.color.extendIconColor))+'</div><div class="iconName">'+kefu.extend[key].name+'</div></div>'; 
				    }
				}
				document.getElementById('inputExtend').innerHTML = inputExtendHtml;
				//显示扩展功能栏
				document.getElementById('inputExtend').style.display = '';
				
				//显示 插件内容显示的区域，如表情插件显示出来的表情选择所在的区域
				document.getElementById('inputExtendShowArea').style.display = '';
			}else{
				//当前是更多输入，切换到键盘输入方式
				kefu.chat.shuruType = 'jianpan';
				document.getElementById('shuruType').innerHTML = kefu.ui.images.more.replace(/{color}/g,kefu.ui.color.shuruTypeColor);;
				
				//清空掉插件内容显示的区域，如表情插件显示出来的表情选择所在的区域，将表情列表清空掉
				document.getElementById('inputExtendShowArea').innerHTML = '';
				
				//更多简化缩小
				var inputExtendHtml = '';
				for(var key in kefu.extend){
					if(kefu.extend[key].icon != null && kefu.extend[key].icon.length > 0){
						inputExtendHtml = inputExtendHtml + '<span class="smallIcon" onclick="kefu.extend[\''+key+'\'].onclick();">'+ (kefu.extend[key].icon.replace(/{color}/g, kefu.ui.color.extendIconColor)) + '</span>';
				    }
				}
				document.getElementById('inputExtend').innerHTML = '<div class="extendSmallIcon">'+inputExtendHtml+'</div>';
			}
		},
		//切换到键盘输入类型
		switchToJianpanShuruType(){
			//设置底部的输入方式切换
			if(document.getElementById('shuruType') == null){
				return;
			}
			if(kefu.chat.shuruType != 'jianpan'){
				//如果当前不是键盘输入，那么触发执行输入类型改变
				this.shuruTypeChange();
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
			if(otherUserId != '0' && otherUserId.length > 0){
				message['from'] = 'cache';

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
				//判断一下当天保存的消息，是否是 kefu.chat.otherUser 这个人的，如果不是，那么要重新拉取message.sendId 这个用户的信息
				if(kefu.chat.otherUser != null && kefu.chat.otherUser.id != null && kefu.chat.otherUser.id == otherUserId){
					kefu.cache.pushChatList(kefu.chat.otherUser, message);
				}else{
					//不是这个人的，那么用getUser来取用户信息
					kefu.cache.getUser(otherUserId, function(user) {
						kefu.cache.pushChatList(user, message);
					})
				}
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
		        text = kefu.extend[message.extend.name].name;
		    }

			//组合新的消息
			var newMessage = {
				id:otherUser.id,	//对方的userid
				text:text,		//最后一次沟通的内容
				nickname:otherUser.nickname,	//对方的昵称
				head:kefu.getImageUrl(otherUser.head), 	//对方的头像
				time:message.time, 			//消息产生的时间。
				read:message.read		//消息是否已读
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
		/*
		 * 通过userid，获取这个用户的其他信息。
		 * @param userid 要获取的是哪个用户的信息
		 * @param func 获取到这个用户信息后，要执行的方法。传入 function(user){ console.log(user); }
		 * @return 如果缓存中有这个用户的信息，那么直接返回这个user对象。 如果没有，那么返回null。 这个返回值大多数情况用不到，都是使用 func 进行处理的
		 */
		getUser:function(userid, func){
			var user;
			var cache_key = 'user_id_'+userid;
			var userStr = kefu.storage.get(cache_key);
			if(userStr == null || userStr.length < 1){
				//从网络获取
				request.send(kefu.api.get(kefu.api.getChatOtherUser),{token:kefu.token.get(), id:userid}, function(data){
					//请求完成
					if(data.result == '1'){
						user = data.user;
						kefu.storage.set(cache_key, JSON.stringify(data.user));
						if(func != null){
							func(user);
						}
					}else{
						console.log('kefu.api.getChatOtherUser 获取异常：'+data.info);
					}
				},'post', true, {'content-type':'application/x-www-form-urlencoded'}, function(xhr){
					//异常
					console.log('kefu.cache.getUser() 异常：');
					console.log(xhr);
				})
				
			}else{
				user = JSON.parse(userStr);
				func(user);
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
				
				//标记当前正在使用扩展的输入方式，而非键盘输入方式了
				kefu.chat.shuruType = 'more';
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
				message.text = kefu.extend.image.template.replace(/{url}/g, kefu.filterXSS(kefu.getImageUrl(message.extend.url)));
				return message;
			},
			onclick:function(){
				//添加input改动监听
				if(document.getElementById('imageInput').oninput == null){
					document.getElementById('imageInput').oninput = function(e){
					    if(typeof(e.srcElement.files[0]) != 'undefined'){
					        var file = e.srcElement.files[0];
					        msg.loading('上传中');
					        request.upload(kefu.api.get(kefu.api.uploadImage), {token:kefu.token.get()}, file,function(data){
					            msg.close();
					            if(data.result == '1'){
					            	//组合extend的消息体
					            	var extend = {
					            			url:kefu.getImageUrl(data.url)
					            	};
					            	kefu.chat.sendPluginMessage(extend, 'image');
					            	
					            	//切换到键盘输入方式
					            	kefu.chat.switchToJianpanShuruType();
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
					width:'95%',
					opacity:100,
					padding:'1px'
				});
			}
		},
		/* 语音，录音 */
		luyin : {
		    name:'语音',	//插件的名字
		    icon:'<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="598"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0ZM681.514667 494.016c1.706667 0 3.370667 0.149333 5.205333 0.426667a30.144 30.144 0 0 1 24.32 34.837333 203.093333 203.093333 0 0 1-170.602667 165.610667v68.138666c0 16.64-13.333333 30.037333-29.930666 30.037334h-1.109334c-16.170667-0.554667-28.8-14.378667-28.8-30.741334v-67.861333a202.944 202.944 0 0 1-167.637333-165.184 32.682667 32.682667 0 0 1-0.426667-5.226667c0-16.64 13.354667-30.037333 29.930667-30.037333 14.613333 0 26.986667 10.709333 29.504 25.109333a142.613333 142.613333 0 0 0 114.944 115.392c77.269333 13.952 151.189333-37.802667 165.098667-115.413333a30.293333 30.293333 0 0 1 29.504-25.088z m-171.84-263.082667c56.490667 0 102.293333 45.994667 102.293333 102.698667v155.861333c0 56.704-45.802667 102.698667-102.293333 102.698667s-102.293333-45.994667-102.293334-102.698667V333.653333c0-56.704 45.802667-102.698667 102.293334-102.698666z" p-id="599" fill="{color}"></path></svg>', //插件的图标，一定要用这种svg格式的。
		    js:'https://res.weiunity.com/kefu/extend/luyin/luyin.js',
		    onclick:function(){
				try{
					HZRecorder.get(function (rec) {
						kefu.extend.luyin.recorder = rec;
						kefu.extend.luyin.recorder.start();
					});
				}catch(e){
					console.log(e); 
					return;
				}
		        msg.popups({
					text:`
						<div onclick="kefu.extend.luyin.startLuyin(this);" style=" width: 100%; text-align: center; margin-left: 0.15rem; padding-top: 0.5rem; -webkit-touch-callout:none;  -webkit-user-select:none; -khtml-user-select:none;  -moz-user-select:none; -ms-user-select:none; user-select:none;" >
							<div style="padding-top: 0.5rem;" id="kefu_extend_luyin_svg"><svg style="width: 4rem;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6364"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0ZM681.514667 494.016c1.706667 0 3.370667 0.149333 5.205333 0.426667a30.144 30.144 0 0 1 24.32 34.837333 203.093333 203.093333 0 0 1-170.602667 165.610667v68.138666c0 16.64-13.333333 30.037333-29.930666 30.037334h-1.109334c-16.170667-0.554667-28.8-14.378667-28.8-30.741334v-67.861333a202.944 202.944 0 0 1-167.637333-165.184 32.682667 32.682667 0 0 1-0.426667-5.226667c0-16.64 13.354667-30.037333 29.930667-30.037333 14.613333 0 26.986667 10.709333 29.504 25.109333a142.613333 142.613333 0 0 0 114.944 115.392c77.269333 13.952 151.189333-37.802667 165.098667-115.413333a30.293333 30.293333 0 0 1 29.504-25.088z m-171.84-263.082667c56.490667 0 102.293333 45.994667 102.293333 102.698667v155.861333c0 56.704-45.802667 102.698667-102.293333 102.698667s-102.293333-45.994667-102.293334-102.698667V333.653333c0-56.704 45.802667-102.698667 102.293334-102.698666z" p-id="6365" fill="#eeeeee"></path></svg></div>
							<div style="font-size: 0.9rem; padding-top: 1.3rem;" id="kefu_extend_luyin_text">点击开始录音</div>
						</div>`, 
					width:'8rem',
					height:'10rem'
				});
		    },
			format:function(message){
				message.text = '<audio src="'+kefu.filterXSS(message.extend.url)+'" controls="controls" style="max-width: 100%;">您的浏览器不支持 audio 标签。</audio>';
				return message;
			},
			recorder:null,
			//开始录音
			startLuyin:function(obj){
				obj.onclick=function(){
					kefu.extend.luyin.stopAndSend();
				};
				//弹出黑窗的关闭按钮，点击关闭将不在录音
				if(document.getElementsByClassName('msg_close').length > 0){
					document.getElementsByClassName('msg_close')[0].onclick=function(){
						kefu.extend.luyin.recorder.stop();
						msg.close();
					}
				}
				//onmouseup="console.log('up'); kefu.extend.luyin.stopAndSend();" 
				document.getElementById('kefu_extend_luyin_text').innerHTML = '录音中...<br/>点击结束录音';
				document.getElementById('kefu_extend_luyin_text').style.paddingTop = '0.8rem';
				document.getElementById('kefu_extend_luyin_svg').innerHTML = `<svg style="width: 4rem;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7813"><path d="M513.97099632 1.80950267C232.79247314 1.80950267 4.54496541 230.05700825 4.54496541 511.23553144s228.24750558 509.42602875 509.42603091 509.42603087 509.42602875-228.24750558 509.42602873-509.42603087c-0.28005843-281.4585816-228.24750558-509.42602875-509.42602873-509.42602877z m-215.6448843 558.15617188c0 15.4032057-14.28297193 27.44571227-32.48676208 27.44571225s-30.52635298-12.32256502-30.52635295-30.52635298v-92.13917796c0-15.4032057 12.32256502-30.52635298 30.52635295-30.52635298 15.4032057 0 32.48676209 12.32256502 32.48676208 30.52635298v95.21981869z m123.78576476 73.93538784c0 18.20378796-14.28297193 30.52635298-32.48676209 30.52635515s-30.52635298-12.32256502-30.52635298-30.52635515v-245.61112036c0-15.4032057 12.32256502-30.52635298 30.52635298-30.52635296 15.4032057 0 32.48676209 12.32256502 32.48676209 30.52635296v245.61112036z m122.94558938 61.61282502c0 18.20378796-12.32256502 30.52635298-30.52635511 30.52635298s-30.52635298-12.32256502-30.52635301-30.52635298V326.67711915c0-15.4032057 12.32256502-30.52635298 30.52635301-30.52635298 15.4032057 0 30.52635298 12.32256502 30.52635511 30.52635298v368.83676826z m124.6259379-61.61282502c0 18.20378796-12.32256502 30.52635298-30.52635297 30.52635515s-30.52635298-12.32256502-30.52635298-30.52635515v-245.61112036c0-15.4032057 12.32256502-30.52635298 30.52635298-30.52635296 15.4032057 0 30.52635298 12.32256502 30.52635297 30.52635296v245.61112036z m122.66553098-73.93538784c0 15.4032057-12.32256502 27.44571227-30.52635299 27.44571225s-30.52635298-12.32256502-30.52635297-30.52635298v-92.13917796c0-15.4032057 12.32256502-30.52635298 30.52635297-30.52635298 15.4032057 0 30.52635298 12.32256502 30.52635299 30.52635298v95.21981869z" fill="#eeeeee" p-id="7814"></path></svg>`; 
				
				kefu.extend.luyin.recorder.start();
			},
			//结束录音并发送语音
			stopAndSend:function(){
				kefu.extend.luyin.recorder.stop();    //结束录音
				msg.loading('发送中');
				
				
				//获取音频文件
				var fd = new FormData();
				fd.append("file", kefu.extend.luyin.recorder.getBlob());
				var xhr = new XMLHttpRequest();
				//上传完成回调
				xhr.addEventListener("load", function (e) {
					msg.close();
					console.log('ok');
					console.log(e);
					//e.target.responseText即后台返回结果
					var data = eval('(' + e.target.responseText + ')');
					if(data.result == '1'){
						//成功
						kefu.chat.sendPluginMessage({
							url:data.url,
							size:data.size
						},'luyin');
						//切换到键盘输入方式
						kefu.chat.switchToJianpanShuruType();
					}else{
						//失败
						msg.failure(data.info);
					}
				}, false);
			
				//这里接口接收语音文件
				xhr.open("POST", kefu.api.get(kefu.api.uploadAudio));
				xhr.send(fd);
			}
		},
		/* 文件，发送文件 */
		file : {
		    name:'文件',	//插件的名字
		    //icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1619840321163" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4177" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M989.541 940.667h-858.923c0 0-68.409 10.642-68.409-80.572v-737.306c0 0 1.521-82.091 85.132-82.091h301.003c0 0 36.486-7.601 66.89 39.525 28.884 45.607 45.607 74.491 45.607 74.491 0 0 10.642 12.161 34.965 12.161-21.283 0 387.655 0 387.655 0 0 0 68.409-7.601 68.409 68.409v629.371c0 0 10.642 76.012-62.33 76.012zM925.692 362.984c0-18.243-15.202-33.445-33.445-33.445h-668.896c-19.763 0-34.965 15.203-34.965 33.445v3.040c0 19.763 15.202 34.965 34.965 34.965h668.896c18.243 0 33.445-15.203 33.445-34.965v-3.040z" fill="{color}" p-id="4178"></path></svg>', //插件的图标，一定要用这种svg格式的。
		    onclick:function(){
		    	var input = document.createElement("input");
		    	input.type = "file";
		    	input.click();
		    	input.onchange = function(){
		    		var file = input.files[0];
		    		
		    		var fd = new FormData();
					fd.append("file", file);
					var xhr = new XMLHttpRequest();
					//上传完成回调
					xhr.addEventListener("load", function (e) {
						msg.close();
						console.log(e);
						//e.target.responseText即后台返回结果
						var data = eval('(' + e.target.responseText + ')');
						if(data.result == '1'){
							//成功
							kefu.chat.sendPluginMessage({
								url:data.url,
								size:data.size,
								fileName:data.fileName
							},'file');
							//切换到键盘输入方式
							kefu.chat.switchToJianpanShuruType();
						}else{
							//失败
							msg.failure(data.info);
						}
					}, false);
					//这里接口接收文件
					xhr.open("POST", kefu.api.get(kefu.api.uploadFile));
					xhr.send(fd);
		    	};
		    },
			format:function(message){ 
				message.text = '<div style="cursor:pointer; " onclick="window.open(\''+message.extend.url+'\');"><div style="width: 3rem; float: left; height: 3rem;">'+kefu.extend.file.icon.replace(/{color}/g,kefu.ui.color.extendIconColor)+'</div><div style="text-align: left; font-size: 0.9rem; line-height: 1.4rem;width: 100%;margin-left: 3.6rem;"><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; font-size: 1rem;">'+kefu.filterXSS(message.extend.fileName)+'</div><div style="font-size: 0.7rem;">大小:'+ (message.extend.size/1)+'KB</div></div></div>';
				return message;
			}

		},
		
		/* 订单 */
		order:{
			//name:'订单',
			//icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603894275814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1559" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M128 891.663059h768a128 128 0 0 0 128-128V260.336941a128 128 0 0 0-128-128H128A128 128 0 0 0 0 260.336941v503.326118a128 128 0 0 0 128 128z m83.425882-475.376941v281.178353c0 31.051294-57.705412 31.171765-57.705411 0V334.697412c0-21.202824 7.589647-31.051294 22.64847-31.834353 12.137412-0.632471 25.057882 5.692235 38.701177 24.244706l202.390588 275.365647v-272.323765c0-37.255529 55.898353-37.225412 55.898353 0v362.767059c0 18.100706-7.559529 26.383059-22.648471 27.196235-13.673412 0.722824-24.786824-6.746353-36.261647-22.64847L211.425882 416.286118z m292.352 149.62447c0-213.232941 272.022588-212.781176 272.022589 0 0 206.667294-272.022588 208.956235-272.022589 0z m52.555294 0c0 128.813176 165.586824 133.782588 165.586824 0 0-73.667765-40.749176-103.695059-83.245176-102.912-42.496 0.783059-82.341647 32.406588-82.341648 102.912z m285.093648 97.249883c15.872 0 28.822588 12.950588 28.822588 28.822588s-12.950588 28.822588-28.822588 28.822588-28.822588-12.950588-28.822589-28.822588 12.950588-28.822588 28.822589-28.822588z" fill="{color}" p-id="1560"></path></svg>',
			//css:'./extend/order/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完kefu.js后立马加载引入这里的css
			//请求的api接口
			requestApi:'orderList.json',
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
			//name:'商品',
			//chat:'<span onclick="">商品</span>',
			//css:'./extend/goods/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完kefu.js后立马加载引入这里的css
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
		},
		//只是实现了format方法，可以看历史记录而已，具体功能需要引入对应功能js文件
		videoCall:{
			name:'视频通话',
			//icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1620038475713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6099" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M782.378667 106.666667a42.666667 42.666667 0 0 1 42.666666 42.666666v170.666667a42.666667 42.666667 0 0 1-42.666666 42.666667h-213.333334a42.666667 42.666667 0 0 1-42.666666-42.666667v-170.666667a42.666667 42.666667 0 0 1 42.666666-42.666666h213.333334z m149.333333 34.56a21.333333 21.333333 0 0 1 21.333333 21.333333v144.213333a21.333333 21.333333 0 0 1-30.890666 19.114667L825.173333 277.333333v-85.333333l97.024-48.554667a21.333333 21.333333 0 0 1 9.557334-2.261333zM732.032 748.245333a42.666667 42.666667 0 0 1 17.877333 53.845334c-13.568 36.181333-27.264 61.184-41.130666 75.050666a149.290667 149.290667 0 0 1-145.450667 38.357334 637.056 637.056 0 0 1-322.176-174.122667 637.013333 637.013333 0 0 1-174.08-322.218667 149.248 149.248 0 0 1 38.314667-145.408c13.866667-13.866667 38.869333-27.562667 75.008-41.088a42.666667 42.666667 0 0 1 53.802666 17.834667l99.84 172.928c11.349333 19.626667 5.546667 37.76-13.397333 56.746667-16.469333 14.762667-29.866667 25.216-40.192 31.402666 21.12 39.168 48.256 75.989333 81.365333 109.098667 33.152 33.152 69.973333 60.288 109.226667 81.450667 4.522667-8.746667 15.018667-22.058667 31.488-40.064 16-16 33.194667-23.978667 51.968-15.957334l4.608 2.304 172.928 99.84z" p-id="6100" fill="{color}"></path></svg>',
			format:function(message){
				if(kefu.user.id == message.sendId){
					//当前用户是此条消息的发送方
					
					if(message.extend.type == 'request'){
						message.text = '发起视频通话邀请，等待对方接听';
					}else if(message.extend.type == 'response_yes'){
						message.text = '已同意接听';
					}else if(message.extend.type == 'response_no'){
						message.text = '已拒绝接听';
					}else if(message.extend.type == 'close'){
						message.text = '已结束通话';
					}
				}else{
					//当前用户是此条消息的接收方
					
					if(message.extend.type == 'request'){
						message.text = '发起视频通话邀请';
					}else if(message.extend.type == 'response_yes'){
						message.text = '对方已同意接听';
					}else if(message.extend.type == 'response_no'){
						message.text = '对方已拒绝接听';
					}else if(message.extend.type == 'close'){
						message.text = '对方已结束通话';
					}
				}
				
				return message;
			}
		},
		//只是实现了format方法，可以看历史记录而已，具体功能需要引入对应功能js文件
		screenShare:{
			name:'屏幕共享',
			//icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1623240914776" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1944" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M889.6 127.488H141.696c-38.656 0-70.08 31.488-70.08 70.144v467.392c0 38.656 31.488 70.144 70.08 70.144h342.976v99.456H368.384c-18.688 0-33.792 13.888-33.792 30.976s15.104 30.976 33.792 30.976h294.592c18.688 0 33.792-13.888 33.792-30.976s-15.104-30.976-33.792-30.976H546.688v-99.456H889.6c38.656 0 70.144-31.424 70.144-70.144V197.568c0-38.592-31.424-70.08-70.144-70.08z m4.864 526.592a22.272 22.272 0 0 1-22.272 22.336H159.168a22.272 22.272 0 0 1-22.272-22.336V208.512c0-12.352 10.048-22.272 22.272-22.272h713.024c12.288 0 22.272 9.92 22.272 22.272V654.08zM566.976 313.984c-13.184-10.624-23.936-2.88-23.936 15.872v49.984h-2.176c-77.056 0-208.128 89.024-209.216 168.192 0 6.336 5.12 8.128 10.048 0 24.896-44.416 129.536-67.456 182.848-67.456h18.496v52.736c0 15.744 11.648 26.496 24.896 15.872l121.856-97.792c13.184-10.56 13.184-27.904 0-38.528l-122.816-98.88z" p-id="1945" fill="{color}"></path></svg>',
			format:function(message){
				if(message.extend.type == 'request'){
					//客服服务端发起，请求客户端获取客户端的屏幕
					message.text = '发起远程协助邀请';
				}else if(message.extend.type == 'response_yes'){
					message.text = '已接受远程协助邀请，正在发起...';
				}else if(message.extend.type == 'response_no'){
					//客户端拒绝客服坐席的远程协助要求，会返 response_no 消息
					message.text = '已拒绝远程协助邀请';
				}else if(message.extend.type == 'openedScreenShare'){
					message.text = '已发起屏幕分享';
				}else if(message.extend.type == 'close'){
					//客户端或客服服务端点击了停止屏幕共享功能，终止屏幕分享
					message.text = '已结束屏幕分享';
				}
				
				return message;
			}
		},
		//只是实现了format方法，可以看历史记录而已，具体功能需要引入对应功能js文件
		voiceCall:{
			name:'语音通话',
			//icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1623840306576" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2543" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512.7 64.2C266.5 64.2 65 262.5 65 511.9c0 249.4 201.5 447.7 447.7 447.7s447.7-201.5 447.7-447.7S759 64.2 512.7 64.2z m210 640c-8.2 16.4-20.5 28.8-45.2 41.1 0 0-16.4 8.2-20.5 12.3-57.5 32.9-180.7-41.1-275.2-168.4-90.4-127.3-115-262.9-57.5-295.7l8.2-4.1 8.2-4.1c28.8-16.4 45.2-24.7 69.8-20.5 24.7 4.1 41.1 20.5 57.5 45.2 32.9 57.5 24.7 86.3-16.4 110.9-4.1 0-12.3 8.2-16.4 8.2-8.2 4.1 8.2 45.2 49.3 102.7 41.1 57.5 73.9 90.4 86.3 82.2 0 0 12.3-8.2 16.4-8.2 4.1-4.1 12.3-4.1 16.4-8.2 32.9-16.4 61.6-4.1 102.7 41.1 20.6 20.3 28.8 45 16.4 65.5z m-46.9-42" p-id="2544" fill="{color}"></path></svg>',
			format:function(message){
				if(kefu.user.id == message.sendId){
					//当前用户是此条消息的发送方
					
					if(message.extend.type == 'request'){
						message.text = '发起语音通话邀请，等待对方接听';
					}else if(message.extend.type == 'response_yes'){
						message.text = '已同意接听';
					}else if(message.extend.type == 'response_no'){
						message.text = '已拒绝接听';
					}else if(message.extend.type == 'close'){
						message.text = '已结束通话';
					}
				}else{
					//当前用户是此条消息的接收方
					
					if(message.extend.type == 'request'){
						message.text = '发起语音通话邀请';
					}else if(message.extend.type == 'response_yes'){
						message.text = '对方已同意接听';
					}else if(message.extend.type == 'response_no'){
						message.text = '对方已拒绝接听';
					}else if(message.extend.type == 'close'){
						message.text = '对方已结束通话';
					}
				}
				
				return message;
			}
		}
	},
	socket:{
		url:'ws://xxxxxx',	//websocket链接的url，在 socket.connect时传入赋值
		socket:null,
		//心跳相关
		heartBeat:{
			time:40, 	//心跳时间，40秒，单位是秒。每隔40秒自动发一次心跳
			text:'{"type":"HEARTBEAT","text":"AreYouThere"}',	//心跳发起，询问服务端的心跳内容，默认是 {"type":"HEARTBEAT","text":"AreYouThere"}
			isStart:false,	//当前自动发送心跳是否启动了， false：未启动，  true：已启动
			startHeartBeat:function(){
				if(kefu.socket.heartBeat.isStart == false){
					//未启动，那么启动心跳
			        var socketHeartBeatInterval = setInterval(function(){
			        	kefu.socket.send(kefu.socket.heartBeat.text);
			        }, kefu.socket.heartBeat.time*1000);
			        kefu.socket.heartBeat.isStart = true;
			        console.log('kefu.socket headrtBeat thread start , time: '+kefu.socket.heartBeat.time+'s');
				}
			}
		},
		//连接成功时触发
		onopen:function(){
			kefu.socket.send(JSON.stringify({
		        'type': 'CONNECT' //第一次联通，登录
		        ,'token':kefu.token.get()
		    })); 
			
			//开启心跳
			kefu.socket.heartBeat.startHeartBeat();
		},
		//监听收到的消息的function
		onmessage:function(res){ 
			var message = JSON.parse(res.data);
			if(message.type != null && message.type == 'HEARTBEAT'){
				//心跳消息，忽略
				return;
			}
			//（2021.5.22 重新开启这个，这是原本的注释：去掉，因为在 kefu.ui.chat.appendMessage 时会自动执行此操作。避免 format被执行两次）
			message.text = kefu.getReceiveMessageText(message); 
			
			message.read = false;	//默认消息就是未读的。false：未读，true已读
			
			if(kefu.mode == 'pc'){
				//pc
				
				if(kefu.currentPage == 'chat'){
					//当前在chat,如果当前的chat沟通对象跟消息都是一个人，那么显示在当前chat
					if(message.sendId == kefu.chat.otherUser.id){
						message.read = true;
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
					//弹出新消息提醒
//						msg.popups('<div class="listPopupsNewMessage" onclick="kefu.ui.chat.render(\''+message.sendId+'\');">您有新消息：<div style="padding-left:1rem">'+message.text+'</div></div>');
				}else{
					//当前在chat,如果当前的chat沟通对象跟消息都是一个人，那么显示在当前chat
					if(message.sendId == kefu.chat.otherUser.id || message.type == 'SYSTEM'){
						message.read = true;
						kefu.ui.chat.appendMessage(message);    //聊天窗口增加消息
					}else{
						//消息发送方跟当前chat聊天的用户不是同一个人，那么弹出个提醒吧
						//msg.popups('<div onclick="kefu.ui.chat.render(\''+message.sendId+'\');">有新消息</div>');
						kefu.ui.chat.newMessageRemind(message);
					}
				}
			}
			
			//消息缓存
			kefu.cache.add(message);   
			
			//渲染list消息列表
			if(kefu.mode == 'pc' || kefu.currentPage == 'list'){
				//如果是pc模式，或者mobile模式的当前页面是list，那么渲染list页面
				kefu.cache.getUser(message.sendId, function(user){
					kefu.ui.list.render();	//渲染页面
				});
			}
			
			//通知提醒
			if(typeof(message.text) != 'undefined' && message.text != '' && message.text.length > 0){
				//message.text 有值，那么才算是正常的通知消息，播放消息通知
				kefu.notification.execute('您有新消息',message.text);
			}
			
		},
		//连接
		connect:function(url){
			this.url = url;
			this.reconnect.connect();
			
			//socket断线重连
	        var socketCloseAgainConnectInterval = setInterval(function(){
	        	if(typeof(kefu.socket.socket) != 'undefined' && kefu.socket.socket != null && kefu.socket.socket.readyState == kefu.socket.socket.CLOSED){
	                console.log('socketCloseAgainConnectInterval : socket closed , again connect ...');
	                kefu.socket.reconnect.connect();
	            }
	        }, 3000);
		},
		//重新连接，主要用于断线重连
		reconnect:{
			connecting:false,	//当前websocket是否是正在连接中,断线重连使用
			//重新连接
			connect:function(){
				if(!this.connecting){
					console.log('socket connect ... '+new Date().toLocaleString());
					kefu.socket.reconnect.connecting = true;	//标记已经有socket正在尝试连接了
					kefu.socket.socket = new WebSocket(kefu.socket.url);
					kefu.socket.socket.onopen = function(){
						kefu.socket.onopen();
					};
					kefu.socket.socket.onmessage = function(res){
						//res为接受到的值，如 {"emit": "messageName", "data": {}}
						kefu.socket.onmessage(res);
					};
					this.connecting = false;
				}
			},
		},
		//发送消息
		send:function(text){
			if(typeof(kefu.socket.socket) != 'undefined' && kefu.socket.socket != null && kefu.socket.socket.readyState == kefu.socket.socket.OPEN){
				if(typeof(text) == 'object'){
					text = JSON.stringify(text);
				}
				kefu.socket.socket.send(text);
			}else if(typeof(kefu.socket.socket) == 'undefined' || kefu.socket.socket == null || kefu.socket.socket.readyState == kefu.socket.socket.CLOSED || kefu.socket.socket.readyState == kefu.socket.socket.CLOSING){
				console.log('socket 已关闭，正在开启重连');
				kefu.socket.reconnect.connect();
				kefu.socket.send(text);	//重新发送
			}
		}
	}
}

