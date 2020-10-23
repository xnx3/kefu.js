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
	/* 如果用户已登录，这里存储的是用户的session，如果用户未登录，这里存储的是生成的 "youke+uuid" */
	token:null,
	user:{},	//当前用户信息，如： {"id":"youke_c302af1bb55de708a99fbc7266ddf016","nickname":"游客302a","head":"https://res.hc-cdn.com/cnpm-common-resource/2.0.2/base/header/components/images/logo.png","type":"youke"}
	currentPage:'',	//当前所在哪个页面， 有 list 、 chat
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
	},
	//消息提醒,有新消息的提醒声音
	voice:function(){
		var audio = document.createElement("audio");
		//https://www.huiyi8.com/sc/83766.html QQ叮咚
		audio.src = "http://data.huiyi8.com/yinxiao/mp3/83766.mp3";
		audio.play();
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
	/**
	 * 获取token，也就是 session id。获取的字符串如 f26e7b71-90e2-4913-8eb4-b32a92e43c00
	 * 如果用户未登录，那么获取到的是  youke_uuid。 这个会设置成layim 的  mine.id
	 */
	getToken:function(){
		if(this.token == null){
			this.token = kefu.storage.get('token');
		}
		if(this.token == null || this.token.length < 5){
			this.token = 'youke_'+generateUUID();
		}
		this.setToken(this.token);
		return this.token;
	},
	/**
	 * 设置token，也就是session id
	 * 格式如 f26e7b71-90e2-4913-8eb4-b32a92e43c00
	 */
	setToken:function(t){
		this.token = t;
		kefu.storage.set('token',this.token);
	},
	/**
	 * 获取当前用户(我)的User信息
	 */
	getMyUser:function(){
		if(kefu.api.getMyUser == null || kefu.api.getMyUser.length < 1){
			msg.popups('请设置 kefu.api.getMyUser 接口，用于获取当前用户(我)的信息');
			return;
		}
		request.post(kefu.api.getMyUser,{token:kefu.getToken()}, function(data){
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
	//获取接收到的消息的text内容。 msg:socket传过来的消息，会把这个消息进行处理，返回最终显示给用户看的消息体
	getReceiveMessageText:function(message){
		if(message.extend != null && message.extend.extend != null){
			//如果是插件，那么将json变为插件显示的样式
			message = kefu.extend[message.extend.extend].format(message);
		}
		//将[ul][li][br]等转化为html
		message['text'] = message['text'].replace(/\[ul\]/g, '<ul>')
								.replace(/\[\/ul\]/g, '</ul>')
								.replace(/\[li\]/g, '<li onclick="kefu.chat.question(this);">')
								.replace(/\[\/li\]/g, '</li>')
								.replace(/\[br\]/g, '<br>');
		return message['text'];
	},
	//UI界面方面
	ui:{
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
				
			    kefu.ui.list.listItemTemplate = document.getElementById('chatlist').innerHTML;   //某个用户聊天item的模板

			    var chatList = kefu.cache.getChatList();
			    var chatListLength = chatList.length;
			    var html = '';
			    for (var i = 0; i < chatListLength; i++) {
			        html = kefu.ui.list.getListItemByTemplate(chatList[i]) + html;
			    }
			    document.getElementById('chatlist').innerHTML = html;

			    //去掉chat一对一聊天窗中的监听
			    window.onscroll = null;

			    //如果chat显示，那么自动执行插件的initChat 方法,如果插件设置了的话
			    for(var key in kefu.extend){
					if(kefu.extend[key].initList != null){
						try{
							//避免某个模块中的初始化失败，导致整个im 初始化中断
							kefu.extend[key].initList();
						}catch(e){ console.log(e); }
					}
				}
			    
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

			    <section id="chatcontent">
			    </section>
			    
			    <footer id="chat_footer">
			        <div id="input_area">
			            <div id="textInput">
			                <!-- 键盘输入 -->
			                <!-- <input type="text" id="text111" onclick="kefu.chat.ui.textInputClick();"> -->
			                <div id="text" contenteditable="true" data-text="输入内容..."></div>
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
			        kefu.chat.ui.showSystemMessage(kefu.filterXSS(message['text']));
			    }else{
			        //其他类型，那么出现对话框的
			        var section = kefu.ui.chat.generateChatMessageSection(message);
			    
			        document.getElementById('chatcontent').appendChild(section);
			        //滚动条滚动到最底部
			        kefu.ui.chat.scrollToBottom();
			    }
			},
			//创建聊天正常沟通收发消息的 section dom 元素
			generateChatMessageSection:function(message){
				message['text'] = kefu.getReceiveMessageText(message);
			    //发送文本消息后绘制对话窗口
			    var section = document.createElement("section");
			    //要用kefu.chat.otherUser来判断，不能用 kefu.user, kefu.user 异步获取，有可能kefu.user 还没获取到
			    if(message['receiveId'] == kefu.chat.otherUser.id){
			        //是自己发送的这条消息，那么显示在右侧
			        section.className = 'chat user';
			        section.innerHTML = '<div class="head"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
			    }else if(message['sendId'] == kefu.chat.otherUser.id){
			        //是自己接受的这个消息，那么显示在左侧
			        section.className = 'chat otherUser';
			        section.innerHTML = '<div class="head" style="background-image: url('+kefu.chat.otherUser.head+');"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
			    }
			    return section;
			},
			//创建聊天系统提示消息的 section dom 元素 
			generateChatSystemMessageSection:function(text){
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
			                socket.send(JSON.stringify({
			                    token: kefu.getToken()
			                    ,receiveId: kefu.chat.otherUser.id
			                    ,type:"AUTO_REPLY"
			                }));
			                clearInterval(autoReplyInterval);//停止
			                console.log('autoReplyInterval stop');
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

		/**
		 * 获取当前聊天窗口中，跟我聊天的对方的user信息
		 * @param userid 当前谁在跟谁聊天，对方的userid
		 */
		getOtherUser:function(userid, func){
			if(kefu.api.getChatOtherUser == null || kefu.api.getChatOtherUser.length < 1){
				msg.popups('请设置 kefu.api.getChatOtherUser 接口，用于获取跟我沟通的对方的信息');
				return;
			}
			request.post(kefu.api.getChatOtherUser,{token:kefu.getToken(), id:userid}, function(data){
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
			var inputExtendHtml = '';
			for(var key in kefu.extend){
			    if(kefu.extend[key].chat != null && kefu.extend[key].chat.length > 0){
			        inputExtendHtml = inputExtendHtml + kefu.extend[key].chat;
			    }
			}
			document.getElementById('inputExtend').innerHTML = inputExtendHtml;
		},
		currentLoadHistoryList:false,	//跟loadHistoryList() 一起用，当加载历史列表时，此处为true，加载完后，此处变为false
		/* 加载历史聊天列表 */
		loadHistoryList(){
			if(!kefu.chat.currentLoadHistoryList){
				kefu.chat.currentLoadHistoryList = true;	//标记正在请求历史记录中
				if(kefu.cache.getUserMessageList(kefu.chat.otherUser.id).length < kefu.cache.ereryUserNumber){
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
				request.post(kefu.api.chatLog,{token:kefu.getToken(),otherId:kefu.chat.otherUser.id, time:kefu.chat.chatMessageStartTime}, function(data){
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
								var msgSection = kefu.ui.chat.generateChatMessageSection(message);
								chatcontent.insertBefore(msgSection,firstItem);
							}
							//重新标记历史消息的开始时间
							kefu.chat.chatMessageStartTime = data.startTime;
						}else{
							//没有更多消息了
							kefu.chat.currentLoadHistoryList = true;	//标记请求历史记录不再继续请求了，因为已经没有更多记录了
							//msg.info('没有更多消息了');
							chatcontent.insertBefore(kefu.ui.chat.generateChatSystemMessageSection('没有更多了'),firstItem);
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
		    	token:kefu.getToken(),
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
		    kefu.chat.ui.textInputClick();
		},
		ui:{
			//在当前ui界面显示一条系统消息, messageText:要显示的消息内容
			showSystemMessage:function(messageText){
				chatcontent = document.getElementById('chatcontent');
				chatcontent.innerHTML =  chatcontent.innerHTML + 
					'<section class="chat bot systemChat"><div class="text systemText">'+messageText+'</div></section>';
				window.scrollTo(0,chatcontent.scrollHeight);
			},
			//文字输入框被点击，隐藏扩展功能区域
			textInputClick:function (){
				//隐藏扩展功能输入区域
				document.getElementById('inputExtend').style.display = '';
				document.getElementById('inputExtendShowArea').style.display = 'none';
			}
		}

	},
	cache:{
		ereryUserNumber:20,	//每个用户缓存20条最后的聊天记录
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
				if(chatUser.length > this.ereryUserNumber) {
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
					request.send(kefu.api.getChatOtherUser,{token:kefu.getToken(), id:userid}, function(data){
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
			chat:'<span onclick="kefu.extend.face.show();">表情</span>',
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
			show:function (){
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
			chat:'<span onclick="kefu.extend.image.uploadImage();"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,image/bmp" id="imageInput" style="display:none;" />图片</span>',
			template:'<img style="max-width: 100%;" onclick="kefu.extend.image.fullScreen(\'{url}\');" src="{url}" />',
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = kefu.extend.image.template.replace(/{url}/g, kefu.filterXSS(message.extend.url));
				return message;
			},
			/* 消息发送出去。聊天框中、socket中发送、本地缓存等
				data.url : 图片上传到服务器后，返回的图片绝对路径url
			 */
			send:function(data){
				//推送到socket
            	var image = {
            		extend:'image',
            		url:data.url
            	}
				var message = {
					token:kefu.getToken(),
					receiveId:kefu.chat.otherUser.id,
					sendId:kefu.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:image
				};
				socket.send(message);

				//更新聊天窗口
				message.text = kefu.extend.image.format(message);
				kefu.ui.chat.appendMessage(message);

				kefu.cache.add(message);   //缓存
			},
			uploadImage:function(){
				//添加input改动监听
				if(document.getElementById('imageInput').oninput == null){
					document.getElementById('imageInput').oninput = function(e){
					    if(typeof(e.srcElement.files[0]) != 'undefined'){
					        var file = e.srcElement.files[0];
					        msg.loading('上传中');
					        request.upload(kefu.api.uploadImage, {token:kefu.getToken()}, file,function(data){
					            msg.close();
					            if(data.result == '1'){
					            	kefu.extend.image.send(data);
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
			chat:'<span onclick="kefu.extend.order.showOrder();">订单</span>',
			js:'./extend/order/order.js',	//引入这个扩展的自定义js。引入的这个js会在加载完kefu.js后立马加载引入这里的js
			css:'./extend/order/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完kefu.js后立马加载引入这里的css
			//初始化，kefu.js 加载完毕后会先引入指定路径的js，再执行此方法
			init:function(){

			},
			//请求的api接口
			requestApi:goodsUrl+'orderList.json',
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = kefu.extend.order.getOrderByTemplate(message.extend);
				return message;
			},
			/* 消息发送出去。聊天框中、socket中发送、本地缓存等
				data : 这里也就是order
			 */
			send:function(data){
				data.extend = 'order';
				var message = {
					token:kefu.getToken(),
					receiveId:kefu.chat.otherUser.id,
					sendId:kefu.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:data
				};
				socket.send(message);
				kefu.cache.add(message);   //缓存

				message.text = kefu.extend.order.getOrderByTemplate(data);
				kefu.ui.chat.appendMessage(message);
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
				<div class="extend_order_item" onclick="kefu.extend.order.sendOrder('{order.no}', this);">  
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
							.replace(/{goods.name}/g, kefu.filterXSS(order['name']))
							.replace(/{goods.price}/g, kefu.filterXSS(order['price']+''))
							.replace(/{order.state}/g, kefu.filterXSS(order['state']+''));
			},
			showOrder:function (){
				msg.loading('获取中');
				request.post(kefu.extend.order.requestApi,{token:kefu.getToken(), zuoxiid:kefu.chat.otherUser.id, myid:kefu.user.id}, function(data){
					msg.close();
					var html = '';
					for (var i = 0; i < data.length; i++) {
						kefu.extend.order.orderMap[data[i]['no']] = data[i];
						html = html + kefu.extend.order.getOrderByTemplate(data[i]);
					};
					msg.popups({
						text:html,
						top:'10%',
						height:'20rem'
					});
				});
			},
			//发送某个订单
			sendOrder:function (orderid, obj){
				var parentClassName = obj.parentElement.className;	//获取当前触发的onclick div的父级元素的class 的 name
				if(parentClassName == 'text'){
					//在聊天窗口中点击的，那么调取原生直接进入订单详情页面
					kefu.extend.order.otherShow(orderid);
					return;
				}
				var order = kefu.extend.order.orderMap[orderid];
				msg.close();
				
				kefu.extend.order.send(order);
			},
			//在第三方平台中，点击订单这个消息后打开的。 orderid 订单的id
			otherShow:function(orderid){
				alert('待编写。这里应该是跳转到原生app的订单详情中进行查看');
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
			/* 消息发送出去。聊天框中、socket中发送、本地缓存等
				data : 这里也就是 goods 对象
			 */
			send:function(data){
				data.extend = 'goods';
				var message = {
					token:kefu.getToken(),
					receiveId:kefu.chat.otherUser.id,
					sendId:kefu.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:data
				};
				socket.send(message);
				kefu.cache.add(message);   //缓存

				message.text = kefu.extend.goods.format(message).text;
				kefu.ui.chat.appendMessage(message);
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
				
				kefu.extend.goods.send(kefu.extend.goods.goods);
			},
			//在第三方平台中，点击订单这个消息后打开的。 orderid 订单的id
			otherShow:function(goodsid){
				alert('待编写。这里应该是跳转到原生app的商品详情中进行查看');
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
	        ,'token':kefu.getToken()
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
