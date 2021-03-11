
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/171845_27fa6313_429922.png "在这里输入图片标题")  |  ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/171852_eab00bf0_429922.png "在这里输入图片标题") | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0306/172305_300ad448_429922.png "在这里输入图片标题") |
|---|---|---|

# 简介
H5做的在线客服对话窗口，类似百度商桥。结合后端功能有：
1. 支持手机端、电脑端。
1. 聊天记录使用ELK持久化保存。支撑巨量聊天记录无延迟
1. 支持离线消息。上线后自动接收离线消息
1. 聊天中,上滑可无感加载历史聊天记录
1. 用户打开聊天窗口时自动给用户发送欢迎语、常见问题
1. 当用户发送消息，但客服不在线时，会自动发送设置好的一段文字给用户
1. 对已录入的常见问题进行自动匹配、自动回复。
1. 本地消息存储，最新消息的本地缓存，极致流畅度
1. 支持图片上传、发送图片、图片放大。
1. 支持表情
1. 新消息提醒。当我跟A用户正在聊天，B用户给我发来消息，顶部实时显示别的用户发来的新消息提醒
1. 支持自定义插件，如发送订单、更多自定义表情、发送商品、发送位置、文件、名片、礼物……都可以用插件方式扩展。
1. 支持自定义心跳及心跳包扩展
1. 支持断线自动重连


## 快速体验
可以进入我们这个客服项目的网站，快速测试体验：  
[www.kefu.zvo.cn](http://www.kefu.zvo.cn)

## 使用及开发
#### 懒人极速体验代码
新建一个HTML文件，其内容如下，直接用浏览器打开即可看到效果。适用于懒人。
````
<!DOCTYPE html>
<html lang="zh-cn"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>DEMO</title>
</head>
<body>
<script src="https://res.weiunity.com/wm/wm.js"></script>
<script src="https://res.weiunity.com/kefu/dev/h5Pc/h5Pc.js"></script>
<button onclick="kefu.ui.chat.entry('365fef747a9e493fb631b621ee36eed1');">打开PC端客服聊天窗口</button>
</body>
</html>
````
更多更详细的文档，已托管在码云文档，请看下面
#### 码云托管的详细文档
[![输入图片说明](http://cdn.weiunity.com/site/5348/news/8c53da0c730b4054b12f4ec629dbf7a5.png "在这里输入图片标题")](https://gitee.com/leimingyun/dashboard/wikis/leimingyun/kefujs-api-interface-of/preview?sort_id=3663196&doc_id=1274007)
文档地址：  
https://gitee.com/leimingyun/dashboard/wikis/leimingyun/kefujs-api-interface-of/preview?sort_id=3663196&doc_id=1274007

## 其他
当前项目只是开源的前端代码，后端代码尚未开源，还在不断完善，预计后端代码可能会于2021.6月份左右开源。  
您可以自己去实现其请求的几个api接口，即可自定义自己的客服系统。

#### 版权
已有知识产权保护，如果用于商业用途，没事，随便用吧！！