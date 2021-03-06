
# 简介
H5做的在线客服，其实就是一个对话窗口。

| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/171845_27fa6313_429922.png "在这里输入图片标题")  |  ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/171852_eab00bf0_429922.png "在这里输入图片标题") | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/172305_300ad448_429922.png "在这里输入图片标题") |
|---|---|---|


## 扩展（开发插件）
增加一个插件示例，插件名字叫 example
````
kefu.extend.example = {
	name:'我是example',	//插件的名字
}
````
执行完上面代码后，在客服界面是没有任何体现的。也就是还没有任何地方在使用，是没有什么作用，没有用到的。

#### icon 插件图标
如果设置了此项，那么在chat聊天界面的最底部显示此插件输入。
````
kefu.extend.example.icon = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1603894373099" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2514" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512 979C263.472 979 62 777.528 62 529S263.472 79 512 79s450 201.472 450 450-201.472 450-450 450zM337 479c41.421 0 75-33.579 75-75s-33.579-75-75-75-75 33.579-75 75 33.579 75 75 75z m350 0c41.421 0 75-33.579 75-75s-33.579-75-75-75-75 33.579-75 75 33.579 75 75 75zM312 629c0 110.457 89.543 200 200 200s200-89.543 200-200H312z" fill="{color}" p-id="2515"></path></svg>';
````
设置icon，请使用 svg 格式的图片！想找什么svg图片，可以从这里下载 https://www.iconfont.cn/
其中svg图片中的 fill="{color}"，也就是 fill 的颜色值用{color} 来代替。kefu.js会自动将其统一赋予指定颜色。 可以直接使用 kefu.extendIconColor='#333333'; 来设定所有插件图标的颜色。 

#### js 引入外部js文件
示例：
````
kefu.extend.example.js = 'https://xxxxxx.com/test.js';
````
当执行了 kefu.init(); 就会自动加载此处设置的js路径。也就相当于 <script src="xxxxx"></script> 引入的

#### css 引入外部css样式文件
示例：
````
kefu.extend.example.css = 'https://xxxxxx.com/test.css';
````
当执行了 kefu.init(); 就会自动加载此处设置的css路径。也就相当于 <link rel="stylesheet" type="text/css" href="xxxxxxx"> 引入的


#### init 加载完kefu.js初始化时自动执行的方法
无论是在list列表，还是在chat一对一聊天窗口，只要执行了 kefu.init(); 就会自动执行插件的这个方法
示例：
````
kefu.extend.example.init=function(){
	alert('执行了example 的 init()');
}
````


#### initChat 进入chat自动执行初始化
当进入chat聊天页面时，自动执行此方法进行初始化。
每当打开一个chat窗口，都会自动执行此方法。
kefu.js 加载完毕后会先引入指定路径的js，再执行此方法
使用：
````
kefu.extend.example.initChat=function(){
	alert('自动执行了插件example的initChat方法');
}
````


#### format 格式化消息
接收到最新消息后，将消息代码(JSON格式字符串)自动格式化为用户正常看到的消息。

比如图片，接收到的消息代码为：
````
{
    "token":"token",
    "receiveId":"399",
    "sendId":"454",
    "type":"EXTEND",
    "time":1603952723916,
    "extend":{
        "name":"image",
        "url":"https://yunkefu.obs.cn-north-4.myhuaweicloud.com/im/image/065742ddcda649059f916fd64a8d2492.png"
    }
}
````
使用此，将消息代码转化为用户能在聊天框中看到的正常图片：
````
kefu.extend.example.format=function(message){
	message.text = '<img style="max-width: 100%;" src="'+kefu.filterXSS(message.extend.url)+'" />';
	return message;
},
````
其中 message.text 便是能在聊天框中正常显示的HTML代码

#### onclick 当插件被点击触发
插件在chat底部的显示中，被点击后触发此方法。
使用：
````
kefu.extend.example.onclick=function(){
	alert('插件example被点击了');
}
````

注意，增加插件的js代码，一定要放在 kefu.init(); 之前。


## 目前支持的UBB标签
| ubb标签 | 被替换为html标签 | 
|---|---|
| [br] | ````<br/>````  |
|  [img]url...[/img] | ````<img src="url..." />````  |
| [ul] | ````<ul>````  |
| [/ul] | ````</ul>````  |
| [li] | ````<li>````  |
| [/li] | ````</li>````  |


## kefu.js 的代码压缩：
https://jscompressor.com/
