# Video chat build with SimpleWebRTC and Vue.js

移动端 操作按钮分（操作、聊天）


+ [x] 画板 [fabric](https://github.com/fabricjs/fabric.js) | 手机routate一下

+ [ ] 主题功能

+ [ ] 屏幕分享还未准备好时，显示屏幕分享加载中

+ [ ] 点赞功能 提示完就小时了 不保存

+ [ ] 踢人功能

+ [ ] 上传图片：先转base64，然后拼接标签发送

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


  432行，挂断之后，应该删除screen