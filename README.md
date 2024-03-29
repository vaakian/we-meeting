> 本人大二写的玩具项目，里面有着无处不在的`hard code`和糟糕的代码组织结构。\
> 放在这里仅作为存档，警醒自己。

# muti-client Video chat build with SimpleWebRTC and Vue.js

移动端 操作按钮分（操作、聊天）

+ [x] 退出功能

+ [ ] 观看端 画板可收起

+ [ ] 记住用户名

+ [ ] 分享会议优化

+ [x] 移动端 收起太高

+ [x] 画板 [fabric](https://github.com/fabricjs/fabric.js) | 手机routate一下

+ [ ] js判断移动端，不显示屏幕共享

+ [ ] 主题功能

+ [ ] ~~上传图片：先转base64，然后拼接标签发送~~ **大图片不好压缩**

+ [x] 用户列表

+ [-] ~~屏幕分享还未准备好时，显示屏幕分享加载中~~ **纯黑了**

+ [-] ~~点赞功能 提示完就小时了 不保存~~ **可行性低，没有主从关系**

+ [-] ~~踢人功能~~ **没有主从关系**


+ [x] 分享会议 
   
  ** 1. 成功创建会议后，进行弹窗，分享该会议 **

   2. 导航栏常驻分享按钮，使用popper

+ [x] loading

+ [x] home界面图标

+ [x] 设置框，姓名是否常驻、全局音量: setVolumeForAll(volume)

+ [x] 修复tooltip不工作

+ [x] 视频设置成 `position: fix` 全屏(有bug)

+ [x] 视频底部问题

+ [x] 无摄像头，申请语音

+ [x] 按钮关闭 变色

+ [x] 对单个用户关闭声音

+ [x] 放大缩小 bug 动画问题

+ [x] 浏览器 不支持 则提示（待写

+ [x] 屏幕共享 screen sharing

+ [x] 回车发送消息

+ [ ] 文件共享、发送图片

+ [ ] 富文本消息

+ [x] 对用户静音、**关闭视频**

+ [x] 收到消息提示，新加入用户提示

+ [-] 关闭视频 **封面** 显示 已关闭

+ [x] 聊天类似评论

+ [ ] 全员静音 setVolumeForAll

+ [x] 进网页若url没有room参数，则有两种选项：输入已有房间号、新建会议（生成会议号、二维码、分析）

+ [ ] 默认host全屏

## 更新时需要修改

attachmediastream 导入adapter，default
simplewebrtc 432行，清空数组
409行：

```js
SimpleWebRTC.prototype.shareScreen = function (constraints, cb) {
    this.webrtc.startScreenShare(constraints, cb);
};
```

## Project setup
```
npm install
```
and run

```
npm run serve
```

## 演讲稿

素材：分屏视频（加入会议过程，离开会议提示，发送消息提示，屏幕共享，实时画板）、扫描二维码加入会议

支持目前主流的浏览器如chrome、Firefox、safari、edge等等

这里，是我们的首页，作品的设计的初衷，就是方便用户马上开始一场会议，或者临时会议。所以本系统，
只需要 房间号+成员名字 即可马上进行会议。

如果是会议发起者，可以点击创建会议，开始新的会议。

这里，我们可以选择进入会议之后是否马上开启视频、开启麦克风。

、、、进入页面

可以看到，我们的设计以简洁为主，整个页面没有太多干扰元素，所有的功能都整合到了操作面板上，

然后给操作面板设计了展开、收起的功能，最大化减少了对会议用户的视觉干扰，以得到最纯净的体验。

、、介绍面板

- 加入会议后，分享面板，复制链接发送给其他成员入会，或扫描二维码直接入会。

- 同样的，进入会议后可以进行关闭，开启本地语音视频。

- 对单个用户进行音量调节、或者静音，页面内全屏，全局全屏等。

- 侧边栏用户列表，可以输入关键字搜索。

除了最主要的多人实时视频语音，我们还加入了文字聊天、屏幕共享、实时画板

普通的文字聊天，设置了ctrl+enter发送快捷键，当发送空消息、收到消息时，页面内会进行提示。

然后再介绍屏幕共享，我们可以选择共享整个屏幕、指定用户程序窗口或者浏览器标签页面，方便用户在屏幕上进行演示操作。

在共享屏幕时也可以选择是否共享音频。

实时画板：可以进行自由会话，常见的形状、输入文字、导入图片、更换画笔的颜色，橡皮擦。

设置背景图片，

移动、返回上一步，下一步等等。

最后我们还添加了画板切换功能，当屏幕空间不够用时，可以添加一个新的画板，可以点击右侧画板编号随意切换，而不用擦除当前画板。

这里简单提一下技术细节，当作画者每进行一个动作时，将该画板的描述（这里我们使用的JSON传输每个形状的path）广播发送给会议内观看者，收到后在页面内重绘出来。
由于该描述数据量极小，相对于视频方式共享，极大的减少了网络传输压力。

简洁，不简单。

最后，ios添加到桌面可以作为app。

可以实现用户的就近接入，提供网络低延迟、低丢包率的音视频通信，具有一对一、一对多、多对多的音视频通话功能。


传统的cs模式存在以下问题：

  用户 - 服务器 - 用户，所有数据经过服务器：

  服务器高压力，意味着高延迟

WebRTC模式的p2p去中心化架构：

  用户 - 用户 ，节省了服务器，

但为什么还要有服务器？

  作为通知，类似于相亲网站。 我只负责告诉双方的信息，不参与互动。

  也就是 A 告诉 服务器，我要连接 B（带上自己的信息），那么 B回答给 A（带上自己的信息）
  此时双方都彼此知道了信息，则可以进行交互，而不需要通过服务器。
  但是需要有公网ip

无外网ip，那么只有通过nat服务器打洞了。


- 安全性

- 实时性

- 便捷性

- 解决了什么？
  
  APP种类繁多，一个网课，就下载了：腾讯会议、钉钉、QQ课堂等等……

  web是趋势，我就把会议搬到了web上。
  无需下载APP，
  马上开始会议

  - **实时** 视频互动

  - **实时** 分享屏幕

    手机端能够观看（也满足了学生需求

  - **实时** 聊天

自己的视频不能点，为什么？

  因为实时共享自己的屏幕时，又将自己全屏，那么会导致无限循环崩溃。 类似于两个镜子互相照。

横向对比（相同点）
纵向对比（不同点）

介绍时使用全屏，最后结语：

我们将这一切，都在浏览器中。 而这一切，都在web上完成了。
  432行，挂断之后，应该删除screen


```shell
// turn server
nohup turnserver -a -v  --use-auth-secret --static-auth-secret=xwj -r=mohan.z-os.cn -X 116.63.153.127 -f >1.log 2>&1 & 
```

