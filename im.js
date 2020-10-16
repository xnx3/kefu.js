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
  n = n.toString()
  return n[1] ? n : '0' + n
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

var im = {
	//apiUrl:'http://119.3.209.5:80/', //api接口域名，格式如 http://xxxx.com/ 
	apiUrl:'http://localhost:8080/', //api接口域名，格式如 http://xxxx.com/ 
	//websocketUrl:'ws://119.3.209.5:8081/',	//websocket的url，格式如 ws://xxxx.com:8081/
	websocketUrl:'ws://localhost:8081/',	//websocket的url，格式如 ws://xxxx.com:8081/
	/* 如果用户已登录，这里存储的是用户的session，如果用户未登录，这里存储的是生成的 "youke+uuid" */
	token:null,
	user:{},	//当前用户信息，如： {"id":"youke_c302af1bb55de708a99fbc7266ddf016","nickname":"游客302a","head":"https://res.hc-cdn.com/cnpm-common-resource/2.0.2/base/header/components/images/logo.png","type":"youke"}
	//初始化，当im.js 加载完毕后，可以执行这个，进行im的初始化
	init:function(){
		var head0 = document.getElementsByTagName('head')[0];

		for(var key in im.extend){
			console.log(key);
			//加载模块的js
			if(im.extend[key].js != null && im.extend[key].js.length > 0){
				var script = document.createElement("script");  //创建一个script标签
				script.type = "text/javascript";
				script.src = im.extend[key].js;
				head0.appendChild(script);
			}

			//加载模块的css
			if(im.extend[key].css != null && im.extend[key].css.length > 0){
				var link = document.createElement('link');
				link.type='text/css';
				link.rel = 'stylesheet';
				link.href = im.extend[key].css;
				head0.appendChild(link);
			}
			
			//如果模块有初始化，那么执行其初始化 init() 方法的代码
			if(im.extend[key].init != null){
				try{
					//避免某个模块中的初始化失败，导致整个im 初始化中断
					im.extend[key].init();
				}catch(e){ console.log(e); }
			}
		}
	},	
	/**
	 * 获取token，也就是 session id。获取的字符串如 f26e7b71-90e2-4913-8eb4-b32a92e43c00
	 * 如果用户未登录，那么获取到的是  youke_uuid。 这个会设置成layim 的  mine.id
	 */
	getToken:function(){
		if(this.token == null){
			this.token = localStorage.getItem('token');
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
		localStorage.setItem('token',this.token);
	},
	//UI界面方面
	ui:{
		list:{
			listItemTemplate:'', //当list页面渲染出来后，这里自动从html中取
			html:`
				<section id="chatlist">

			        <section class="item" onclick="im.ui.chat.render('{id}');">
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

			    <div style="position: absolute;bottom: 1rem;">
			        <a href="javascript:im.ui.chat.render('243');" >测试聊天</a>
			    </div>
			`,
			getListItemByTemplate:function(item){
			    return im.ui.list.listItemTemplate
			            .replace(/{id}/g, item['id'])
			            .replace(/{text}/g, item['text'])
			            .replace(/{nickname}/g, item['nickname'])
			            .replace(/{head}/g, item['head'])
			            .replace(/{time}/g, formatTime(item['time'], 'M-D h:m'))
			            .replace(/{num}/g, '<div>&nbsp;</div>');
			},
			render:function(){
				document.body.innerHTML = im.ui.list.html;

			    im.ui.list.listItemTemplate = document.getElementById('chatlist').innerHTML;   //某个用户聊天item的模板

			    var chatList = im.cache.getChatList();
			    var chatListLength = chatList.length;
			    var html = '';
			    for (var i = 0; i < chatListLength; i++) {
			        //console.log(chatList[i]);
			        html = im.ui.list.getListItemByTemplate(chatList[i]) + html;
			    }
			    document.getElementById('chatlist').innerHTML = html;

			    //去掉chat一对一聊天窗中的监听
			    window.onscroll = null;

			    //如果chat显示，那么自动执行插件的initChat 方法,如果插件设置了的话
			    for(var key in im.extend){
					if(im.extend[key].initList != null){
						try{
							//避免某个模块中的初始化失败，导致整个im 初始化中断
							im.extend[key].initList();
						}catch(e){ console.log(e); }
					}
				}

			}
		},
		
		chat:{
			html:`
				<header class="chat_header">
			        <div class="back" id="back" onclick="im.ui.list.render();">&nbsp;</div>
			        <div class="title" id="title"><span id="nickname">在线咨询</span><span id="onlineState">在线</span></div>
			    </header>

			    <section id="chatcontent">
			    </section>

			    <footer id="chat_footer">
			        <div id="input_area">
			            <div id="textInput">
			                <!-- 键盘输入 -->
			                <input type="text" id="text" onclick="im.chat.ui.textInputClick();">
			                <input type="submit" value="发送" class="send" id="sendButton" onclick="im.chat.sendButtonClick();">
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
			//渲染出chat一对一聊天页面。 otherUserId跟我聊天的对方的userid
			render:function(otherUserId){
				//赋予chat聊天窗html的大框信息显示
				document.body.innerHTML = im.ui.chat.html;
				
				//加载跟这个人聊天的历史对话记录。不过当前是在获取对方数据之前先拉历史记录，im.chat.otherUser 肯定是null，所以先赋予默认值
				im.chat.otherUser = {
						id:otherUserId,	
						nickname:'加载中..',
						head:'./images/head.png'
				}
		        var chatCacheList = im.cache.getUserMessageList(im.chat.otherUser.id);
		        for(var i = 0; i<chatCacheList.length; i++){
		            var message = chatCacheList[i];
		            im.chat.ui.appendMessage(message);
		        }
				
			    //获取聊天对方的用户信息
			    im.chat.getOtherUser(otherUserId, function(data){
			        console.log(data);
			        //设置网页聊天窗title 的对方昵称
					document.getElementById('nickname').innerHTML = im.chat.otherUser.nickname;
					//对方在线状态
			        document.getElementById('onlineState').innerHTML = data.onlineState;
			        
			        //将对方用户发言的头像换为接口拉取的真实头像。如果当前chat模板中显示头像的话
			        try{
			        	var heads = document.getElementsByClassName("otherUser");
				        for(var i = 0; i < heads.length; i++){
				        	heads[i].getElementsByClassName("head")[0].style.backgroundImage = 'url(\''+im.chat.otherUser.head+'\')';
				        }
			        }catch(e){
			        	console.log('当前chat聊天模板中没有显示头像吧？下面这个错误只是个提示，无需理会');
			        	console.log(e);
			        }
			        
			        //取得跟这个用户聊天时，聊天窗口中显示的聊天记录的开始时间，用这个时间来获取往上滑动时的更多消息记录
			        if(chatCacheList.length > 0){
			            var lastMsg = chatCacheList[0];
			            if(lastMsg.time != null){
			                im.chat.chatMessageStartTime = lastMsg.time;
			            }
			        }
			        //如果im.chat.chatMessageStartTime还是0，那么赋予当前的13位时间戳
			        if(im.chat.chatMessageStartTime < 1){
			            im.chat.chatMessageStartTime = new Date().getTime();
			        }

			        //拉取对方设置的自动回复欢迎语
			        var autoReplyInterval = setInterval(function(){
			            if(typeof(im.chat.otherUser.id) != 'undefined'){
			                socket.send(JSON.stringify({
			                    token: im.getToken()
			                    ,receiveId: im.chat.otherUser.id
			                    ,type:"AUTO_REPLY"
			                }));
			                clearInterval(autoReplyInterval);//停止
			                console.log('autoReplyInterval stop');
			            }
			        }, 200);
			        
			        im.chat.init(); //执行chat的初始化

			        //监听滚动条，如果上滑超过多少，那么从服务器拉历史聊天记录
			        window.onscroll = function(){
			            //console.log(document.documentElement.scrollTop);
			            if(document.documentElement.scrollTop < 900){
			                //还剩一页半了，那么提前开始加载上一页
			                im.chat.loadHistoryList();
			            }
			        }

			    });

				
				//如果chat显示，那么自动执行插件的initChat 方法,如果插件设置了的话
				for(var key in im.extend){
					if(im.extend[key].initChat != null){
						try{
							//避免某个模块中的初始化失败，导致整个im 初始化中断
							im.extend[key].initChat();
						}catch(e){ console.log(e); }
					}
				}

			}
		}
	},
	/* 在聊天窗口中使用的 */
	chat:{
		otherUser:{},	//当前用户正在跟谁聊天，对方的user信息。每当打开一个跟某人的聊天窗时，会自动初始化此信息
		chatMessageStartTime:0,	//当前正在跟这个用户聊天时，聊天窗口中显示的消息列表的开始时间，13位时间戳，会根据这个来加载用户的网上滑动的消息

		/**
		 * 获取当前聊天窗口中，跟我聊天的对方的user信息
		 */
		getOtherUser:function(userid,func){
			request.post(im.apiUrl+'user/getUserById.json',{token:im.getToken(), id:userid}, function(data){
				im.chat.otherUser = data.user;
				if(typeof(func) != 'undefined'){
					func(data);
				}
			});
			
		},
		//聊天窗口滚动到最底部
		scrollToBottom:function(){
			//console.log('height:'+document.getElementById('chatcontent').scrollHeight);
			window.scrollTo(0,document.getElementById('chatcontent').scrollHeight);
		},
		/**
		 * 获取自己的User信息
		 */
		getMyUser:function(){
			request.post(im.apiUrl+'user/init.json',{token:im.getToken()}, function(data){
				im.user = data;
			});
		},
		//进入一对一聊天窗口时，先进行的初始化。主要是加载插件方面的设置
		init:function(){
			im.chat.currentLoadHistoryList=false;	//允许拉去所有历史聊天记录
			
			//聊天窗口最下方用户输入项的插件显示
			var inputExtendHtml = '';
			for(var key in im.extend){
			    if(im.extend[key].chat != null && im.extend[key].chat.length > 0){
			        inputExtendHtml = inputExtendHtml + im.extend[key].chat;
			    }
			}
			document.getElementById('inputExtend').innerHTML = inputExtendHtml;
		},
		/* 创建聊天正常沟通收发消息的 section dom 元素 */
		generateChatMessageSection:function(message){
			//console.log(message);
			if(message.extend != null && message.extend.extend != null){
				//如果是插件，那么将json变为插件显示的样式
				message = im.extend[message.extend.extend].format(message);
			}
			//将[ul][li][br]等转化为html
			message['text'] = message['text'].replace(/\[ul\]/g, '<ul>')
									.replace(/\[\/ul\]/g, '</ul>')
									.replace(/\[li\]/g, '<li onclick="im.chat.question(this);">')
									.replace(/\[\/li\]/g, '</li>')
									.replace(/\[br\]/g, '<br>');
		    //发送文本消息后绘制对话窗口
		    var section = document.createElement("section");
		    //要用im.chat.otherUser来判断，不能用 im.user, im.user 异步获取，有可能im.user 还没获取到
		    if(message['receiveId'] == im.chat.otherUser.id){
		        //是自己发送的这条消息，那么显示在右侧
		        section.className = 'chat user';
		        section.innerHTML = '<div class="head"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
		    }else if(message['sendId'] == im.chat.otherUser.id){
		        //是自己接受的这个消息，那么显示在左侧
		        section.className = 'chat otherUser';
		        section.innerHTML = '<div class="head" style="background-image: url('+im.chat.otherUser.head+');"></div><div class="sanjiao"></div><div class="text">'+message['text']+'</div>';
		    }
		    return section;
		},
		/* 创建聊天系统提示消息的 section dom 元素 */
		generateChatSystemMessageSection:function(text){
			var section = document.createElement("section");
			section.className = 'chat bot systemChat';
			section.innerHTML = '<div class="text systemText">'+text+'</div>';
			return section;
		},
		currentLoadHistoryList:false,	//跟loadHistoryList() 一起用，当加载历史列表时，此处为true，加载完后，此处变为false
		/* 加载历史聊天列表 */
		loadHistoryList(){
			if(!im.chat.currentLoadHistoryList){
				im.chat.currentLoadHistoryList = true;	//标记正在请求历史记录中
				if(im.cache.getUserMessageList(im.chat.otherUser.id).length < im.cache.ereryUserNumber){
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
				request.post(im.apiUrl+'chatLog.json',{token:im.getToken(),otherId:im.chat.otherUser.id, time:im.chat.chatMessageStartTime}, function(data){
					im.chat.currentLoadHistoryList = false;	//标记请求历史记录已请求完成，可以继续请求下一次聊天记录了

					var chatcontent = document.getElementById('chatcontent');
					//删除聊天记录加载中的提示
					chatcontent.removeChild(document.getElementById('historyListLoading'));
					//删除聊天记录加载中的提示section后，取第一个正常聊天沟通的section，用来作为插入的定位
					var firstItem = chatcontent.getElementsByTagName("section")[0];

					console.log(data);
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
								var msgSection = im.chat.generateChatMessageSection(message);
								chatcontent.insertBefore(msgSection,firstItem);
							}
							//重新标记历史消息的开始时间
							im.chat.chatMessageStartTime = data.startTime;
						}else{
							//没有更多消息了
							im.chat.currentLoadHistoryList = true;	//标记请求历史记录不再继续请求了，因为已经没有更多记录了
							//msg.info('没有更多消息了');
							chatcontent.insertBefore(im.chat.generateChatSystemMessageSection('没有更多了'),firstItem);
						}

						
						
						
					}
				});
			}
		},
		/* 常见问题 */
		question:function(obj){
			var text = obj.innerHTML;
			console.log(obj.innerHTML);
			im.chat.sendTextMessage(text);
		},
		/* 发送文本格式消息  text:要发送的文本消息。 返回json对象的message */
		sendTextMessage:function(text){
			var data = {
		    	token:im.getToken(),
		    	type:'MSG',	//消息类型
		    	sendId:im.user.id,		//发送者ID
		    	receiveId:im.chat.otherUser.id,	//接受者id
		    	text:text,
		        time:new Date().getTime()      
		    }
		    var message = JSON.stringify(data);
		    im.chat.ui.appendMessage(message);    //聊天窗口增加消息
		    socket.send(message);       //socket发送
		    im.cache.add(message);   //缓存

		    return message;
		},
		//text文本，打字沟通交流， 点击提交按钮后发送
		sendButtonClick:function (){
		    var value = document.getElementById('text').value;
		    if(value.length == 0){
		        msg.info('尚未输入');
		        return;
		    }

		    //接口提交-文本对话，输入文字获取对话结果
		    msg.loading("发送中");    //显示“更改中”的等待提示
		    
		    im.chat.sendTextMessage(document.getElementById('text').value);
			msg.close();	//关闭发送中提示
		    //清空内容区域
		    document.getElementById('text').value = '';

		    //隐藏表情等符号输入区域
		    im.chat.ui.textInputClick();
		},
		ui:{
			//发送一条消息，消息末尾追加消息
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
			        im.chat.ui.showSystemMessage(message.content);
			    }else{
			        //其他类型，那么出现对话框的
			        var section = im.chat.generateChatMessageSection(message);
			    
			        document.getElementById('chatcontent').appendChild(section);
			        //滚动条滚动到最底部
			        im.chat.scrollToBottom();
			    }
			},
			//在当前ui界面显示一条系统消息
			showSystemMessage:function(msg){
				chatcontent = document.getElementById('chatcontent');
				chatcontent.innerHTML =  chatcontent.innerHTML + 
					'<section class="chat bot systemChat"><div class="text systemText">'+msg+'</div></section>';
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
			var chatListStr = localStorage.getItem('userid:'+userid);
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
			if(message['sendId'] == im.user.id){
				//这条消息是自己发送出去的
				otherUserId = message['receiveId'];
			}else if(message['receiveId'] == im.user.id){
				//自己是消息接收者，别人发过来的消息
				otherUserId = message['sendId'];
			}
			//console.log(otherUserId);
			if(otherUserId != '0' && otherUserId.length > 0){

				//保存单独跟这个用户的聊天记录
				var chatUserStr = localStorage.getItem('userid:'+otherUserId);
				if(chatUserStr == null || chatUserStr.length < 1){
					chatUserStr = '[]';
				}
				var chatUser = JSON.parse(chatUserStr);
				chatUser.push(message);
				if(chatUser.length > this.ereryUserNumber) {
					//console.log('移除：'+chatUser[0]);
					chatUser.splice(0, 1);	//移除最后一个
				}
				localStorage.setItem('userid:'+otherUserId, JSON.stringify(chatUser));
				//console.log('保存：'+JSON.stringify(chatList))

				//保存聊天列表的最后一条聊天消息
				this.pushChatList(otherUserId, message);
			}

			
		},
		/* 获取聊天列表的缓存 */
		getChatList:function(){
			var chatListStr = localStorage.getItem('list');
			if(chatListStr == null || chatListStr.length < 1){
				chatListStr = '[]';
			}
			var chatList = JSON.parse(chatListStr);
			return chatList;
		},
		/* 往聊天列表中添加最后一次沟通的记录 */
		pushChatList:function(otherUserId, message){
			var chatList = this.getChatList();

			//聊天内容
			var text = message.text;
		    if(message.type == 'EXTEND'){
		        text = im.extend[message.extend.extend].name;
		    }

			//组合新的消息
			var newMessage = {
				id:otherUserId,	//对方的userid
				text:text,		//最后一次沟通的内容
				nickname:im.chat.otherUser.nickname,	//对方的昵称
				head:im.chat.otherUser.head, 	//对方的头像
				time:message.time 			//消息产生的时间。
			}
			if(newMessage.time == null){
				newMessage.time = parseInt(new Date().getTime()/1000);
			}

			var chatListLength = chatList.length;
			for (var i = 0; i < chatListLength; i++) {
				// console.log(i);
				// console.log(chatList[i]);
				
				if(chatList[i] != null && chatList[i]['id'] == otherUserId){
					// console.log(chatList[i]);
					// console.log('delete');
					chatList.splice(i, 1);	//移除跟这个用户的上一条记录。以便存最新的
					continue;
				}
			}
			chatList.push(newMessage);
			//console.log(chatList);
			localStorage.setItem('list', JSON.stringify(chatList));
		}
	},
	/* 扩展，比如表情、图片、订单、商品 */
	extend:{
		/* 表情 */
		face:{
			name:'表情',
			chat:'<span onclick="im.extend.face.show();">表情</span>',
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
				for(var key in im.extend.face.faces){
					html = html + '<span onclick="im.extend.face.insert(\''+key+'\');">'+im.extend.face.faces[key]+'</span>';
				};
				html = html+'</div>';

				//隐藏扩展功能栏
				document.getElementById('inputExtend').style.display = 'none';
				document.getElementById('inputExtendShowArea').style.display = '';

				document.getElementById('inputExtendShowArea').innerHTML = html;
			},
			/* 向输入框中插入表情 */
			insert:function (key){
				document.getElementById('text').value = document.getElementById('text').value + im.extend.face.faces[key];
			}

		},
		/* 图片上传 */
		image:{
			name:'图片',
			chat:'<span onclick="uploadImage();"><input type="file" id="imageInput" style="display:none;">图片</span>',
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = '<img style="max-width: 100%;" src="'+message.extend.url+'" />';
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
					token:im.getToken(),
					receiveId:im.chat.otherUser.id,
					sendId:im.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:image
				};
				socket.send(message);

				//更新聊天窗口
				message.text = '<img style="max-width: 100%;" src="'+data.url+'" />';
				im.chat.ui.appendMessage(message);

				im.cache.add(message);   //缓存
			}
		},
		/* 订单 */
		order:{
			name:'订单',
			chat:'<span onclick="im.extend.order.showOrder();">订单</span>',
			js:'./extend/order/order.js',	//引入这个扩展的自定义js。引入的这个js会在加载完im.js后立马加载引入这里的js
			css:'./extend/order/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完im.js后立马加载引入这里的css
			//初始化，im.js 加载完毕后会先引入指定路径的js，再执行此方法
			init:function(){

			},
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = im.extend.order.getOrderByTemplate(message.extend);
				return message;
			},
			/* 消息发送出去。聊天框中、socket中发送、本地缓存等
				data : 这里也就是order
			 */
			send:function(data){
				data.extend = 'order';
				var message = {
					token:im.getToken(),
					receiveId:im.chat.otherUser.id,
					sendId:im.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:data
				};
				socket.send(message);
				im.cache.add(message);   //缓存

				message.text = im.extend.order.getOrderByTemplate(data);
				im.chat.ui.appendMessage(message);
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
				<div class="extend_order_item" onclick="im.extend.order.sendOrder('{order.no}', this);">  
				    <div class="orderInfo">
				        <div class="order_no">订单号：{order.no}</div>
				        <div class="order_time">{order.time}</div>
				    </div>
				    <div class="goodsInfo">
				    	<img class="image" src="{goods.image}" />
					    <div class="goodsAttr">
					        <div class="name">{goods.name}</div>
					        <div>
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
				return im.extend.order.listTemplate
							.replace(/{order.no}/g, order['no'])
							.replace(/{order.time}/g, order['time'])
							.replace(/{goods.image}/g, order['image'])
							.replace(/{goods.name}/g, order['name'])
							.replace(/{goods.price}/g, order['price'])
							.replace(/{order.state}/g, order['state']);
			},
			showOrder:function (){
				msg.loading('获取中');
				request.get(goodsUrl+'orderList.json',{token:im.getToken()}, function(data){
					msg.close();
					var html = '';
					for (var i = 0; i < data.length; i++) {
						im.extend.order.orderMap[data[i]['no']] = data[i];
						html = html + im.extend.order.getOrderByTemplate(data[i]);
					};
					msg.popups({
						text:html,
						top:'20%',
						bottom:'5rem'
					});
				});
			},
			//发送某个订单
			sendOrder:function (orderid, obj){
				var parentClassName = obj.parentElement.className;	//获取当前触发的onclick div的父级元素的class 的 name
				if(parentClassName == 'text'){
					//在聊天窗口中点击的，那么调取原生直接进入订单详情页面
					//...
					alert('待编写。这里应该是跳转到原生app的订单详情中进行查看');
					return;
				}
				var order = im.extend.order.orderMap[orderid];
				msg.close();
				
				im.extend.order.send(order);
			}
		},
		/* 商品 */
		goods:{
			name:'商品',
			//chat:'<span onclick="">商品</span>',
			css:'./extend/goods/style.css',	//引入这个扩展的自定义css。引入的这个css会在加载完im.js后立马加载引入这里的css
			//初始化，im.js 加载完毕后会先引入指定路径的js，再执行此方法
			init:function(){

			},
			//初始化，当打开chat窗口时，所有初始化的东西完事后，会自动执行此处
			initChat:function(){
				showGoodsSendWindow();
			},
			/* 将message.extend 的json消息格式化为对话框中正常浏览的消息 */
			format:function(message){
				message.text = im.extend.goods.getGoodsByTemplate(message.extend);
				return message;
			},
			/* 消息发送出去。聊天框中、socket中发送、本地缓存等
				data : 这里也就是 goods 对象
			 */
			send:function(data){
				data.extend = 'goods';
				var message = {
					token:im.getToken(),
					receiveId:im.chat.otherUser.id,
					sendId:im.user.id,
					type:'EXTEND',
					time:new Date().getTime(),
					extend:data
				};
				socket.send(message);
				im.cache.add(message);   //缓存

				message.text = im.extend.goods.format(message).text;
				im.chat.ui.appendMessage(message);
			},
			/*
				商品图片 {image}
				商品名字 {name}
				商品价格 {price}
			*/
			template : `
				<!-- 弹出的商品发送 -->
			    <div class="extend_goods_item" onclick="im.extend.goods.sendGoods('{id}', this);">  
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
				return im.extend.goods.template
						.replace(/{id}/g, goods['id'])
						.replace(/{name}/g, goods['name'])
						.replace(/{price}/g, goods['price'])
						.replace(/{image}/g, goods['image']);
			},
			//发送商品
			sendGoods : function (goodsid, obj){
				var parentClassName = obj.parentElement.className;	//获取当前触发的onclick div的父级元素的class 的 name
				console.log(parentClassName);
				if(parentClassName == 'text'){
					//在聊天窗口中点击的，那么调取原生直接进入订单详情页面
					//...
					alert('待编写。这里应该是跳转到原生app的订单详情中进行查看');
					return;
				}

				if(goodsid != im.extend.goods.goods.id){
					msg.failure('商品id异常！');
				}
				console.log(im.extend.goods.goods);
				msg.close();
				
				im.extend.goods.send(im.extend.goods.goods);
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
	        ,'token':im.getToken()
	    })); 
	},
	//监听收到的消息的function
	onmessage:function(res){ 
		var json = JSON.parse(res.data);
	    im.chat.ui.appendMessage(json);    //聊天窗口增加消息
	    im.cache.add(json);   //缓存
	},
	
	connect:function(url){
		this.url = url;
		this.socket = new WebSocket(url);

		this.socket.onopen = function(){
			socket.onopen();
		};
		this.socket.onmessage = function(res){
			//res为接受到的值，如 {"emit": "messageName", "data": {}}
			socket.onmessage(res);
		};
	},
	//重新连接，主要用于断线重连
	reconnect:function(){
		this.connect(this.url);
	},
	
	send:function(text){
		if(this.socket.readyState == this.socket.OPEN){
			if(typeof(text) == 'object'){
				text = JSON.stringify(text);
			}
			this.socket.send(text);
		}else if(this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING){
			alert('socket 已关闭，正在开启重连');
			this.reconnect();
		}
		
	}
}





//上传图片
function uploadImage(){
	//添加input改动监听
	if(document.getElementById('imageInput').oninput == null){
		console.log('input');
		document.getElementById('imageInput').oninput = function(e){
		    if(typeof(e.srcElement.files[0]) != 'undefined'){
		        var file = e.srcElement.files[0];
		        msg.loading('上传中');
		        request.upload(im.apiUrl+'uploadImage.json', {token:im.getToken()}, file,function(data){
		            msg.close();
		            console.log(data);
		            if(data.result == '1'){
		            	im.extend.image.send(data);
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
}
